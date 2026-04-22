<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted ,onUnmounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import jsontext from "three/examples/fonts/helvetiker_regular.typeface.json";
import zh from './assets/zihun71hao-yushoujinshu_Regular.json'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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

camera.position.set(0, 3, 0)
// camera.up.z = 1
// camera.up.y = 0
// camera.up.x = 0
camera.lookAt(0, 0, 0)

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



////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
  1, 0, 0,
  -1, -1, 0,
  0, 0, 1,
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.MeshBasicMaterial({
  color: 'blue',
  // wireframe: true,// 轮廓
  side: THREE.DoubleSide,//双面显示
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const geometry2 = new THREE.BufferGeometry()
// 点
const vers = new Float32Array([
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
  0, 1, 0
])
// 点，组
geometry2.setAttribute('position', new THREE.BufferAttribute(vers, 3))
// 点的索引
const index = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry2.setIndex(new THREE.BufferAttribute(index, 1))
// 第0个(1) 0开始，有3个  第1个(2)  3开始，有3个
geometry2.addGroup(0, 3, 0)
geometry2.addGroup(3, 3, 1)
const cube2 = new THREE.Mesh(geometry2, [new THREE.MeshBasicMaterial({ color: 'red' }), new THREE.MeshBasicMaterial({ color: 'green' })])
cube2.position.set(0, 0, 0)
scene.add(cube2)




// font
const floader = new FontLoader()
const f = floader.parse(zh)
if (f) {
  const textgeometry = new TextGeometry('远水越游泳浮', {
    font: f,
    size: 1,
    depth: 0.1,
    // height: 15,
    // curveSegments: 10,
    // bevelThickness: 5,
    // bevelSize: 1.5,
    // bevelEnabled: true,
    // bevelSegments: 10,
  });

  // textgeometry.center();
  console.log(textgeometry);
  textgeometry.computeBoundingBox();
  const line = new THREE.Mesh(textgeometry, new THREE.MeshBasicMaterial({
    color: 'red',
    side: THREE.DoubleSide,//双面显示
    wireframe: false
  }))

  console.log(line);
  line.position.set(2, 2, 2)
  scene.add(line)
} else {
  console.log('err');
}
</script>

<style scoped></style>