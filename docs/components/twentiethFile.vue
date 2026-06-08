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

render.shadowMap.enabled = true;
render.shadowMap.type = THREE.PCFShadowMap;

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

camera.position.set(40, 40, 40)

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


const ambientLight = new THREE.AmbientLight(0x333333, 0.3)
scene.add(ambientLight)



////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshPhysicalMaterial({
  // color: 'white',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(2, 0, 0)
cube.receiveShadow = true; // 接受阴影
cube.castShadow = true; // 产生阴影
cube.rotateZ(THREE.MathUtils.degToRad(20))
scene.add(cube)

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
}))
dm.position.set(0, 0, 0)
dm.receiveShadow = true;
scene.add(dm)

const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 30, 64), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
cylinder.position.set(10, 15, 0)
cylinder.castShadow = true;
cylinder.receiveShadow = true;
scene.add(cylinder);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
sphere.position.set(10, 30, 0)
scene.add(sphere);

const cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10.5, 64), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
cylinder2.position.set(4, 29, 0)
cylinder2.rotateZ(THREE.MathUtils.degToRad(90))
scene.add(cylinder2);

const cone = new THREE.Mesh(new THREE.ConeGeometry(5, 4, 64, 1, true), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
cone.position.set(0, 26.5, 0)
cone.openEnded = true
scene.add(cone);


const light = new THREE.PointLight('white', 1, 30, 0);
light.position.set(0, 26, 0);
light.target = cube
light.castShadow = true;
// light.receiveShadow = false;
light.shadow.mapSize.set(1024, 1024);
scene.add(light);
const lh = new THREE.PointLightHelper(light)
scene.add(lh)

const directionalLight = new THREE.DirectionalLight(0x0000ff, 1);
directionalLight.position.set(0, 15, 0);
directionalLight.target = cube
// scene.add(directionalLight);
const dh = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(dh);

// 线性雾 雾的密度是随着距离线性增大的
// const fog = new THREE.Fog('#aaa', 1, 100)
// 指数雾 相机附近提供清晰的视野，且距离相机越远，雾的浓度随着指数增长越快
const fog = new THREE.FogExp2('#000', 0.01)

scene.fog = fog
scene.background = new THREE.Color('#000')


const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);


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