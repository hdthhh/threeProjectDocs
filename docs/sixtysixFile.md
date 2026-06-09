---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtysixFile.vue'
// import exampleSource from '../docs/components/sixtysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import Stats from 'stats.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
    
function animate() {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  torusKnot.rotation.y = elapsedTime * 0.1

  stats.end()
}
    
// 性能监测
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
stats.domElement.style = 'position:absolute;top:0;right:0;'
    
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

const displacementTexture = textureLoader.load('/threeProjectDocs/displacementMap.png')


const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial()
)
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(- 5, 0, 0)
scene.add(cube)

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
  new THREE.MeshStandardMaterial()
)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
scene.add(torusKnot)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
)
sphere.position.set(5, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial()
)
floor.position.set(0, - 2, 0)
floor.rotation.x = - Math.PI * 0.5
floor.castShadow = true
floor.receiveShadow = true
scene.add(floor)

// BufferGeometryUtils使用这种方式下创建的多个mesh，会比下面这种方式性能更好
// 这种合并方式有缺点，如果要变动单个物体，需要更新所有mesh的顶点
// const geometries = []
// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   )
//   geometries.push(geometry)
// }
// const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries)
// const material = new THREE.MeshNormalMaterial()
// const mesh = new THREE.Mesh(mergedGeometry, material)
// scene.add(mesh)


// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()
// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material)
//   mesh.position.x = (Math.random() - 0.5) * 10
//   mesh.position.y = (Math.random() - 0.5) * 10
//   mesh.position.z = (Math.random() - 0.5) * 10
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2
//   scene.add(mesh)
// }


// 会比上面性能更好
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const material = new THREE.MeshNormalMaterial()
const mesh = new THREE.InstancedMesh(geometry, material, 50)
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
scene.add(mesh)
for (let i = 0; i < 50; i++) {
  const quaternion = new THREE.Quaternion()
  quaternion.setFromEuler(new THREE.Euler(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
    0
  ))
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
  )
  const matrix = new THREE.Matrix4()
  matrix.makeRotationFromQuaternion(quaternion)
  matrix.setPosition(position)
  mesh.setMatrixAt(i, matrix)
}

// 着色器里尽量不使用if语句，性能差

// new THREE.ShaderMaterial({
//   precision: 'lowp',//低
//   defines: {
//     aaaa:1
//   }// 默认数值可以写定义里，不添加额外变量
// })

// 图片可以压缩 https://tinypng.com/cn/
// gltf可以通过draco压缩
</script>

```

