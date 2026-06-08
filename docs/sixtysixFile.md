---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtysixFile.vue'
// import exampleSource from '../docs/components/sixtysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
for (let i = 0; i < 50; i++) {
  const quaternion = new THREE.Quaternion()
  quaternion.setFromEuler(new THREE.Euler(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
    0
  ))
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
  )
  const matrix = new THREE.Matrix4()
  matrix.makeRotationFromQuaternion(quaternion)
  matrix.setPosition(position)
  mesh.setMatrixAt(i, matrix)
}

// 着色器里尽量不使用if语句，性能差

// new THREE.ShaderMaterial({
//   precision: 'lowp',//低
//   defines: {
//     aaaa:1
//   }// 默认数值可以写定义里，不添加额外变量
// })

// 图片可以压缩 https://tinypng.com/cn/
// gltf可以通过draco压缩
</script>

```


