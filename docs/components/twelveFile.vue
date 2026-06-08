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

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼
OrbitControl.dampingFactor = 0.01

camera.position.set(10, 10, 10)

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
onUnmounted(() => {
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
function animate() {
  // console.log(clock.getElapsedTime());

  sphere.rotation.y += 0.01;
  sphere2.rotation.y += 0.1;

  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


////////////////////////////////////
// 立方体，材质，网格
// const geometry = new THREE.BoxGeometry(10, 10, 10)
// const material = new THREE.MeshBasicMaterial({
//   color: 'red',
//   wireframe: true,
// })
// const cube = new THREE.Mesh(geometry, material)
// cube.position.set(0, 0, 0)
// scene.add(cube)

const textureLoader = new THREE.TextureLoader()
const earth = new THREE.SphereGeometry(5);
const material = new THREE.MeshBasicMaterial({ map: textureLoader.load(new URL(`/components/assets/earth.jpg`, import.meta.url).href) });
const sphere = new THREE.Mesh(earth, material);


const moon = new THREE.SphereGeometry(1);
const material2 = new THREE.MeshBasicMaterial({ color: 'white' })
const sphere2 = new THREE.Mesh(moon, material2);
sphere2.position.x = 10
sphere.add(sphere2)
scene.add(sphere);


</script>

<style scoped></style>