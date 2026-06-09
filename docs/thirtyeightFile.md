---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyeightFile.vue'
// import exampleSource from '../docs/components/thirtyeightFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.BufferGeometry()
const material = new THREE.PointsMaterial({
  // color: '#d14fbc',
  size: 0.4,
  sizeAttenuation: true, //指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。
  alphaMap: textureLoader.load(new URL(`/components/assets/yuan.png`, import.meta.url).href),
  transparent: true,
  vertexColors: true,//是否使用顶点着色
  depthWrite: false,//渲染此材质是否对深度缓冲区有任何影响。默认为true。
  blending: THREE.AdditiveBlending,//在使用此材质显示对象时要使用何种混合。混合，设置将叠加的部分的效果,可以看到叠加的部分变得更加高亮
})

const count = 5000
const posarr = new Float32Array(count * 3)
const colorarr = new Float32Array(count * 3)
const scalearr = new Float32Array(count)

for (let i = 0; i < count * 3; i++) {
  posarr[i] = (Math.random() - 0.5) * 20
  colorarr[i] = Math.random()
  if (i % 3 == 0) {
    //   scalearr[i] = scalearr[i + 1] = scalearr[i + 2] = (Math.random() * 2).toFixed(1) - 0
  }
}
for (let i = 0; i < count; i++) {
  scalearr[i] = (Math.random() * 2).toFixed(1) - 0
}
geometry.setAttribute('position', new THREE.BufferAttribute(posarr, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colorarr, 3))
geometry.setAttribute('aScale', new THREE.BufferAttribute(scalearr, 1))// wuxiao???

material.onBeforeCompile = (shader) => {
  shader.vertexShader = `
        attribute float aScale;
        ${shader.vertexShader}
      `.replace(
    `#include <begin_vertex>`,
    `vec3 transformed = vec3(position * aScale);`
  );
};

const point = new THREE.Points(geometry, material)
scene.add(point)
</script>

```

