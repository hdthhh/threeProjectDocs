---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortytwoFile.vue'
// import exampleSource from '../docs/components/fortytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
wireframe: false
  }))

  console.log(line);
  line.position.set(-0.6, 5.2, 2.5)
  line.scale.set(0.6,0.6,0.6)
  scene.add(line)
} else {
  console.log('err');
}

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


