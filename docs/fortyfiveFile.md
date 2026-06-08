---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyfiveFile.vue'
// import exampleSource from '../docs/components/fortyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const cube = new CANNON.Plane()
const cubebody = new CANNON.Body({
  shape:cube
})
cubebody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1,0,0),
  -Math.PI/2
)
world.addBody(cubebody)

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


