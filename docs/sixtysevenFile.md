---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtysevenFile.vue'
// import exampleSource from '../docs/components/sixtysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, - 4, 0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
  }
)

const overlayGeometry = new THREE.PlaneGeometry(2,2,1,1)
const overlayMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  void main(){
    gl_Position =  vec4(position,1.0);
  }`,
  fragmentShader: `
  uniform float uAlpha;
  void main(){
    gl_FragColor=vec4(0.0,0.0,0.0,uAlpha);
  }`,
  uniforms: {
    uAlpha:{value:1.0}
  },
  transparent:true,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)
</script>

```


