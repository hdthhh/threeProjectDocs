---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/threeFile.vue'
// import exampleSource from '../docs/components/threeFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
 <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
  const cube = new THREE.Mesh(geometry, material);// 网格
  cube.position.set(1, 2, 3)
  const cube2 = new THREE.Mesh(geometry, material2)
  cube2.position.set(-1, -2, -3)
  cube.add(cube2)
  scene.add(cube);
  camera.position.z = 10
  const p = [new THREE.Vector3(-1, -0.5, 0,), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 2, 3), new THREE.Vector3(1, 2, 3)]
  const c = new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), new THREE.LineBasicMaterial({ color: 'rgb(0,0,255)' }))
  // c.color = 'linear-gradient(red,green)'
  c.position.set(0, 0, 0)
  scene.add(c)

// 当cube网格设置postition时，该网格设置的物体的中心点就为 设置的position
// 物体也有自己的长宽高，则他的最侧后点为 （cube。position-长/2）
// 当网格下add了第二个网格，该网格设置的物体的中心点就为 父网格的position+子网格的position
</script>

```
