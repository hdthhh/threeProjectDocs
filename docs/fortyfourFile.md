---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyfourFile.vue'
// import exampleSource from '../docs/components/fortyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      color:'#f8db00'
    }))
  mesh.position.copy(position)
  scene.add(mesh)

  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)),
  })
  body.position.copy(position)
  world.addBody(body)

  allqiu.push({ mesh, body })
}


const gui = new GUI()
onUnmounted(() => {
  gui.destroy()
})

gui.add({
  create: () => {
    createBox(Math.random()*5, Math.random()*5, Math.random()*5, { x: Math.random(), y: 10,  z: Math.random(), })
  }
}, 'create').name('来财')
</script>

```


