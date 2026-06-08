---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtyfourFile.vue'
// import exampleSource from '../docs/components/sixtyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
new THREE.PlaneGeometry(10,10,1,1),
  new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0.3
  })
)
water.rotation.x = -Math.PI * 0.5
water.position.y = -0.1
scene.add(water)


const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11))
const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10))

// 运算类型：支持三种基本布尔运算
// ADDITION（并集）：将两个几何体合并
// SUBTRACTION（差集）：从第一个几何体中减去第二个几何体
// INTERSECTION（交集）：保留两个几何体的重叠部分

// 评估器
const evaluator = new Evaluator()
// 评估几何体1，评估几何体2，差集（相减）
const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
board.geometry.clearGroups()
board.material = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0, roughness: 0.3 })
board.castShadow = true
board.receiveShadow = true
scene.add(board)
</script>

```


