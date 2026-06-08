<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBB } from 'three/examples/jsm/math/OBB.js';

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
scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)

// 渲染元素，启用动画
let resizefn = null
let gui
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  setInterval(() => {
    loop()
  }, 100);

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


const wh = 10

////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(wh, 1, wh)
const material = new THREE.MeshBasicMaterial({
  color: 'black',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

scene.background = new THREE.Color('gray')

// const box = new THREE.Box3();
// box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 1, 3));

// const box3helper = new THREE.Box3Helper(box, 0xffff00)
// scene.add(box3helper)


// const obb = new OBB()

const group = new THREE.Group()
const material2 = new THREE.MeshBasicMaterial({ color: 'white' })
const geometry2 = new THREE.SphereGeometry(0.2, 64, 32);
for (let i = -(wh / 2); i < (wh / 2); i++) {
  let h = i == -(wh / 2) ? 3 : group.children[group.children.length - (wh - 1)].position.y
  let jj = false
  if (i == -(wh / 2)) {
    jj = false
  } else if (h == 1 || h == 5) {
    jj = h == 1 ? true : false
    jj = h == 5 ? false : true
  } else {
    jj = group.children[group.children.length - wh].position.y - h > 0 ? false : true
  }
  for (let j = -(wh / 2); j < (wh / 2); j++) {
    const mesh = new THREE.Mesh(geometry2, material2)
    mesh.position.set(j, h, i)
    // console.log(j, h, i)
    group.add(mesh)
    // h--
    if (jj) {
      h++
      if (h == 5) {
        jj = false
      }
    } else {
      h--
      if (h == 1) {
        jj = true
      }
    }
  }
}
scene.add(group)
// console.log(group)

// const clock = new THREE.Clock()
function loop() {
  // loop()两次执行时间间隔
  // const t = clock.getDelta();
  let jj = false
  group.children.map((item, index, array) => {
    if (index !== array.length - 1 && (index == 0 || (index + 1) % wh == 1)) {
      let next = array[index + 1]

      jj = item.position.y > next.position.y ? true : false
    }
    if (item.position.y == 1) { jj = true }
    if (item.position.y == 5) { jj = false }

    if (jj) {
      array[index].position.y = index == 0 || (index + 1) % wh == 1 ? item.position.y + 1 : array[index - 1].position.y - 1
      if (array[index].position.y == 1) {
        jj = false
      }
    } else {
      array[index].position.y = index == 0 || (index + 1) % wh == 1 ? item.position.y - 1 : array[index - 1].position.y + 1
      if (array[index].position.y == 5) {
        jj = true
      }
    }

  });
  // requestAnimationFrame(loop);
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

<style scoped></style>