---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twelveFile.vue'
// import exampleSource from '../docs/components/twelveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const textureLoader = new THREE.TextureLoader()
const earth = new THREE.SphereGeometry(5);
const material = new THREE.MeshBasicMaterial({ map: textureLoader.load(new URL(`/components/assets/earth.jpg`, import.meta.url).href) });
const sphere = new THREE.Mesh(earth, material);


const moon = new THREE.SphereGeometry(1);
const material2 = new THREE.MeshBasicMaterial({ color: 'white' })
const sphere2 = new THREE.Mesh(moon, material2);
sphere2.position.x = 10
sphere.add(sphere2)
scene.add(sphere);
</script>

```


