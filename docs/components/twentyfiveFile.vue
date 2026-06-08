<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <p style="position: fixed;top: 0;right: 0;color: #ffffff;">{{ a }}</p>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBB } from 'three/examples/jsm/math/OBB.js';

const ddd = ref(null)
const a = ref('')

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，原截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
render.shadowMap.type = THREE.PCFSoftShadowMap;

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
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();

  // 导出模型
  const gltfExporter = new GLTFExporter()
  gltfExporter.parse(
    scene,
    // called when the gltf has been generated
    function (gltf) {
      console.log(gltf);
      // download JSON  gltf 
      // var blob = new Blob([JSON.stringify(gltf)])
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'a.gltf'
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // URL.revokeObjectURL(url)
    },
    // called when there is an error in the generation
    function (error) {
      console.log('An error happened');
    },
    // options = {}
    {}
  );

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
  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


const abl = new THREE.AmbientLight('white')
scene.add(abl)

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhysicalMaterial({ color: 'white' }))
scene.add(dm)

const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 'yellow' }))
const box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 'black' }))
box1.position.set(0, 1, 0)
box2.position.set(5, 1, 5)
scene.add(box1, box2)

let arr = [10, 10, 10]
window.addEventListener('keydown', e => {
  // console.log(e)
  if (e.code == 'ArrowLeft') {
    box1.translateX(1)
    arr[0]++
  } else if (e.code == 'ArrowRight') {
    box1.translateX(-1)
    arr[0]--
  } else if (e.code == 'ArrowUp') {
    box1.translateZ(1)
    arr[2]++
  } else if (e.code == 'ArrowDown') {
    box1.translateZ(-1)
    arr[2]--
  }
  obb.center = new THREE.Vector3(box1.position.x, box1.position.y, box1.position.z)
  // 碰撞检测
  if (obb.intersectsOBB(obb1)) {
    a.value = '碰撞'
    setTimeout(() => {
      a.value = ''
    }, 1000);
  }
  camera.position.set(...arr)
  OrbitControl.target.set(arr[0] - 10, 0, arr[2] - 10)
  // camera.lookAt(arr[0] - 10, 0, arr[2] - 10)  ////
  // OrbitControl.position.set(...arr)
})

const geometry = new TeapotGeometry(10, 18);
const material = new THREE.MeshBasicMaterial({ color: '#2b1515' });
const teapot = new THREE.Mesh(geometry, material);
teapot.position.set(-20, 10, 0)
scene.add(teapot);

const obb = new OBB(new THREE.Vector3(box1.position.x, box1.position.y, box1.position.z))
const obb1 = new OBB(new THREE.Vector3(box2.position.x, box2.position.y, box2.position.z))

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