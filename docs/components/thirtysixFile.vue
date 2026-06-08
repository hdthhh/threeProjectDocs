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

const loadingManager = new THREE.LoadingManager(() => {
  // 所有材料导入完成，结束后调用，无参
  console.log('onLoad')
}, (url, itemsLoaded, itemsTotal) => {
  // 每一个导入完成都会调用一次该函数，参数为导入的材料的路径 textureLoader.load('black.jpg')  url-->'black.jpg'   已加载项的个数 总共所需要加载项的个数
  console.log('onProgress', url, itemsLoaded, itemsTotal)
}, (url) => {
  // 每一个导入失败都后调用，参数为导入的材料的路径 textureLoader.load('black.jpg')  url-->'black.jpg'
  // 先调用error，再调用progress
  console.log('onError', url)
})
// loadingManager.onStart 开始时调用
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  // itemsLoaded, itemsTotal   总为0，1   是因为是第一次？
  console.log(url, itemsLoaded, itemsTotal)
}

const textureLoader = new THREE.TextureLoader(loadingManager)

const a = textureLoader.load('black.jpg')
const b = textureLoader.load('white.jpg')
const c = textureLoader.load('bg.jpg')
console.log(a);
console.log(b);
console.log(c);

const loader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);

// 可以同时管理两个loader，但gltf的导入数量不知道怎么计算的，文件加载的可能有多个可以理解，但文件夹gltf文件会加载两次，单个gltf文件也会加载很多次？？？gltf文件也会加载两次
loader.load('snowman/scene.gltf', e => {
  console.log(e);
})
loader.load('model-heart.gltf', e => {
  console.log(e);
})

const geometry = new THREE.IcosahedronGeometry(10, 6);// 二十面缓冲几何体 半径，顶点(大于0不是12面，多一些顶点)

const material = new THREE.PointsMaterial({
  // wireframe: true
});
const cube = new THREE.Points(geometry, material)
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