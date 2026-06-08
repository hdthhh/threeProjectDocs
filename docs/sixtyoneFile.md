---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtyoneFile.vue'
// import exampleSource from '../docs/components/sixtyoneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<!-- <div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div> -->
  <Suspense>
    <template #default>
     <div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>
    </template>
    <template #fallback>
      <div class="loading">加载中...</div>
    </template>
  </Suspense>

## code
```vue
<script setup>
gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uSize: new THREE.Uniform(0.07),
    uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)),
    uParticlesTexture: new THREE.Uniform()
  }
})

particles.points = new THREE.Points(particles.geometry, particles.material)
scene.add(particles.points)

const debugObject = {}
debugObject.clearColor = '#29191f'
render.setClearColor(debugObject.clearColor)

gui.addColor(debugObject, 'clearColor').onChange(() => { render.setClearColor(debugObject.clearColor) })
gui.add(particles.material.uniforms.uSize, 'value').min(0).max(1).step(0.001).name('uSize')
// loader.load('/boat.glb', (gltf) => {
//   console.log(gltf)
// })
gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldInfluence,'value').min(0).max(1).name('uFlowFieldInfluence')
gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldStrength, 'value').min(0).max(10).name('uFlowFieldStrength')
gui.add(gpgpu.particlesVariable.material.uniforms.uFlowFieldFrequency, 'value').min(0).max(1).step(0.001).name('uFlowFieldFrequency')
</script>

```


