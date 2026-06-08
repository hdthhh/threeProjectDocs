---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftytwoFile.vue'
// import exampleSource from '../docs/components/fiftytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,// 深度缓冲 
  blending:THREE.AdditiveBlending,//颜色更亮，效果叠加
})
const qiu = new THREE.Mesh(new THREE.SphereGeometry(2,64,32), material)
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 100, 20), material)
juan.position.set(5,0,0)
scene.add(qiu, juan)

let suzanne=null
loader.load('/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material= material
  })
  gltf.scene.position.set(-5, 0, 0)
  gltf.scene.scale.set(2, 2, 2)
  suzanne= gltf.scene
  scene.add(gltf.scene)
})

const meterialParameters = {}
meterialParameters.color = '#70c1ff'

gui.addColor(meterialParameters, 'color').onChange(() => {
  material.uniforms.uColor.value.set(meterialParameters.color)
})
</script>

```


