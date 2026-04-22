---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiveFile.vue'
// import exampleSource from '../docs/components/fiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import jsontext from "three/examples/fonts/helvetiker_regular.typeface.json";
import zh from './assets/zihun71hao-yushoujinshu_Regular.json'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
  1, 0, 0,
  -1, -1, 0,
  0, 0, 1,
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const material = new THREE.MeshBasicMaterial({
  color: 'blue',
  // wireframe: true,// 轮廓
  side: THREE.DoubleSide,//双面显示
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const geometry2 = new THREE.BufferGeometry()
// 点
const vers = new Float32Array([
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
  0, 1, 0
])
// 点，组
geometry2.setAttribute('position', new THREE.BufferAttribute(vers, 3))
// 点的索引
const index = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry2.setIndex(new THREE.BufferAttribute(index, 1))
// 第0个(1) 0开始，有3个  第1个(2)  3开始，有3个
geometry2.addGroup(0, 3, 0)
geometry2.addGroup(3, 3, 1)
const cube2 = new THREE.Mesh(geometry2, [new THREE.MeshBasicMaterial({ color: 'red' }), new THREE.MeshBasicMaterial({ color: 'green' })])
cube2.position.set(0, 0, 0)
scene.add(cube2)




// font
const floader = new FontLoader()
const f = floader.parse(zh)
if (f) {
  const textgeometry = new TextGeometry('远水越游泳浮', {
    font: f,
    size: 1,
    depth: 0.1,
    // height: 15,
    // curveSegments: 10,
    // bevelThickness: 5,
    // bevelSize: 1.5,
    // bevelEnabled: true,
    // bevelSegments: 10,
  });

  // textgeometry.center();
  console.log(textgeometry);
  textgeometry.computeBoundingBox();
  const line = new THREE.Mesh(textgeometry, new THREE.MeshBasicMaterial({
    color: 'red',
    side: THREE.DoubleSide,//双面显示
    wireframe: false
  }))

  console.log(line);
  line.position.set(2, 2, 2)
  scene.add(line)
} else {
  console.log('err');
}
</script>

```
