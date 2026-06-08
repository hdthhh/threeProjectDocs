---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortysixFile.vue'
// import exampleSource from '../docs/components/fortysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
// 半浮点型，性能更好
  { type: THREE.HalfFloatType }
)
scene.environment = webGLCubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, webGLCubeRenderTarget)

// 谨慎使用图层，图层默认是0
// 当我写图层时，只看到1图层的物体
cubeCamera.layers.set(1) 

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


