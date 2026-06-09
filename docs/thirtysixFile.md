---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtysixFile.vue'
// import exampleSource from '../docs/components/thirtysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const loadingManager = new THREE.LoadingManager(() => {
  // 所有材料导入完成，结束后调用，无参
  console.log('onLoad')
}, (url, itemsLoaded, itemsTotal) => {
  // 每一个导入完成都会调用一次该函数，参数为导入的材料的路径 textureLoader.load('black.jpg')  url-->'black.jpg'   已加载项的个数 总共所需要加载项的个数
  console.log('onProgress', url, itemsLoaded, itemsTotal)
}, (url) => {
  // 每一个导入失败都后调用，参数为导入的材料的路径 textureLoader.load('black.jpg')  url-->'black.jpg'
  // 先调用error，再调用progress
  console.log('onError', url)
})
// loadingManager.onStart 开始时调用
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  // itemsLoaded, itemsTotal   总为0，1   是因为是第一次？
  console.log(url, itemsLoaded, itemsTotal)
}

const geometry = new THREE.IcosahedronGeometry(10, 6);// 二十面缓冲几何体 半径，顶点(大于0不是12面，多一些顶点)

const material = new THREE.PointsMaterial({
  // wireframe: true
});
const cube = new THREE.Points(geometry, material)
scene.add(cube)

</script>

```

