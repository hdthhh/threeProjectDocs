---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtytwoFile.vue'
// import exampleSource from '../docs/components/thirtytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
// const textmesh = new THREE.Mesh(text, new THREE.MeshBasicMaterial({ color: 'green' }))
// textmesh.position.set(0, 50, 0)
// scene.add(textmesh)

const mc = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureLoader.load(new URL(`../assets/mc.png`, import.meta.url).href) }));
mc.position.set(0, 70, 0)
mc.scale.set(80, 80, 80)
scene.add(mc)



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


