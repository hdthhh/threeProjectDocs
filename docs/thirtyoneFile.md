---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyoneFile.vue'
// import exampleSource from '../docs/components/thirtyoneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
// attenuationColor: new THREE.Color(0.6, 0, 0),
  // attenuationDistance: 1,
  // 设置彩虹色，反射率和彩虹色折射率
  iridescence: 1,
  reflectivity: 1,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
}))
box.position.set(10, 5, 0)
scene.add(box)

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


