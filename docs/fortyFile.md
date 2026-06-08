---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyFile.vue'
// import exampleSource from '../docs/components/fortyFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
let planetData = planetList.findIndex((d) => d.name == near.object.name); //获取球体数据
      console.log(planetData)
      currentPlanet.value = planetData
      // OrbitControl.target.set(...near.object.position); // 设置目标点
      // OrbitControl.update(); // 更新控制器
    }
  } else {
    currentPlanet.value = null
  }
})

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


