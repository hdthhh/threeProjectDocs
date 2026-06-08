<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，原截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap


const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
// scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)

// 渲染元素，启用动画
let resizefn = null
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

function animate() {
  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(new THREE.SphereGeometry(1), material)
cube.position.set(0, 1, 0)
cube.castShadow = true
scene.add(cube)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 30, 30), material)
plane.position.set(0, 0, 0)
plane.rotateX(-(Math.PI / 2))
plane.receiveShadow = true
scene.add(plane)

// scene.add(new THREE.AmbientLight(0xffffff, 0.9))

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
directionalLight.position.set(0, 10, 10)
directionalLight.castShadow = true
scene.add(directionalLight)

directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.near = 0.1

directionalLight.shadow.camera.left = 2
directionalLight.shadow.camera.right = -2
directionalLight.shadow.camera.top = 4
directionalLight.shadow.camera.bottom = -2
// directionalLight.shadow.radius = 10 // 模糊度

// directionalLight.shadow.mapSize.width = 512  // default 512
// directionalLight.shadow.mapSize.height = 512  // default 512

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalLightHelper)

const directionalCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalCameraHelper)

// color -（可选）一个表示颜色的 Color 的实例、字符串或数字，默认为一个白色（0xffffff）的 Color 对象。
// intensity -（可选）光照强度。默认值为 1。
// distance - 光源照射的最大距离。默认值为 0（无限远）。
// angle - 光线照射范围的角度。默认值为 Math.PI / 3。
// penumbra - 聚光锥的半影衰减百分比。默认值为 0。
// decay - 沿着光照距离的衰减量。默认值为 2。
const spotLight = new THREE.SpotLight(0xFFFFFF, 50)
spotLight.position.set(-7, 10, 10)
spotLight.castShadow = true
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.shadow.camera.far = 20
spotLight.shadow.camera.near = 5
spotLight.shadow.camera.fov = 40
spotLight.shadow.mapSize.width = 512 * 2
spotLight.shadow.mapSize.height = 512 * 2

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
const spotCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotCameraHelper)


const pointLight = new THREE.PointLight(0xffffff, 50)
pointLight.position.set(7, 10, 10)
pointLight.castShadow = true
scene.add(pointLight)

pointLight.shadow.camera.far = 20
pointLight.shadow.camera.near = 5
pointLight.shadow.mapSize.width = 512 * 2
pointLight.shadow.mapSize.height = 512 * 2

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)
const pointCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointCameraHelper)


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