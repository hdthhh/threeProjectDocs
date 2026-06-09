---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtythreeFile.vue'
// import exampleSource from '../docs/components/thirtythreeFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import Stats from 'three/examples/jsm/libs/stats.module.js'

    
onMounted(() => {
  ddd.value.appendChild(stats.domElement)
})
function animate() {
  stats.update()
}

const stats = new Stats()
stats.setMode(0)
stats.domElement.style = 'position:fixed;top:0;right:0;'



</script>

```

