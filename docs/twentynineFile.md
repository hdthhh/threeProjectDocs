---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentynineFile.vue'
// import exampleSource from '../docs/components/twentynineFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
console.log(item)
    })
    console.log(group.children)
    // [group.children, ninegroup.children] = [[...group.children, ...ninegroup.children], []]
    // ninegroup.remove(...ninegroup.children)
    // scene.remove(ninegroup)


  }
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


