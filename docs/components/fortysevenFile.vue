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

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,//抗锯齿
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
})
render.setSize(500, 500)

render.shadowMap.enabled = true;
render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap

// render.physicallyCorrectLights=true

// render.outputEncoding = THREE.sRGBEncoding

render.toneMapping=THREE.ACESFilmicToneMapping
// render.toneMappingExposure=10// 色调映射值 ,色调映射的曝光级别
render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
render.physicallyCorrectLights = false

const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
// scene.add(gridhelper)

// const gui = new GUI()


const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)

let resizefn = null
let gui
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();

  gui = new GUI({ container: a.value })
  gui.add(render, 'toneMapping', {
    no: THREE.NoToneMapping,
    linear: THREE.LinearToneMapping,
    cineon: THREE.CineonToneMapping,
    reinhard: THREE.ReinhardToneMapping,
    acesf: THREE.ACESFilmicToneMapping
  })
  gui.add(render, 'toneMappingExposure').min(0).max(100)

  resizefn=() => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = ddd.value.offsetWidth / ddd.value.offsetHeight
    camera.updateProjectionMatrix()
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

})
onUnmounted(() => {
  cancelAnimationFrame(animateid)
  window.removeEventListener('resize', resizefn)

  OrbitControl.dispose()
  gui?.destroy()

  render.renderLists.dispose()
  render.forceContextLoss()
  render.dispose()

  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      Array.isArray(obj.material)
        ? obj.material.forEach(m => m.dispose())
        : obj.material.dispose()
    }
  })
  scene.clear()
})
let animateid
function animate() {
  OrbitControl.update()
  animateid=requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();//如果模型是draco压缩过，要用这个
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);



const geometry = new THREE.SphereGeometry(4, 72, 32)
const material = new THREE.MeshStandardMaterial({
  color: 'white',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const directionalLight = new THREE.DirectionalLight('white', 5)
directionalLight.position.set(15, 5, -3)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.camera.far = 20
directionalLight.shadow.mapSize.set(1024, 1024)

// 当圆形光滑的平面在映射光线和阴影时，表面的像素点会产生阴影在物体上，会有锯齿感，网状感，把阴影范围往内缩进再形成阴影，就不会生成了
// directionalLight.shadow.normalBias=0.01

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

loader.load('/threeProjectDocs/FlightHelmet/FlightHelmet.gltf', (gltf) => {
  scene.add(gltf.scene)
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.set(10, 0, 0)

  updateAllMaterial()
  // downgradeForIntelGPU()
})
function updateAllMaterial() {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = bg  //可以用scene environment代替，就不用一个一个遍历写envmap了
      // 强度
      // child.material.envMapIntensity=5
      child.material.needsUpdate=true
      child.castShadow = true
      child.receiveShadow=true
    }
  })
}
function downgradeForIntelGPU(root) {
  root.traverse(obj => {
    if (!obj.isMesh || !obj.material) return

    const mats = Array.isArray(obj.material)
      ? obj.material
      : [obj.material]

    mats.forEach(mat => {
      mat.transmission = 0
      mat.clearcoat = 0
      mat.sheen = 0
      mat.iridescence = 0
      mat.thickness = 0

      mat.metalness = Math.min(mat.metalness ?? 0, 0.5)
      mat.roughness = Math.max(mat.roughness ?? 0.4, 0.4)

      if (mat.transparent) {
        mat.opacity = Math.min(mat.opacity ?? 1, 0.6)
        mat.depthWrite = false
      }

      mat.envMapIntensity = 0.5
      mat.needsUpdate = true
    })
  })
}

const cubeTextureLoader=new THREE.CubeTextureLoader()
const bg=cubeTextureLoader.load([
  '/threeProjectDocs/metro_noord_4k/px.png',
  '/threeProjectDocs/metro_noord_4k/nx.png',
  '/threeProjectDocs/metro_noord_4k/py.png',
  '/threeProjectDocs/metro_noord_4k/ny.png',
  '/threeProjectDocs/metro_noord_4k/pz.png',
  '/threeProjectDocs/metro_noord_4k/nz.png',
])
scene.background = bg
scene.environment = bg
</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>