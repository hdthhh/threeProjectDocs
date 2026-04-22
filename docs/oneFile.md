---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/oneFile.vue'
import exampleSource from '../docs/components/oneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<template>
  <div ref="ddd" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted,onUnmounted } from 'vue'
import * as THREE from 'three'

const ddd = ref(null)

const scene = new THREE.Scene()// 场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)// PerspectiveCamera（透视摄像机）  (视野角度（FOV）,长宽比（aspect ratio）,近截面（near）和远截面（far）)


const render = new THREE.WebGLRenderer()// 渲染器  尺寸( 宽，高,updateStyle(t,f) )
render.setSize(window.innerWidth, window.innerHeight)
console.log(render)


const geometry = new THREE.BoxGeometry(1, 2, 3);// 立方体
const material = new THREE.MeshBasicMaterial({ color: 'rgb(0,255,0)' });// 材质 

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 10


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
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}
</script>

<style scoped></style>
```
