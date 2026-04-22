<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted ,onUnmounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

camera.position.set(10, 10, 10)

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
  click()

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
  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}



////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(-20, 0, 0)
scene.add(cube)

const geometry2 = new THREE.BoxGeometry(10, 10, 10)
const material2 = new THREE.MeshBasicMaterial({
  color: 'green',
})
const cube2 = new THREE.Mesh(geometry2, material2)
cube2.position.set(0, 0, 0)
scene.add(cube2)


const geometry3 = new THREE.BoxGeometry(10, 10, 10)
const material3 = new THREE.MeshBasicMaterial({
  color: 'blue',
})
const cube3 = new THREE.Mesh(geometry3, material3)
cube3.position.set(20, 0, 0)
scene.add(cube3)


const raycaster = new THREE.Raycaster() // 光线投射
const vers = new THREE.Vector2() // 点
function click() {
  ddd.value.addEventListener('click', e => {
    // 转换坐标为three的类型坐标
    vers.x = ((e.clientX-ddd.value.getBoundingClientRect().left) / ddd.value.offsetWidth) * 2 - 1
    vers.y = -(((e.clientY - ddd.value.getBoundingClientRect().top) / ddd.value.offsetHeight) * 2 - 1)
    console.log(vers.x, vers.y);


    // 设置光线投射,更新位置
    raycaster.setFromCamera(vers, camera)
    // 设置需要获取点击的物体，可以使用scene。child，但是哪里面有坐标系，所以也可以直接写数组
    const getclickThings = raycaster.intersectObjects([cube, cube2, cube3])
    console.log(getclickThings); // 获得数组，当里面有两个以上物体，可根据distance判断最近的物体，或者就是第一个，里面的object就是点击的这个物体 {object：Mesh,distance:number,...}

    if (getclickThings.length > 0) {
      let near = getclickThings[0]
      if (near.object.choose) {
        near.object.material.color.set(near.object.material.originColor)
        near.object.choose = false
        return
      }
      near.object.material.originColor = near.object.material.color.getHex()
      near.object.material.color.set('yellow')
      near.object.choose = true
    }

  })
}

</script>

<style scoped></style>