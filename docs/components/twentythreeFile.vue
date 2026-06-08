<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，原截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true; // 开启阴影,必加
render.shadowMap.type = THREE.BasicShadowMap;

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

function animate() {
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}



////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(4, 4, 4)
const material = new THREE.MeshStandardMaterial({
  color: 'red',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 2, 0)
cube.castShadow = true
cube.receiveShadow = true
scene.add(cube)

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({
  color: 'green'
}))
cube2.position.set(6, 2, 5)
cube2.castShadow = true
cube2.receiveShadow = true
scene.add(cube2)

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({
  color: 'blue'
}))
cube3.position.set(-6, 2, -5)
cube3.castShadow = true
cube3.receiveShadow = true
scene.add(cube3)

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
}))
dm.position.set(0, 0, 0)
dm.receiveShadow = true
scene.add(dm)

const directionalLight = new THREE.DirectionalLight('white')
// directionalLight.target = cube3
directionalLight.position.set(40, 20, 0)
directionalLight.castShadow = true
scene.add(directionalLight)
const dlh = new THREE.DirectionalLightHelper(directionalLight, 4)
scene.add(dlh)


const directionalLight2 = new THREE.DirectionalLight('orange')
// directionalLight2.target = cube2
directionalLight2.position.set(-40, 20, 0)
directionalLight2.castShadow = true
scene.add(directionalLight2)
const dlh2 = new THREE.DirectionalLightHelper(directionalLight2, 4)
scene.add(dlh2)

// scene.background = new THREE.Color(255, 255, 255)

const glftloader = new GLTFLoader()
glftloader.load('./box.glb', (e, r) => {
  console.log(e, r)
  scene.add(e.scene.children[0])
})

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