<template>
  <div ref="ddd" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, vShow ,onUnmounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const ddd = ref(null)

const scene = new THREE.Scene()// 场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)// PerspectiveCamera（透视摄像机）  (视野角度（FOV）,长宽比（aspect ratio）,近截面（near）和远截面（far）)


const render = new THREE.WebGLRenderer({
  antialias: true,// 启用消除锯齿功能
})// 渲染器  尺寸( 宽，高,updateStyle(t,f) )
render.setSize(window.innerWidth, window.innerHeight)
// console.log(render)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼
OrbitControl.dampingFactor = 0.01


const geometry = new THREE.BoxGeometry(4, 5, 6,);// 立方体
const material = new THREE.MeshBasicMaterial({ color: 'rgb(0,255,0)' });// 材质
material.wireframe = true// 材质只轮廓
const material2 = new THREE.MeshBasicMaterial({ color: 'rgb(255,0,0)' });// 材质
material2.wireframe = true

const axesHelper = new THREE.AxesHelper(100);// 坐标系
axesHelper.setColors('white')
scene.add(axesHelper)

const cube = new THREE.Mesh(geometry, material);// 网格
cube.position.set(1, 2, 3)
const cube2 = new THREE.Mesh(geometry, material2)
cube2.position.set(-1, -2, -3)
cube.add(cube2)
scene.add(cube);
camera.position.z = 10
const p = [new THREE.Vector3(-1, -0.5, 0,), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 3)]
const c = new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), new THREE.LineBasicMaterial({ color: 'rgb(0,0,255)' }))
// c.color = 'linear-gradient(red,green)'
c.position.set(0, 0, 0)
scene.add(c)

// 当cube网格设置postition时，该网格设置的物体的中心点就为 设置的position
// 物体也有自己的长宽高，则他的最侧后点为 （cube。position-长/2）
// 当网格下add了第二个网格，该网格设置的物体的中心点就为 父网格的position+子网格的position


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
</script>

<style scoped></style>