---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentyfourFile.vue'
// import exampleSource from '../docs/components/twentyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
side: THREE.DoubleSide,//双面显示
    wireframe: false
  }))
  line.position.set(11.8, 3.3, 8.2)
  line.rotateY(THREE.MathUtils.degToRad(45))
  line.rotateX(THREE.MathUtils.degToRad(-90))
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


