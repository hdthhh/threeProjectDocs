---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/tenFile.vue'
// import exampleSource from '../docs/components/tenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
 <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 10, 0)
scene.add(light);
const light1 = new THREE.DirectionalLight(0xffffff, 1, 100);
light1.position.set(10, 10, 0)
scene.add(light1);

const DirectionalLightHelper = new THREE.DirectionalLightHelper(light1, 5)
scene.add(DirectionalLightHelper)


const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


loader.load('3dmode1/scene.gltf', gltf => {
  console.log(gltf);
  scene.add(gltf.scene);
})
loader.load('model-action.gltf', gltf => {
  console.log(gltf);
  gltf.scene.position.set(10, 0, 0)
  scene.add(gltf.scene);
})

</script>

```


