---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fifteenFile.vue'
// import exampleSource from '../docs/components/fifteenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const DragControl = new DragControls([cube], camera, render.domElement)// 物体移动

DragControl.addEventListener('dragstart', function (event) {
  event.object.material.color.setStyle('green')
  console.log(event)
});
DragControl.addEventListener('dragend', function (event) {
  event.object.material.color.setStyle('blue')
  console.log(event)
});

</script>

```


