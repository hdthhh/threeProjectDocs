<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div id="aaa" ref="a"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import lightglsl from '../components/assets/glsl/light.glsl';

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
  // powerPreference: 'low-power',
  // preserveDrawingBuffer: false,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap
let PixelRatio=Math.min(window.devicePixelRatio, 1.5)
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
let gui = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui = new GUI({ container: a.value })
  add()

  resizefn = () => {
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
const clock = new THREE.Clock()
let animationId
function animate() {
  const elapsedTime = clock.getElapsedTime()

  juan.rotation.x = -elapsedTime * 0.5
  juan.rotation.y = elapsedTime * 0.5
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.5
    suzanne.rotation.y = elapsedTime * 0.5
  }

  material.uniforms.uResolution.value.set(ddd.value.offsetWidth / PixelRatio, ddd.value.offsetHeight  / PixelRatio)

  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);

const materialParams = {}
materialParams.color = '#ff794d'
materialParams.shadeColor='#8e19b8'
materialParams.shadowColor = '#8e19b8'
materialParams.lightColor = '#e5ffe0'

const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main(){
    vec4 modelPosition=modelMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vPosition= modelPosition.xyz;
    vec4 modelNormal =modelMatrix*vec4(normal, 0.0);
    vNormal=modelNormal.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform vec3 uShadowColor;
  uniform float uShadowRepectitions;
  uniform vec3 uLightColor;
  uniform float uLightRepectitions;

  // light glsl
  ${lightglsl}

  vec3 halftone(vec3 color,float repetitions,vec3 direction,float low,float high,vec3 pointColor,vec3 normal){
    float intensity=dot(normal,direction);
    intensity=smoothstep(low,high,intensity);

    vec2 uv=gl_FragCoord.xy/uResolution.y;
    uv*=repetitions;
    uv=mod(uv,1.0);

    float point=distance(uv,vec2(0.5));
    point=1.0-step(0.5*intensity,point);

    return mix(color,pointColor,point);
  }

  void main(){
    vec3 viewDirection=normalize(vPosition-cameraPosition);
    vec3 normal=normalize(vNormal);
    vec3 color=uColor;

    vec3 light=vec3(0.0);
    light+=AmbientLight(vec3(1.0),1.0);    
    light+=DirectionalLight(vec3(1.0,1.0,1.0),1.0,normal,vec3(1.0,1.0,0.0),viewDirection,1.0);
    color*=light;

    // float repetitions=50.0;
    // vec3 direction= vec3(0.0,-1.0,0.0);
    // float low=-0.8;
    // float high=1.5;
    // vec3 pointColor=vec3(1.0,0.0,0.0);

    // 底部紫光
    color = halftone(color,uShadowRepectitions,vec3(0.0,-1.0,0.0),-0.8,1.5,uShadowColor,normal);
    // 顶部黄光
    color = halftone(color,uLightRepectitions,vec3(1.0,1.0,0.0),0.5,1.5,uLightColor,normal);

    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uColor: { value: new THREE.Color(materialParams.color) },
    uShadeColor: { value: new THREE.Color(materialParams.shadeColor) },
    uResolution: { value: new THREE.Vector2(window.innerWidth  / PixelRatio, window.innerHeight / PixelRatio) },
    uShadowColor: { value: new THREE.Color(materialParams.shadowColor) },
    uShadowRepectitions: new THREE.Uniform(100),
    uLightColor: { value: new THREE.Color(materialParams.lightColor) },
    uLightRepectitions: new THREE.Uniform(100),
  },
})

const qiu = new THREE.Mesh(new THREE.SphereGeometry(4, 64, 32), material)
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(2, 0.8, 100, 20), material)
juan.position.set(10, 0, 0)
scene.add(qiu, juan)

let suzanne = null
loader.load('/threeProjectDocs/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material = material
  })
  gltf.scene.position.set(-10, 0, 0)
  gltf.scene.scale.set(4, 4, 4)
  suzanne = gltf.scene
  scene.add(gltf.scene)
})

const colors = {
  bgcolor: new THREE.Color('rgb(33, 20, 41)'),
  // boxcolor: new THREE.Color('rgb(254, 110, 66)'),
}
scene.environment = colors.bgcolor
scene.background = colors.bgcolor

function add() {
  gui.addColor(colors, 'bgcolor').onChange(() => { scene.environment = colors.bgcolor; scene.background = colors.bgcolor })
  gui.addColor(materialParams, 'color').onChange(() => { material.uniforms.uColor.value.set(materialParams.color) })
  gui.addColor(materialParams, 'shadowColor').onChange(() => { material.uniforms.uShadowColor.value.set(materialParams.shadowColor) })
  gui.add(material.uniforms.uShadowRepectitions, 'value').min(1).max(300).step(1).name('ShadowRepectitions')
  gui.addColor(materialParams, 'lightColor').onChange(() => { material.uniforms.uLightColor.value.set(materialParams.lightColor) })
  gui.add(material.uniforms.uLightRepectitions, 'value').min(1).max(300).step(1).name('LightRepectitions')
}
</script>

<style scoped>
#aaa{
  position: absolute;
  top: 0;
  right: 0;
}</style>