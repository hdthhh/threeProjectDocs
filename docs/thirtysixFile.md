---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtysixFile.vue'
// import exampleSource from '../docs/components/thirtysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.IcosahedronGeometry(10, 6);// 二十面缓冲几何体 半径，顶点(大于0不是12面，多一些顶点)

const material = new THREE.PointsMaterial({
  // wireframe: true
});
const cube = new THREE.Points(geometry, material)
scene.add(cube)



onUnmounted(() => {
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
  if (typeof resizefn === 'function') window.removeEventListener('resize', resizefn)
  if (typeof resizeHandler === 'function') window.removeEventListener('resize', resizeHandler)
})
</script>

```


