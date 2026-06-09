---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyfourFile.vue'
// import exampleSource from '../docs/components/fortyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import * as CANNON from 'cannon-es'

const clock = new THREE.Clock()
let oldElapsedTime = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  for (const e of allqiu) {
    e.mesh.position.copy(e.body.position)
    e.mesh.quaternion.copy(e.body.quaternion)
  }
  world.step(1 / 60, deltaTime, 3)


  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}

const ambientLight = new THREE.AmbientLight('#fff', 0.7)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#fff', 0.9)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(0, 20, -20)
scene.add(directionalLight)

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)


const geometry = new THREE.BoxGeometry(100, 2, 100)
const material = new THREE.MeshStandardMaterial({
  color: '#ddd',
  metalness: 0.3,//金属度
  roughness: 0.4,//粗糙度
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, -1, 0)
cube.rotateX(-Math.PI)
cube.receiveShadow = true
scene.add(cube)

const cube1 = new CANNON.Plane()
const cube1body = new CANNON.Body({
  mass: 0,
  shape: cube1,
})
cube1body.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
)
world.addBody(cube1body)

let allqiu = []
function createBox(width, height, depth, position) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      color:'#f8db00'
    }))
  mesh.position.copy(position)
  scene.add(mesh)

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)),
  })
  body.position.copy(position)
  world.addBody(body)

  allqiu.push({ mesh, body })
}


gui.add({
  create: () => {
    createBox(Math.random()*5, Math.random()*5, Math.random()*5, { x: Math.random(), y: 10,  z: Math.random(), })
  }
}, 'create').name('来财')
</script>

```

