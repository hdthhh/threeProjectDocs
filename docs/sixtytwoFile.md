---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtytwoFile.vue'
// import exampleSource from '../docs/components/sixtytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)

gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency')
gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency')
gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name("uStrength")

gui.add(uniforms.uWrapPositionFrequency, 'value', 0, 2, 0.001).name('uWrapPositionFrequency')
gui.add(uniforms.uWrapTimeFrequency, 'value', 0, 2, 0.001).name('uWrapTimeFrequency')
gui.add(uniforms.uWrapStrength, 'value', 0, 2, 0.001).name("uWrapStrength")

gui.addColor(debugObject, 'colorA').onChange(() => { 
  uniforms.uColorA.value.set(debugObject.colorA)
})
gui.addColor(debugObject, 'colorB').onChange(() => {
  uniforms.uColorB.value.set(debugObject.colorB)
})

gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(material, 'roughness', 0, 1, 0.001)
gui.add(material, 'transmission', 0, 1, 0.001)
gui.add(material, 'ior', 0, 10, 0.001)
gui.add(material, 'thickness', 0, 10, 0.001)
gui.addColor(material, 'color')
</script>

```


