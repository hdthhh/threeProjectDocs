<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import axios from 'axios'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，原截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap


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

// const colck = new THREE.Clock()

function animate() {
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
  // point.rotateY(colck.getElapsedTime() * 0.001)
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


const geometry = new THREE.BufferGeometry()
const material = new THREE.PointsMaterial({
  // color: '#d14fbc',
  size: 0.4,
  sizeAttenuation: true, //指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。
  alphaMap: textureLoader.load(new URL(`/components/assets/yuan.png`, import.meta.url).href),
  transparent: true,
  vertexColors: true,//是否使用顶点着色
  depthWrite: false,//渲染此材质是否对深度缓冲区有任何影响。默认为true。
  blending: THREE.AdditiveBlending,//在使用此材质显示对象时要使用何种混合。混合，设置将叠加的部分的效果,可以看到叠加的部分变得更加高亮
})

const count = 5000
const posarr = new Float32Array(count * 3)
const colorarr = new Float32Array(count * 3)
const scalearr = new Float32Array(count)

for (let i = 0; i < count * 3; i++) {
  posarr[i] = (Math.random() - 0.5) * 20
  colorarr[i] = Math.random()
  if (i % 3 == 0) {
    //   scalearr[i] = scalearr[i + 1] = scalearr[i + 2] = (Math.random() * 2).toFixed(1) - 0
  }
}
for (let i = 0; i < count; i++) {
  scalearr[i] = (Math.random() * 2).toFixed(1) - 0
}
geometry.setAttribute('position', new THREE.BufferAttribute(posarr, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colorarr, 3))
geometry.setAttribute('aScale', new THREE.BufferAttribute(scalearr, 1))// wuxiao???

material.onBeforeCompile = (shader) => {
  shader.vertexShader = `
        attribute float aScale;
        ${shader.vertexShader}
      `.replace(
    `#include <begin_vertex>`,
    `vec3 transformed = vec3(position * aScale);`
  );
};

const point = new THREE.Points(geometry, material)
scene.add(point)

// axios.get('http://192.168.1.37/file/111.docx').then(res => {
//   console.log(res);

// }).catch(err => {
//   console.log(err);

// })

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