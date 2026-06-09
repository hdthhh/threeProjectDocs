---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentythreeFile.vue'
// import exampleSource from '../docs/components/twentythreeFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.BoxGeometry(4, 4, 4)
const material = new THREE.MeshStandardMaterial({
  color: 'red',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 2, 0)
cube.castShadow = true
cube.receiveShadow = true
scene.add(cube)

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({
  color: 'green'
}))
cube2.position.set(6, 2, 5)
cube2.castShadow = true
cube2.receiveShadow = true
scene.add(cube2)

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({
  color: 'blue'
}))
cube3.position.set(-6, 2, -5)
cube3.castShadow = true
cube3.receiveShadow = true
scene.add(cube3)

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
}))
dm.position.set(0, 0, 0)
dm.receiveShadow = true
scene.add(dm)

const directionalLight = new THREE.DirectionalLight('white')
// directionalLight.target = cube3
directionalLight.position.set(40, 20, 0)
directionalLight.castShadow = true
scene.add(directionalLight)
const dlh = new THREE.DirectionalLightHelper(directionalLight, 4)
scene.add(dlh)


const directionalLight2 = new THREE.DirectionalLight('orange')
// directionalLight2.target = cube2
directionalLight2.position.set(-40, 20, 0)
directionalLight2.castShadow = true
scene.add(directionalLight2)
const dlh2 = new THREE.DirectionalLightHelper(directionalLight2, 4)
scene.add(dlh2)

// scene.background = new THREE.Color(255, 255, 255)

const glftloader = new GLTFLoader()
glftloader.load('/threeProjectDocs/box.glb', (e, r) => {
  console.log(e, r)
  scene.add(e.scene.children[0])
})

</script>

```

