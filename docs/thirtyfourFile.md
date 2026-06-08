---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyfourFile.vue'
// import exampleSource from '../docs/components/thirtyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
//   bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
//   scene.background = bg
//   scene.environment = bg
// })



const gui = new GUI()
gui.addColor({ colora: '#d8dfe4' }, 'colora').onChange((val) => {
  //addcolor 第一个参数和第二个参数要一致 colora
  scene.background = new THREE.Color(val)
})
// gui.add()
// const fff = gui.addFolder('material attribute')
// fff.add(bl, 'metalness', 0, 1)
// fff.add(bl, 'roughness', 0, 1)
// fff.add(bl, 'envMapIntensity', 0, 1)
// fff.add(bl, 'transmission', 0, 1)
// fff.add(bl, 'ior', 1, 2.33)
// fff.addColor({ color: '#d8dfe4' }, 'color').onChange(val => {
//   waterMaterial.color = new THREE.Color(val)
// })


onUnmounted(() => [
  // 销毁时销毁gui
  gui.destroy()
  // gui.dispose()  // control类但无dispose方法
])
</script>

```


