---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sevenFile.vue'
// import exampleSource from '../docs/components/sevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.BoxGeometry(1, 1, 100)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

// 线性雾 雾的密度是随着距离线性增大的
const fog = new THREE.Fog('#aaa', 1, 50)
// 指数雾 相机附近提供清晰的视野，且距离相机越远，雾的浓度随着指数增长越快
// const fog = new THREE.FogExp2('#aaa', 0.1)

scene.fog = fog
scene.background = new THREE.Color('#aaa')
</script>

```


