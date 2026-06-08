---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortynineFile.vue'
// import exampleSource from '../docs/components/fortynineFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
// b+=0.5;
      // b=sin(b*100.0);
      // float c=0.25+b*0.02;
      // float a=1.0-step(0.01,abs(distance(uuv,vec2(0.5))-c));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间白环波浪(细)
      // 柏林噪声（Perlin Noise）
      // float a=cnoise(uuv*10.0);
      // gl_FragColor=vec4(a,a,a,1.0);// 随机噪点，可生成云，草之类的随机物体
      // float a=step(0.0,cnoise(uuv*10.0));
      // gl_FragColor=vec4(a,a,a,1.0);// 清晰随机噪点
      // float a=1.0-abs(cnoise(uuv*10.0));
      // gl_FragColor=vec4(a,a,a,1.0);// 略清晰随机噪点线状
      float a=step(0.9,sin(cnoise(uuv*10.0)*20.0));
      // gl_FragColor=vec4(a,a,a,1.0);// 清晰随机噪点线状

      // 设置界限，不小于0，不大于1
      a=clamp(a,0.0,1.0);

      // 添加颜色
      vec3 blackColor=vec3(0.0);
      vec3 uuvColor=vec3(uuv,1.0);
      vec3 mixColor=mix(blackColor,uuvColor,a);// 使用以上任意一个图案效果
      gl_FragColor=vec4(mixColor,1.0);
    }`,
  })
const plane = new THREE.Mesh(geometry,material)
scene.add(plane)

// console.log(geometry.attributes)
</script>

```


