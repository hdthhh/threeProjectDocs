<template>
  <div ref="ddd" style="height: 100%;width: 100%;"></div>
  <div id="aaa" ref='a'></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const ddd = ref(null)
const a = ref(null)

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

const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const geometry = new THREE.BoxGeometry(4, 5, 6,);// 立方体
const material = new THREE.MeshBasicMaterial({ color: 'rgb(0,255,0)' });// 材质
material.wireframe = true// 材质只轮廓

const cube = new THREE.Mesh(geometry, material);// 网格
cube.position.set(0, 0, 0);
cube.scale.x = 2;// 缩放
cube.rotation.y = Math.PI / 4;// 旋转

scene.add(cube);
camera.position.z = 10

let resizefn = null
let animationId
let gui
onMounted(() => {
  gui = new GUI({ container: a.value })
  add()

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


  // close只是缩起
  // gui.hide()
  gui.destroy()
})


function animate() {
  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}


function add() {
  gui.add(cube.position, 'x', 1, 10, 1).name('xxx').onChange(val => {
    console.log(val);
  })
  gui.add(cube.position, 'y').min(1).max(10).step(0.1).name('yyy').onFinishChange(val => {
    console.log(val);
  })
  // 部分控件编组
  const fff = gui.addFolder('material attribute')
  fff.add(material, 'wireframe').name('ccc')
  fff.addColor({ cubeColor: 'yellow' }, 'cubeColor').onChange((val) => { cube.material.color.set(val) })
}

</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>