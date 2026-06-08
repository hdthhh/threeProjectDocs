---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortythreeFile.vue'
// import exampleSource from '../docs/components/fortythreeFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
//////////////////
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



// 制作一个函数,生成three的小球和cannon
// ... more code ...
</script>

```


