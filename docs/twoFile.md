---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twoFile.vue'
// import exampleSource from '../docs/components/twoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
 <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import a from 'three/examples/fonts/helvetiker_regular.typeface.json'
// console.log(a);

const geometry = new THREE.BoxGeometry(1, 2, 3);// 立方体
const material = new THREE.MeshBasicMaterial({ color: 'rgb(0,255,0)' });// 材质

const points = [new THREE.Vector3(-10, 0, 0), new THREE.Vector3(0, 10, 0), new THREE.Vector3(10, 0, 0)]
const geometry2 = new THREE.BufferGeometry().setFromPoints(points);// geometry（几何体）
const line = new THREE.Line(geometry2, material);
scene.add(line);

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.set(5, 10, 20);
camera.lookAt(0, 0, 0);

// const loader = new FontLoader();
// console.log(loader);
// loader.load('three/examples/fonts/helvetiker_regular.typeface.json', function (font) {
//   console.log(font)
//   const textgeometry = new TextGeometry('Hello three.js!', {
//     font: font,
//     size: 80,
//     depth: 5,
//     curveSegments: 12,// （表示文本的）曲线上点的数量。默认值为12
//     bevelEnabled: true, // 是否开启斜角
//     bevelThickness: 10, // 文本上斜角的深度，默认值为20
//     bevelSize: 8,// 斜角与原始文本轮廓之间的延伸距离。默认值为8
//     bevelSegments: 5,// 斜角的分段数。默认值为3
//   });
// }, (a) => { console.log(a); }, (err) => { console.log(err) });


</script>
```
