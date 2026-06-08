---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftysixFile.vue'
// import exampleSource from '../docs/components/fiftysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(2, 0.8, 100, 20), material)
juan.position.set(10, 0, 0)
scene.add(qiu, juan)

let suzanne = null
loader.load('/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material = material
  })
  gltf.scene.position.set(-10, 0, 0)
  gltf.scene.scale.set(4, 4, 4)
  suzanne = gltf.scene
  scene.add(gltf.scene)
})

const colors = {
  bgcolor: new THREE.Color('rgb(33, 20, 41)'),
  // boxcolor: new THREE.Color('rgb(254, 110, 66)'),
}
scene.environment = colors.bgcolor
scene.background = colors.bgcolor
gui.addColor(colors, 'bgcolor').onChange(() => { scene.environment = colors.bgcolor; scene.background = colors.bgcolor })
gui.addColor(materialParams, 'color').onChange(() => { material.uniforms.uColor.value.set(materialParams.color) })
gui.addColor(materialParams, 'shadowColor').onChange(() => { material.uniforms.uShadowColor.value.set(materialParams.shadowColor) })
gui.add(material.uniforms.uShadowRepectitions, 'value').min(1).max(300).step(1).name('ShadowRepectitions')
gui.addColor(materialParams, 'lightColor').onChange(() => { material.uniforms.uLightColor.value.set(materialParams.lightColor) })
gui.add(material.uniforms.uLightRepectitions, 'value').min(1).max(300).step(1).name('LightRepectitions')
</script>

```


