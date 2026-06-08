<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div id="aaa" ref="a"></div>
</template>

<script setup aysnc>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import simplexNoise4dFile from '../components/assets/glsl/simplexNoise4d.glsl'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap
render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)
let resizefn = null
let gui=null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui = new GUI({ container: a.value })
  add()

  resizefn = () => {
    particles.material.uniforms.uResolution.value.set(ddd.value.offsetWidth * window.devicePixelRatio, ddd.value.offsetHeight* window.devicePixelRatio)

    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = ddd.value.offsetWidth/ ddd.value.offsetHeight
    camera.updateProjectionMatrix()
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

})
onUnmounted(() => {
  gui.destroy()
  // render.dispose();

  cancelAnimationFrame(animationId)
  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose()

    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose())
      } else {
        obj.material.dispose()
      }
    }

    if (obj.texture) obj.texture.dispose()
  })
  scene.clear()
  render.forceContextLoss()
  // render.dispose()
  window.removeEventListener('resize', resizefn)
})
// const gui = new GUI()
let animationId
const clock = new THREE.Clock()
let previousTime = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  gpgpu.computation.compute()
  particles.material.uniforms.uParticlesTexture.value = gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
  gpgpu.particlesVariable.material.uniforms.uTime.value = elapsedTime
  gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime

  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);

const gltf = await loader.loadAsync('/threeProjectDocs/boat.glb')
console.log(gltf)

const baseGeometry = {}
// baseGeometry.instance = new THREE.SphereGeometry(3)
baseGeometry.instance=gltf.scene.children[0].geometry
baseGeometry.count = baseGeometry.instance.attributes.position.count

const gpgpu = {}
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count))
gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, render)

const baseParticlesTexture = gpgpu.computation.createTexture()
for (let i = 0; i < baseGeometry.count; i++) {
  const i3 = i * 3
  const i4 = i * 4
  // Position based on geometry
  baseParticlesTexture.image.data[i4 + 0] = baseGeometry.instance.attributes.position.array[i3 + 0]
  baseParticlesTexture.image.data[i4 + 1] = baseGeometry.instance.attributes.position.array[i3 + 1]
  baseParticlesTexture.image.data[i4 + 2] = baseGeometry.instance.attributes.position.array[i3 + 2]
  // baseParticlesTexture.image.data[i4 + 3] = 0
  baseParticlesTexture.image.data[i4 + 3] = Math.random()
}


let gpgpuParticlesShader = `
uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

${simplexNoise4dFile}

void main(){
  float time =uTime * 0.2;
  vec2 uv= gl_FragCoord.xy/resolution.xy;
  vec4 particle =texture(uParticles,uv);
  vec4 base =texture(uBase,uv);
  // particle.x+=0.01;

  if(particle.a >= 1.0){
    // particle.a = 0.0;
    particle.a=mod(particle.a,1.0);
    // particle.a=fract(particle.a);
    particle.xyz=base.xyz;
  }
  else {
    // float strength =simplexNoise4d(vec4(base.xyz,time + 1.0));
    float strength =simplexNoise4d(vec4(base.xyz*0.2,time + 1.0));
    float influence =(uFlowFieldInfluence-0.5)*(-2.0);
    // strength=smoothstep(-1.0,1.0,strength);
    // strength=smoothstep(0.0,1.0,strength);
    strength=smoothstep(influence,1.0,strength);

    // vec3 flowField = vec3(
    //   simplexNoise4d(vec4(particle.xyz + 0.0,time)),
    //   simplexNoise4d(vec4(particle.xyz + 1.0,time)),
    //   simplexNoise4d(vec4(particle.xyz + 2.0,time))
    // );
    vec3 flowField = vec3(
      simplexNoise4d(vec4(particle.xyz *uFlowFieldFrequency + 0.0,time)),
      simplexNoise4d(vec4(particle.xyz *uFlowFieldFrequency + 1.0,time)),
      simplexNoise4d(vec4(particle.xyz *uFlowFieldFrequency + 2.0,time))
    );
    flowField = normalize(flowField);
    // particle.xyz += flowField*0.01;
    // particle.xyz += flowField*uDeltaTime*0.5;
    // particle.xyz += flowField*uDeltaTime*strength*0.5;
    particle.xyz += flowField*uDeltaTime*strength*uFlowFieldStrength;

    // particle.a+=0.01;
    particle.a+=uDeltaTime*0.3;
  }
  

  gl_FragColor=particle;
}`
// 粒子变量
gpgpu.particlesVariable = gpgpu.computation.addVariable('uParticles', gpgpuParticlesShader, baseParticlesTexture)
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [gpgpu.particlesVariable])

gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0)
gpgpu.particlesVariable.material.uniforms.uDeltaTime = new THREE.Uniform(0)
gpgpu.particlesVariable.material.uniforms.uBase = new THREE.Uniform(baseParticlesTexture)
gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence = new THREE.Uniform(0.5)
gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength = new THREE.Uniform(2)
gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency = new THREE.Uniform(0.5)

gpgpu.computation.init()

gpgpu.debug = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshBasicMaterial({
    map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture
  })
)
gpgpu.debug.position.x = 3
gpgpu.debug.visible=false
scene.add(gpgpu.debug)


const particles = {}

const particlesUvArray = new Float32Array(baseGeometry.count * 2)
const sizeArray = new Float32Array(baseGeometry.count)

for (let y = 0; y < gpgpu.size; y++) {
  for (let x = 0; x < gpgpu.size; x++) {
    const i = (y * gpgpu.size) + x
    const i2 = i * 2
    const uvX = (x + 0.5) / gpgpu.size
    const uvY = (y + 0.5) / gpgpu.size
    particlesUvArray[i2 + 0] = uvX
    particlesUvArray[i2 + 1] = uvY

    sizeArray[i]=Math.random()
  }
}

particles.geometry = new THREE.BufferGeometry()
particles.geometry.setDrawRange(0, baseGeometry.count)
particles.geometry.setAttribute('aParticlesUv', new THREE.BufferAttribute(particlesUvArray, 2))
particles.geometry.setAttribute('aColor', baseGeometry.instance.attributes.color)
particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizeArray, 1))

particles.material = new THREE.ShaderMaterial({
  vertexShader: `
  uniform vec2 uResolution;
  uniform float uSize;
  uniform sampler2D uParticlesTexture;

  attribute vec2 aParticlesUv;
  attribute vec3 aColor;
  attribute float aSize;

  varying vec3 vColor;

  void main(){
    vec4 particle = texture(uParticlesTexture,aParticlesUv);

    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float sizeIn=smoothstep(0.0,0.1,particle.a);
    float sizeOut=1.0-smoothstep(0.7,1.0, particle.a);
    float size = min(sizeIn, sizeOut);

    // Point size
    // gl_PointSize = uSize * uResolution.y;
    // gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize = size * aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // vColor = vec3(1.0);
    vColor = aColor;
  }`,
  fragmentShader: `
  varying vec3 vColor;

  void main(){
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.5)
        discard;
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uSize: new THREE.Uniform(0.07),
    uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth  * window.devicePixelRatio, window.innerHeight* window.devicePixelRatio)),
    uParticlesTexture: new THREE.Uniform()
  }
})

particles.points = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.points)

const debugObject = {}
debugObject.clearColor = '#29191f'
render.setClearColor(debugObject.clearColor)

function add() {
  gui.addColor(debugObject, 'clearColor').onChange(() => { render.setClearColor(debugObject.clearColor) })
  gui.add(particles.material.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize')
  // loader.load('/boat.glb', (gltf) => {
  //   console.log(gltf)
  // })
  gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence, 'value').min(0).max(1).name('uFlowFieldInfluence')
  gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 'value').min(0).max(10).name('uFlowFieldStrength')
  gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency, 'value').min(0).max(1).step(0.001).name('uFlowFieldFrequency')
}

</script>

<style scoped>
#aaa{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}</style>