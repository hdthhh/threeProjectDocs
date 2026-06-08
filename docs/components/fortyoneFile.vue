<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div style="width: 100%;height: 100%;background-color: rgba(255,255,255,0.2);position: absolute;top: 0;left: 0;" @click="pointerLockControl.lock()"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

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
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

// const OrbitControl = new OrbitControls(camera, render.domElement)
// OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
// OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度
const pointerLockControl = new PointerLockControls(camera, render.domElement)
scene.add(pointerLockControl.getObject());
pointerLockControl.addEventListener('lock', () => {
  
})
pointerLockControl.addEventListener('unlock', () => {

})
let moveSpeed = 1;
let moveDirection = 0;
window.addEventListener('keydown', (e) => {
  e.preventDefault();
  moveDirection = e.deltaY < 0 ? 1 : -1;

  // 清除之前的超时
  if (window.moveTimeout) {
    clearTimeout(window.moveTimeout);
  }

  // 设置停止移动的超时
  window.moveTimeout = setTimeout(() => {
    moveDirection = 0;
  }, 100);
})

camera.position.set(10, 10, 10)

// 渲染元素，启用动画
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
  // OrbitControl.update()

  // 根据移动方向更新位置
  if (moveDirection === 1) {
    pointerLockControl.moveForward(moveSpeed);
  } else if (moveDirection === -1) {
    pointerLockControl.moveForward(-moveSpeed);
  }

  animationId==requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)



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