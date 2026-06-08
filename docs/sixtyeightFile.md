---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtyeightFile.vue'
// import exampleSource from '../docs/components/sixtyeightFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
gl_Position =  vec4(position,1.0);
  }`,
  fragmentShader: `
  uniform float uAlpha;
  void main(){
    gl_FragColor=vec4(0.0,0.0,0.0,uAlpha);
  }`,
  uniforms: {
    uAlpha: { value: 1.0 }
  },
  transparent: true,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector('.point-0')
  }, {
    position: new THREE.Vector3(0.5, 0.8, -1.6),
    element: document.querySelector('.point-1')

  }, {
    position: new THREE.Vector3(1.6, -1.3, -0.7),
    element: document.querySelector('.point-2')
  }
]
const raycaster = new THREE.Raycaster()
</script>

```


