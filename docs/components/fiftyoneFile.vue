<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100);
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true
OrbitControl.dampingFactor = 0.01

camera.position.set(10, 10, 10)

let resizefn = null
onMounted(() => {
  resizefn = () => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    camera.aspect = ddd.value.offsetWidth/ ddd.value.offsetHeight
    camera.updateProjectionMatrix()
  }
  resizefn()
  window.addEventListener('resize', resizefn)

  ddd.value.appendChild(render.domElement)
  animate()
})
onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizefn)

  OrbitControl.dispose()
  // if (gui) {
  //   gui.destroy()
  // }

  render.renderLists.dispose()
  render.forceContextLoss()
  render.dispose()

  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      Array.isArray(obj.material) ? obj.material.forEach(m => m.dispose()) : obj.material.dispose()
    }
  })
  scene.clear()
})

// const gui = new GUI()

let animationId
function animate() {
  const elapsedTime = clock.getElapsedTime()

  // 更新材质时间
  smokeMertial.uniforms.uTime.value= elapsedTime

  OrbitControl.update()
  animationId = requestAnimationFrame(animate)
  render.render(scene, camera)
}
const clock=new THREE.Clock()

const textureLoader = new THREE.TextureLoader()
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./')
loader.setDRACOLoader(dracoLoader)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0, 8, 8)
scene.add(directionalLight)

const directionalLight1 = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight1.position.set(0, 8, -8)
scene.add(directionalLight1)

loader.load('/threeProjectDocs/plaions_mug/scene.gltf', (gltf) => {
  scene.add(gltf.scene)
  gltf.scene.scale.set(5, 5, 5)
  gltf.scene.position.y = 3
  downgradeForIntel(gltf.scene)
})

function downgradeForIntel(root) {
  root.traverse(obj => {
    if (!obj.isMesh || !obj.material) return
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    mats.forEach(mat => {
      mat.clearcoat = 0
      mat.transmission = 0
      mat.sheen = 0
      mat.iridescence = 0
      mat.thickness = 0

      mat.metalness = Math.min(mat.metalness ?? 0.5, 0.5)
      mat.roughness = Math.max(mat.roughness ?? 0.4, 0.4)
      mat.envMapIntensity = 0
      mat.needsUpdate = true
    })
  })
}

const dm = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: '#112c33' }))
dm.rotateX(-Math.PI / 2)
scene.add(dm)


const smokeGeometry = new THREE.PlaneGeometry(1, 1, 64, 64)
smokeGeometry.translate(0, 0.5, 0)
smokeGeometry.scale(5, 20, 5)

const perlin = textureLoader.load('/threeProjectDocs/noiseTexture.png')
// 纹理重复
perlin.wrapS=THREE.RepeatWrapping
perlin.wrapT = THREE.RepeatWrapping

const smokeMertial = new THREE.ShaderMaterial({
  // wireframe: true,
  side: THREE.DoubleSide,
  uniforms: {
    // uPerlinTexture: { value: perlin }
    uPerlinTexture: new THREE.Uniform(perlin),
    uTime:new THREE.Uniform(0),
  },
  transparent: true,
  depthWrite:false,// 烟雾旋转扭曲后，会自己遮挡后面的自己，去掉深度
  vertexShader: `
  uniform sampler2D uPerlinTexture;
  uniform float uTime;
  varying vec2 vUv;
  vec2 rotate2D(vec2 value,float angle){
    float s=sin(angle);
    float c=cos(angle);
    mat2 m=mat2(c,s,-s,c);
    return m*value;
  }
  // 说是可以导入glsl文件，导入函数，但是不知道为什么没成功
  // 要用js+import的写法
  // #include ../assets/glsl/rotate2D.glsl

  void main(){
    vec3 pos=position;
    // float angle =pos.y;
    // 根据柏林噪音创造随机效果，x在0。5从中间开始，y随高度上升上升
    // 只取rbg的r，只需要随便一个就行
    // float twistPerlin=texture(uPerlinTexture,vec2(0.5,uv.y*0.2)).r;
    // 加些时间律动
    float twistPerlin=texture(uPerlinTexture,vec2(0.5,uv.y*0.2-uTime*0.01)).r;
    float angle =twistPerlin*10.0;
    pos.xz=rotate2D(pos.xz,angle);

    // 风
    // 减0.5可以让风从0-1变成-0.5-0.5，不会只向一个方向，
    vec2 windOffset=vec2(
      texture( uPerlinTexture, vec2(0.25,(uTime*0.01)) ).r - 0.5,
      texture( uPerlinTexture, vec2(0.75,(uTime*0.01)) ).r - 0.5
    );
    // 保持烟雾底部留着杯子里
    // windOffset*=uv.y*10.0;
    // 加幂函数，让过度不生硬
    windOffset*=pow(uv.y,2.0)*10.0;
    pos.xz+=windOffset;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1.0);
    vUv=uv;
  }`,
  fragmentShader: `
  uniform sampler2D uPerlinTexture;
  uniform float uTime;
  varying vec2 vUv;
  void main(){
    vec2 smokeuv=vUv;
    smokeuv.x*=0.5;
    smokeuv.y*=0.3;
    smokeuv.y-=uTime*0.03;

    // float smoke=texture(uPerlinTexture,vUv).r;
    float smoke=texture(uPerlinTexture,smokeuv).r;
    // 让烟雾过渡平滑 smoothstep 参数1和2数值控制在0-1之间
    smoke=smoothstep(0.4,1.0,smoke);

    // 让四周过度自然
    smoke*=smoothstep(0.0,0.1,vUv.x);
    smoke*=smoothstep(1.0,0.9,vUv.x);
    smoke*=smoothstep(0.0,0.1,vUv.y);
    smoke*=smoothstep(1.0,0.4,vUv.y);

    gl_FragColor=vec4(0.6,0.3,0.2,smoke);
    // gl_FragColor=vec4(1.0,0.0,0.0,1.0);
    // 用于 色调映射（Tone Mapping） 和 色彩空间转换（Color Space Conversion） 的预处理指令
    #include <tonemapping_fragment> 
    #include <colorspace_fragment>
  }`,
})
const smoke = new THREE.Mesh(smokeGeometry, smokeMertial)
smoke.position.y=5
scene.add(smoke)
</script>

<style scoped></style>