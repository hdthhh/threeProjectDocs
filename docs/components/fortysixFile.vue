<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js'
// 不存在？？162版本被GroundedSkybox取代
// import { GroundProjectedSkybox } from 'three/addons/jsm/objects/GroundProjectedSkybox.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap


const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
// scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
// scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)

let resizefn = null
let animationId
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();

  resizefn = () => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = ddd.value.offsetWidth / ddd.value.offsetHeight
    camera.updateProjectionMatrix()
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

})


const clock = new THREE.Clock()

function animate() {
  if (quan) {
    quan.rotation.x = Math.sin(clock.getElapsedTime()) * 2

    cubeCamera.update(render,scene)
  }
  

  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/draco/');
// loader.setDRACOLoader(dracoLoader);


const geometry = new THREE.TorusKnotGeometry(2,0.9,300,62)
const material = new THREE.MeshStandardMaterial({
  color: '#aaaaaa',
  // wireframe: true,
  roughness: 0,
  metalness:1
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 4, 0)
scene.add(cube)

loader.load('/threeProjectDocs/FlightHelmet/FlightHelmet.gltf', (gltf) => {
  scene.add(gltf.scene)
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.set(10,0,0)
})


// scene.backgroundBlurriness = 0 // 背景模糊程度，0-1
// scene.backgroundIntensity=1 // 背景强度，默认1


// 立方体贴图
// const cubeTextureLoader=new THREE.CubeTextureLoader()
// const bg=cubeTextureLoader.load([
//   '/threeProjectDocs/metro_noord_4k/px.png',
//   '/threeProjectDocs/metro_noord_4k/nx.png',
//   '/threeProjectDocs/metro_noord_4k/py.png',
//   '/threeProjectDocs/metro_noord_4k/ny.png',
//   '/threeProjectDocs/metro_noord_4k/pz.png',
//   '/threeProjectDocs/metro_noord_4k/nz.png',
// ])
// scene.background = bg
// scene.environment = bg


// HDR贴图,光照方面，色彩方面更强
// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('/threeProjectDocs/metro_noord_4k.hdr', (emv) => {
//   emv.mapping=THREE.EquirectangularReflectionMapping
//   scene.background = emv
//   scene.environment = emv
// })


// ldr贴图，低色彩
// const map=textureLoader.load('/threeProjectDocs/bg.jpg')
// map.mapping = THREE.EquirectangularReflectionMapping
// map.colorSpace = THREE.SRGBColorSpace
// scene.background = map
// scene.environment = map


// 天空盒
// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('/threeProjectDocs/fireplace_4k.hdr', (emv) => {
//   emv.mapping=THREE.EquirectangularReflectionMapping
//   // scene.background = emv
//   scene.environment = emv

//   // 天空盒
//   // 对于需要地面与天空自然过渡的场景，GroundedSkybox实现基于环境贴图的地面投影效果。
//   const skybox = new GroundedSkybox(emv, 10)
//   skybox.scale.setScalar(50)
//   // skybox.scale(50,50, -50);
//   // skybox.position.set(0,100,0)
//   skybox.position.set(0, 9, 0)
//   scene.add(skybox)
// })



const map=textureLoader.load('/threeProjectDocs/bg.jpg')
map.mapping = THREE.EquirectangularReflectionMapping
map.colorSpace = THREE.SRGBColorSpace
scene.background = map

const quan = new THREE.Mesh(
  new THREE.TorusGeometry(18,0.8),
  new THREE.MeshBasicMaterial({
    color:'white'
  })
)
scene.add(quan)
quan.layers.enable(1)

const webGLCubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  // 分辨率，选择低的，因为有六个面，乘6会变很大
  256,
  // 半浮点型，性能更好
  { type: THREE.HalfFloatType }
)
scene.environment = webGLCubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, webGLCubeRenderTarget)

// 谨慎使用图层，图层默认是0
// 当我写图层时，只看到1图层的物体
cubeCamera.layers.set(1) 

onUnmounted(() => {
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
  if (typeof resizefn === 'function') window.removeEventListener('resize', resizefn)
  if (typeof resizeHandler === 'function') window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped></style>