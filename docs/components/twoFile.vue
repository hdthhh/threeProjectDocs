<template>
  <div ref="ddd" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted,onUnmounted } from 'vue'
import * as THREE from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import a from 'three/examples/fonts/helvetiker_regular.typeface.json'
// console.log(a);

const ddd = ref(null)

const scene = new THREE.Scene()// 场景
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)// PerspectiveCamera（透视摄像机）  (视野角度（FOV）,长宽比（aspect ratio）,近截面（near）和远截面（far）)


const render = new THREE.WebGLRenderer()// 渲染器  尺寸( 宽，高,updateStyle(t,f) )
render.setSize(window.innerWidth, window.innerHeight)
console.log(THREE)


const geometry = new THREE.BoxGeometry(1, 2, 3);// 立方体
const material = new THREE.MeshBasicMaterial({ color: 'rgb(0,255,0)' });// 材质

const points = [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0), new THREE.Vector3(10, 0, 0)]
const geometry2 = new THREE.BufferGeometry().setFromPoints(points);// geometry（几何体）
const line = new THREE.Line(geometry2, material);
scene.add(line);

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.set(5, 10, 20);
camera.lookAt(0, 0, 0);

// const loader = new FontLoader();
// console.log(loader);
// loader.load('three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//   console.log(font)
//   const textgeometry = new TextGeometry('Hello three.js!', {
//     font: font,
//     size: 80,
//     depth: 5,
//     curveSegments: 12,// （表示文本的）曲线上点的数量。默认值为12
//     bevelEnabled: true, // 是否开启斜角
//     bevelThickness: 10, // 文本上斜角的深度，默认值为20
//     bevelSize: 8,// 斜角与原始文本轮廓之间的延伸距离。默认值为8
//     bevelSegments: 5,// 斜角的分段数。默认值为3
//   });
// }, (a) => { console.log(a); }, (err) => { console.log(err) });

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