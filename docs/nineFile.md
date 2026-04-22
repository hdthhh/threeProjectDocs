---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/nineFile.vue'
// import exampleSource from '../docs/components/nineFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

// 补间动画
const tween = new TWEEN.Tween(cube.position)
tween.to({ x: 10 }, 1000)
// tween.start()
// tween.repeat(Infinity) // 重复
// tween.yoyo(true)  // 循环往复
// tween.delay(1000) // 延时
// tween.easing(TWEEN.Easing.Quadratic.InOut) // 速率

const tween2 = new TWEEN.Tween(cube.position)
tween2.to({ z: 10 }, 1000)
const tween3 = new TWEEN.Tween(cube.position)
tween3.to({ x: 0 }, 1000)
const tween4 = new TWEEN.Tween(cube.position)
tween4.to({ z: 0 }, 1000)
tween.chain(tween2)
tween2.chain(tween3)
tween3.chain(tween4)
tween4.chain(tween)
tween.start()
// tween.stop()
// tween.onUpdate,onStart,onComplete,onStop   function


function animate() {
  TWEEN.update()
}
</script>

```


