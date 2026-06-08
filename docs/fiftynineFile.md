---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftynineFile.vue'
// import exampleSource from '../docs/components/fiftynineFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
gsap.fromTo(
      particles.material.uniforms.uProgress,
      { value: 0 },
      { value: 1, duration: 3, ease: 'linear' }
    )

    particles.index = index
  }
  particles.morph0 = ()=>particles.morph(0)
  particles.morph1 = ()=>particles.morph(1)
  particles.morph2 = ()=>particles.morph(2)
  particles.morph3 = ()=>particles.morph(3)

  gui.add(particles, 'morph0')
  gui.add(particles, 'morph1')
  gui.add(particles, 'morph2')
  gui.add(particles, 'morph3')

  gui.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.01).name('progress').listen()

  gui.addColor(particles, 'colorA').onChange(() =>{
    particles.material.uniforms.uColorA.value.set(particles.colorA)
  })
  gui.addColor(particles, 'colorB').onChange(() => {
    particles.material.uniforms.uColorB.value.set(particles.colorB)
  })
})
</script>

```


