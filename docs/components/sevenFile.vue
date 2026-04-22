<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted,onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼
OrbitControl.dampingFactor = 0.01

camera.position.set(10, 10, 10)

let resizefn = null
let animationId
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
  // render.dispose()
  window.removeEventListener('resize', resizefn)
})


function animate() {
  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}



////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(1, 1, 100)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

// 线性雾 雾的密度是随着距离线性增大的
const fog = new THREE.Fog('#aaa', 1, 50)
// 指数雾 相机附近提供清晰的视野，且距离相机越远，雾的浓度随着指数增长越快
// const fog = new THREE.FogExp2('#aaa', 0.1)

scene.fog = fog
scene.background = new THREE.Color('#aaa')

</script>

<style scoped></style>