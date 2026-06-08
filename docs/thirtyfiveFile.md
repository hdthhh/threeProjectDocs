---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyfiveFile.vue'
// import exampleSource from '../docs/components/thirtyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
});
folderWater
  .add(waterParams, "distortionScale", 0, 240, 0.1)
  .name("扭曲比例")
  .onChange((value) => {
    water.material.uniforms["distortionScale"].value = value;
  });

const folderSky = gui.addFolder("天空");
let skyParams = {
  turbidity: 1,
  rayleigh: 1.5,
};
folderSky
  .add(skyParams, "turbidity", 0, 100)
  .name("浑浊度")
  .onChange((value) => {
    sky.material.uniforms["turbidity"].value = value;
  });
folderSky
  .add(skyParams, "rayleigh", 0, 100)
  .name("锐利值")
  .onChange((value) => {
    sky.material.uniforms["rayleigh"].value = value;
  });

onUnmounted(() => {
  gui.destroy()
})
</script>

```


