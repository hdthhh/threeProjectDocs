---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentyfiveFile.vue'
// import exampleSource from '../docs/components/twentyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
})

const geometry = new TeapotGeometry(10, 18);
const material = new THREE.MeshBasicMaterial({ color: '#2b1515' });
const teapot = new THREE.Mesh(geometry, material);
teapot.position.set(-20, 10, 0)
scene.add(teapot);

const obb = new OBB(new THREE.Vector3(box1.position.x, box1.position.y, box1.position.z))
const obb1 = new OBB(new THREE.Vector3(box2.position.x, box2.position.y, box2.position.z))

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


