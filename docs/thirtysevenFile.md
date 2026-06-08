---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtysevenFile.vue'
// import exampleSource from '../docs/components/thirtysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
pointLight.shadow.camera.far = 20
pointLight.shadow.camera.near = 5
pointLight.shadow.mapSize.width = 512 * 2
pointLight.shadow.mapSize.height = 512 * 2

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)
const pointCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointCameraHelper)


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


