<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as CANNON from 'cannon-es'

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

camera.position.set(20, 20, 20)

// 渲染元素，启用动画
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
const clock = new THREE.Clock();
let oldElapsedTime = 0;

function animate() {
  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  //更新物理世界
  world.step(1/60,deltaTime,3)//时间戳，刷新帧率，固定时间步长   上一次计时耗费时长     最大固定步数
  cube.position.copy(boxBody.position) // 将物理刚体小球的位置赋值给threejs的小球
  cube.quaternion.copy(boxBody.quaternion) // 将物理刚体小球的旋转赋值给threejs的小球

}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(4, 4, 4)
const material = new THREE.MeshBasicMaterial({
  color: 'white',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 10, 0)
// cube.rotateX(Math.PI/3)
scene.add(cube)

const dm = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: 'gray' }))
dm.position.set(0, 0, 0)
dm.rotation.x = -Math.PI / 2
scene.add(dm)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const groundMaterial = new CANNON.Material('groundMaterial')
groundMaterial.friction = 0.1 // 摩擦力
groundMaterial.restitution = 0.5 // 弹力
// groundMaterial.frictionStiffness = 0.5 // 摩擦力刚度
// groundMaterial.restitutionStiffness = 0.5 // 弹力刚度

const groundBody = new CANNON.Body({
  mass: 0, // 为0表示地面不受重力影响
  shape: new CANNON.Plane(),
  material: groundMaterial,
})
world.addBody(groundBody)
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5);

const boxmaterial = new CANNON.Material('box')
const boxShape = new CANNON.Box(new CANNON.Vec3(2, 2, 2))
const boxBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 10, 0),
  material: boxmaterial,
  shape: boxShape,
})
world.addBody(boxBody)


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