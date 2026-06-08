---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftyfourFile.vue'
// import exampleSource from '../docs/components/fiftyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material = material
  })
  gltf.scene.position.set(-2, 0, 0)
  // gltf.scene.scale.set(2, 2, 2)
  suzanne = gltf.scene
  scene.add(gltf.scene)
})

const directionalLightHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide
  })
)
directionalLightHelper.position.set(0, 0.0, 3)
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)
pointLightHelper.position.set(0.0, 2.5, 0.0)
pointLightHelper.material.color.setRGB(1.0, 0.1, 0.1)
scene.add(pointLightHelper)

gui.addColor(material.uniforms.uColor, 'value',)
</script>

```


