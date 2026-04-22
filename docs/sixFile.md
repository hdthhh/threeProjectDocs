---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixFile.vue'
// import exampleSource from '../docs/components/sixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
  <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const textureLoader = new THREE.TextureLoader()  // 加载texture纹理贴图 image
// const rbge = new RGBELoader();// 用于背景上，使用贴图，渲染hdr文件
textureLoader.load('./bg.jpeg', bg => {
  bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
  scene.background = bg
  scene.environment = bg
})

// const aoMap = textureLoader.load('url')
// {aoMap:aoMap}  填充到材质里，增加物体，建立网格填充这两个
// alphaMap，lightMap，specnlarMap同理
</script>

```


