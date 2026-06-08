---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortysevenFile.vue'
// import exampleSource from '../docs/components/fortysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
mat.sheen = 0
      mat.iridescence = 0
      mat.thickness = 0

      mat.metalness = Math.min(mat.metalness ?? 0, 0.5)
      mat.roughness = Math.max(mat.roughness ?? 0.4, 0.4)

      if (mat.transparent) {
        mat.opacity = Math.min(mat.opacity ?? 1, 0.6)
        mat.depthWrite = false
      }

      mat.envMapIntensity = 0.5
      mat.needsUpdate = true
    })
  })
}

const cubeTextureLoader=new THREE.CubeTextureLoader()
const bg=cubeTextureLoader.load([
  '/metro_noord_4k/px.png',
  '/metro_noord_4k/nx.png',
  '/metro_noord_4k/py.png',
  '/metro_noord_4k/ny.png',
  '/metro_noord_4k/pz.png',
  '/metro_noord_4k/nz.png',
])
scene.background = bg
scene.environment = bg
</script>

```


