---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftyfiveFile.vue'
// import exampleSource from '../docs/components/fiftyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
uDepthColor:{value:new THREE.Color(debugObject.depthColor)},
    uSufaceColor: { value: new THREE.Color(debugObject.sufaceColor) },
    uColorOffset: { value: 0.925 },
    uColorMultiplier: { value: 1 },

    uSmallWavesElevation:{value:0.15},
    uSmallWavesFrequency:{value:3},
    uSmallWavesSpeed:{value:0.2},
    uSmallWavesIterations:{value:4},
  }
})
const water = new THREE.Mesh(geometry, material)
water.position.set(0, 0, 0)
water.rotation.x=-Math.PI*0.5
scene.add(water)

gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('uBigWavesElevation')
gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uBigWavesFrequency-x')
gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uBigWavesFrequency-y')
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.01).name('uBigWavesSpeed-y')
gui.addColor(debugObject,'depthColor').name('depthColor').onChange(()=>{material.uniforms.uDepthColor.value.set(debugObject.depthColor)})
gui.addColor(debugObject, 'sufaceColor').name('sufaceColor').onChange(() => { material.uniforms.uSufaceColor.value.set(debugObject.sufaceColor) })
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.01).name('uColorOffset')
gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.01).name('uColorMultiplier')
gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.01).name('uSmallWavesElevation')
gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.01).name('uSmallWavesFrequency')
gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(5).step(0.01).name('uSmallWavesSpeed')
gui.add(material.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(1).name('uSmallWavesIterations')
</script>

```


