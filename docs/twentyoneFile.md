---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentyoneFile.vue'
// import exampleSource from '../docs/components/twentyoneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
//////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshPhysicalMaterial({
  color: 'yellow',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
cube.receiveShadow = true
// cube.castShadow = true
scene.add(cube)

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhysicalMaterial({
  color: 'purple',
}))
cube2.position.set(10, 0, 0)
cube2.receiveShadow = true
cube2.castShadow = true
// cube2.rotateOnAxis()
scene.add(cube2)


// color — 颜色的RBG数值。
// intensity — 光强的数值。
// distance-- 光强为0处到光源的距离，0表示无穷大。
// decay-- 沿着光照距离的衰退量。2接近现实生活的衰退量。
const pointLight = new THREE.PointLight('red', 1, 0, 1)
pointLight.castShadow = true
pointLight.position.set(15, 0, 0)
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

scene.background = new THREE.Color('#000')

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


