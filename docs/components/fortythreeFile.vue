<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div ref="a" id="aaa"></div>
</template>

<script setup>
import { ref, onMounted ,onUnmounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as CANNON from 'cannon-es'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const ddd = ref(null)
const a = ref(null)

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

camera.position.set(20, 20, 20)

// 渲染元素，启用动画
let resizefn = null
let gui
let animationId
// 渲染元素，启用动画
onMounted(() => {
  gui = new GUI({ container: a.value })
  ddd.value.appendChild(render.domElement)
  animate();
  add()

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
  gui.destroy()
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

const clock = new THREE.Clock()
let oldElapsedTime = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // 施加力,模拟微风,向x反方向运动
  qiu1body.applyForce(new CANNON.Vec3(-0.5, 0, 0), qiu1body.position)

  for (const e of allqiu) {
    e.mesh.position.copy(e.body.position)
    // 当物体碰撞后,相撞应该不只是向下的重力作用,还应该有反向的力,使他们两碰撞后都往反方向运动(四元数)
    e.mesh.quaternion.copy(e.body.quaternion)
  }

  // 3个参数,固定时间戳,上一步经过的时间,延时
  // 固定的时间步长 通常1/60,每秒60帧
  // 自上次步骤以来过去了多少时间
  // 世界可以应用多少次选代来赶上潜在的延迟
  world.step(1 / 60, deltaTime, 3)

  // 更新球体位置
  qiu.position.copy(qiu1body.position)

  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


const sound = new Audio('/threeProjectDocs/zhuang.mp3')
function playsound(e) {
  // console.log(e.contact.getImpactVelocityAlongNormal())
  // 获取沿法线方向的冲击速度,冲击力
  if (e.contact.getImpactVelocityAlongNormal() > 1.5) {
    sound.currentTime=0
    sound.play()
  }
}


////////////////////////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(100, 2, 100)
const material = new THREE.MeshStandardMaterial({
  color: '#777',
  metalness: 0.3,//金属度
  roughness: 0.4,//粗糙度
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, -1, 0)
cube.rotateX(-Math.PI)
cube.receiveShadow = true
scene.add(cube)

const ambientLight = new THREE.AmbientLight('#fff', 0.7)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#fff', 0.7)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(0, 20, -20)
scene.add(directionalLight)

const qiu = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 16),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    // envMap:
  }))
qiu.position.set(0, 10, 0)
scene.add(qiu)


const world = new CANNON.World()

// 当世界力有太多物体,每个物体之间都是有碰撞检测的(原始广义阶段BroadPhase),这样性能消耗很大
// 网格化广义检测方式(GridBroadphase),把这个世界分成一个个网格,物体只和同网格内物体进行碰撞检测,当物体快速移动时,..会检测有问题
// 扫掠和修剪方式(SAPBroadphase),比网格好
world.broadphase = new CANNON.SAPBroadphase(world)

// 当物体不动时,进入休眠模式,这样对性能会好些
world.allowSleep = true
// 休眠限制,过几秒判断休眠,可以设置,也可默认

world.gravity.set(0, -9.82, 0)// 重力,现实重力大概是这个参数

// 物理材质,当小球和地面接触时,他们应有自己的材质,这样才会有摩擦力,有反弹

// // 第一种方式,配置两种不同的材质,给球体和地面分别添加
// const concreteMaterial = new CANNON.Material('concrete')// 参数名不重要,只是一个名字
// const plasticMaterial = new CANNON.Material('plastic')
// // 两个材质碰撞的参数配置
// const twomaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,//摩擦力
//     restitution: 0.7//恢复
//   }
// )
// world.addContactMaterial(twomaterial)

// 第二种方式,添加一种默认材质,球体和地面都是默认材质
const defalutMaterial = new CANNON.Material('defalut')
const defaultConcreteMaterial = new CANNON.ContactMaterial(
  defalutMaterial, defalutMaterial, {
  friction: 0.1,
  restitution: 0.7
}
)
world.addContactMaterial(defaultConcreteMaterial)
world.defaultContactMaterial = defaultConcreteMaterial // 设置默认材质,则球体和地面就不需要再写材质属性了


const qiu1 = new CANNON.Sphere(2)
const qiu1body = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 10, 0),
  shape: qiu1,
  // material: defaultConcreteMaterial
})
// 施加局部力,可以使球体向某个方向施加力
qiu1body.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(qiu1body)

const cube1 = new CANNON.Plane()
const cube1body = new CANNON.Body({
  mass: 0,
  shape: cube1,
  // material: defaultConcreteMaterial
})
// 平面是竖着的,需要沿x轴旋转半圈,需要使用四元数
// 参数1:沿某个轴旋转,以点来标示轴,参数2:旋转角度,旋转多少度
cube1body.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
world.addBody(cube1body)



// 制作一个函数,生成three的小球和cannon的小球
let allqiu = []
function createQiu(radius, position) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 16),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      // envMap:
    }))
  mesh.position.copy(position)
  scene.add(mesh)

  const body = new CANNON.Body({
    mass: 1,
    // position: new CANNON.Vec3(0, radius, 0),
    shape: new CANNON.Sphere(radius),
  })
  body.position.copy(position)
  body.addEventListener('collide', playsound)
  world.addBody(body)

  allqiu.push({ mesh, body })
}
// createQiu(2, { x: -8, y: 8, z: 2 })
// createQiu(2, { x: 8, y: 8, z: 5 })
function createBox(width,height,depth, position) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      // envMap:
    }))
  mesh.position.copy(position)
  scene.add(mesh)

  const body = new CANNON.Body({
    mass: 1,
    // position: new CANNON.Vec3(0, radius, 0),
    shape: new CANNON.Box(new CANNON.Vec3(width*0.5, height*0.5, depth*0.5)),
  })
  body.position.copy(position)
  body.addEventListener('collide',playsound)
  world.addBody(body)

  allqiu.push({ mesh, body })
}

function add() {
  gui.add({
    create: () => {
      createQiu(2, { x: 8, y: 8, z: 5 })
    }
  }, 'create').name('新增一个小球')
  gui.add({
    create: () => {
      createBox(2, 2, 2, { x: 8, y: 8, z: 5 })
    }
  }, 'create').name('新增一个盒子')
  gui.add({
    reset: () => {
      for (const e of allqiu) {
        scene.remove(e.mesh)

        e.body.removeEventListener('collide', playsound)
        world.removeBody(e.body)
      }
    }
  }, 'reset').name('重置')
}
</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>