---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fourFile.vue'
// import exampleSource from '../docs/components/fourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.BoxGeometry(4, 5, 6,);// 立方体
const material = new THREE.MeshBasicMaterial({ color: 'rgb(0,255,0)' });// 材质
material.wireframe = true// 材质只轮廓

const cube = new THREE.Mesh(geometry, material);// 网格
cube.position.set(0, 0, 0);
cube.scale.x = 2;// 缩放
cube.rotation.y = Math.PI / 4;// 旋转

scene.add(cube);
camera.position.z = 10

function add() {
  gui.add(cube.position, 'x', 1, 10, 1).name('xxx').onChange(val => {
    console.log(val);
  })
  gui.add(cube.position, 'y').min(1).max(10).step(0.1).name('yyy').onFinishChange(val => {
    console.log(val);
  })
  // 部分控件编组
  const fff = gui.addFolder('material attribute')
  fff.add(material, 'wireframe').name('ccc')
  fff.addColor({ cubeColor: 'yellow' }, 'cubeColor').onChange((val) => { cube.material.color.set(val) })
}

</script>

```
