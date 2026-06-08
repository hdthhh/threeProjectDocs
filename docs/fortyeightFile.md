---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyeightFile.vue'
// import exampleSource from '../docs/components/fortyeightFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const material = new THREE.RawShaderMaterial({
  // 着色器可以引入glsl文件，或者写反义字符串``
  vertexShader: vertex,// 顶点着色器
  fragmentShader: fragment,// 片段着色器
  transparent: true,// 只有开启这个才能给颜色透明度，rgba的a
  // 自定义统一值
  uniforms: {
    my1: { value: 10 },
    my2: { value: new THREE.Vector2(10.0, 5.0) },
    utime: { value: 0.0 },
    ucolor: { value: new THREE.Color('green') },
    mytexture: { value: textureLoader.load('/200115103917-1.jpg')}
  }
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(5, 5, 5)
scene.add(cube)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)
for (let i = 0; i < count; i++) {
  randoms[i]=Math.random()
}
// 在物体上添加一段属性，一段随机数，在着色器上使用
geometry.setAttribute('aMyrandom', new THREE.BufferAttribute(randoms, 1))

const gui = new GUI()
gui.add(material.uniforms.my1, 'value').min(0).max(100).step(0.01)
gui.add(material.uniforms.my2.value, 'x').min(0).max(100).step(0.01)
</script>

```


