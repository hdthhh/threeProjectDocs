<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div ref="blocker" id="blocker">
    <div ref="instructions" id="instructions" @click="PointerLockControl.lock()">
      <p style="font-size:36px">
        Click to play
      </p>
      <p>
        Move: WASD<br />
        Jump: SPACE<br />
        Look: MOUSE
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

const ddd = ref(null)
const blocker = ref(null)
const instructions = ref(null)

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

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

// const OrbitControl = new OrbitControls(camera, render.domElement)
// OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
// OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度
const PointerLockControl = new PointerLockControls(camera, render.domElement)
PointerLockControl.addEventListener('lock', function () {
  instructions.value.style.display = 'none';
  blocker.value.style.display = 'none';
});

PointerLockControl.addEventListener('unlock', function () {
  blocker.value.style.display = 'block';
  instructions.value.style.display = '';
});
scene.add(PointerLockControl.getObject());
camera.position.set(10, 10, 10)
console.log(PointerLockControl.getObject());

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
function animate() {
  // OrbitControl.update()
  // PointerLockControl.unlock()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}





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
#blocker {
  width: 100%;
  height: 100%;
  background-color: rgba(87, 87, 87, 0.5);
  position: absolute;
  top: 0;
  left: 0;
}

#instructions {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
</style>