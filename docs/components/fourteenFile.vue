<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
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

// const OrbitControl = new OrbitControls(camera, render.domElement)
// OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
// OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度
const TransformControl = new TransformControls(camera, render.domElement)
TransformControl.showX = TransformControl.showY = TransformControl.showZ = true
let TrackballControl
// .noPan: Boolean
// 是否禁用平移，默认为false。

// .noRotate: Boolean
// 是否禁用旋转，默认为false。

// .noZoom: Boolean
// 是否禁用缩放，默认为false
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)
const clock = new THREE.Clock()

let resizefn=null
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  // 由于它需要响应文档对象模型（DOM）元素的事件，它的初始化代码必须出现在 appendChild 函数调用之后。
  TrackballControl = new TrackballControls(camera, render.domElement)

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
  TrackballControl.update(clock.getDelta()) // 创建THREE.Clock对象，用于计算上次调用经过的时间, 不知道作用？？
  requestAnimationFrame(animate);
  render.render(scene, camera);
}




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


TransformControl.attach(cube)// 一个control只能加在一个网格对象上
scene.add(TransformControl)

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