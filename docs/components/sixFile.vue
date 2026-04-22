<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted , onUnmounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

const axesHelper = new THREE.AxesHelper(100);// 坐标系
axesHelper.setColors('white')
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
// const geometry = new THREE.BoxGeometry(10, 10, 10)
// const material = new THREE.MeshBasicMaterial({
//   color: 'red',
//   wireframe: true,
// })
// const cube = new THREE.Mesh(geometry, material)
// cube.position.set(0, 0, 0)
// scene.add(cube)


const textureLoader = new THREE.TextureLoader()  // 加载texture纹理贴图 image
// const rbge = new RGBELoader();// 用于背景上，使用贴图，渲染hdr文件
textureLoader.load('./bg.jpeg', bg => {
  bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
  scene.background = bg
  scene.environment = bg
})

// const aoMap = textureLoader.load('url')
// {aoMap:aoMap}  填充到材质里，增加物体，建立网格填充这两个
// alphaMap，lightMap，specnlarMap同理

</script>

<style scoped></style>