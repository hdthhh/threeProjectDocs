---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/eighteenFile.vue'
// import exampleSource from '../docs/components/eighteenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { Sky } from 'three/examples/jsm/objects/Sky.js';

// 创建Sky对象并设置属性  
  let sky = new Sky();
  sky.scale.setScalar(45000); // 设置Sky对象的大小，以确保其覆盖整个场景  

  // 设置太阳效果属性  
  let uniforms = sky.material.uniforms;
  // uniforms['turbidity'].value = 10; // 浑浊度  
  // uniforms['rayleigh'].value = 3; // 瑞利散射  
  // uniforms['mieCoefficient'].value = 0.005; // 米氏散射系数  
  // uniforms['mieDirectionalG'].value = 0.7; // 米氏散射方向性  

  // 设置太阳位置  
  const phi = THREE.MathUtils.degToRad(90 - 2); // 太阳高度角转换为弧度  
  const theta = THREE.MathUtils.degToRad(180); // 太阳方位角转换为弧度  
  const sun = new THREE.Vector3();
  sun.setFromSphericalCoords(1, phi, theta); // 根据经纬度设置太阳位置  
  uniforms['sunPosition'].value.copy(sun);

  // 将Sky对象添加到场景中  
  scene.add(sky);
</script>

```


