---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtynineFile.vue'
// import exampleSource from '../docs/components/thirtynineFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import * as CANNON from 'cannon-es'

function animate() {

  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  //更新物理世界
  world.step(1/60,deltaTime,3)//时间戳，刷新帧率，固定时间步长   上一次计时耗费时长     最大固定步数
  cube.position.copy(boxBody.position) // 将物理刚体小球的位置赋值给threejs的小球
  cube.quaternion.copy(boxBody.quaternion) // 将物理刚体小球的旋转赋值给threejs的小球

}
    
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

</script>

```

