---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentytwoFile.vue'
// import exampleSource from '../docs/components/twentytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshPhysicalMaterial({
  // color: 'yellow',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const cube2 = new THREE.Mesh(new THREE.OctahedronGeometry(5), new THREE.MeshPhysicalMaterial({
  // color: 'purple'
}))
cube2.position.set(15, 0, 0)
scene.add(cube2)
// radius — 八面体半径.默认值为1.
// detail — 默认值为0.如果此值设为大于0则不再是八面体.

const cube3 = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshPhysicalMaterial({
  side: THREE.DoubleSide
}))
cube3.position.set(-15, 0, 0)
cube3.rotateX(THREE.MathUtils.degToRad(90))
scene.add(cube3)

var light = new THREE.HemisphereLight('red', 'blue', 1);
scene.add(light);


</script>

```

