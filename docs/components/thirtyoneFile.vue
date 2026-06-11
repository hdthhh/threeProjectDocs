<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，原截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
// scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)

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

function animate() {
  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}



const textureLoader = new THREE.TextureLoader()
const geometry = new THREE.SphereGeometry(5)
const material = new THREE.MeshMatcapMaterial({
  color: '#e5e9a3',
  // wireframe: true,
  // matcap: textureLoader.load('/components/assets/blcz.png')// ??? mei chu xian
  matcap: textureLoader.load((new URL(`/components/assets/blcz.png`, import.meta.url).href))
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 5, 0)
scene.add(cube)


// const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({ color: '#2f2f2f' }))
// dm.position.set(0, -1, 0)
// dm.castShadow = true
// dm.receiveShadow = true
// scene.add(dm)


const pointLight = new THREE.PointLight('white', 10)
pointLight.position.set(0, 10, 10)
pointLight.target = cube
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const LambertMaterial = new THREE.MeshLambertMaterial()
const lamber = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), LambertMaterial)
lamber.position.set(-7, 3, 0)
scene.add(lamber)


textureLoader.load('/threeProjectDocs/bg.jpeg', bg => {
  bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
  scene.background = bg
  scene.environment = bg
})


const box = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshPhysicalMaterial({
  // transparent: true,
  color: 'white',
  transmission: 1,
  thickness: 0.1,
  roughness: 0.05,
  // attenuationColor: new THREE.Color(0.6, 0, 0),
  // attenuationDistance: 1,
  // 设置彩虹色，反射率和彩虹色折射率
  iridescence: 1,
  reflectivity: 1,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
}))
box.position.set(10, 5, 0)
scene.add(box)

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

<style scoped>
a {
  color: rgb(230, 230, 219);
}
</style>