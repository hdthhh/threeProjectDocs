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
// 仰角，宽高比，近截面距离，远截面距离
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
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);

const ambientLight = new THREE.AmbientLight('#fff', 0.7)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#fff', 0.7)
directionalLight.position.set(0,30,0)
scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

scene.background =new THREE.Color('#0d6192')

const dm = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: '#378e17' }))
dm.position.set(0,0,0)
dm.rotateX(-Math.PI/2)
dm.receiveShadow = true
scene.add(dm)


loader.load('racing_car/scene.gltf', data => {
  console.log(data)
  console.log(data.scene)
  data.scene.position.set(0,5,0)
  data.scene.scale.set(0.05,0.05,0.05)
  data.scene.traverse((child) => {
    console.log(child)
    if (child.isMesh && child.material.normalMap) {
      // 保持纹理属性一致
      // newTexture.colorSpace = child.material.normalMap.colorSpace;
      // newTexture.flipY = child.material.normalMap.flipY;

      // console.log('racing_car/' + child.material.normalMap.name)
      // 替换贴图
      // child.material.normalMap = textureLoader.load('racing_car/' + child.material.normalMap.name);
      // child.material.emissiveMap = textureLoader.load('racing_car/' + child.material.emissiveMap.name);
      // child.material.needsUpdate = true;

    }
  });
  scene.add(data.scene)
  // const body = new CANNON.Body({
  //   shape:new CANNON.Box()
  // })
})

const world = new CANNON.World({ gravity:new CANNON.Vec3(0, -9.82, 0)})

const cube = new CANNON.Plane()
const cubebody = new CANNON.Body({
  shape:cube
})
cubebody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1,0,0),
  -Math.PI/2
)
world.addBody(cubebody)

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

<style scoped>a{color: #0d6192;}</style>