---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftyoneFile.vue'
// import exampleSource from '../docs/components/fiftyoneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
uniform float uTime;
  varying vec2 vUv;
  void main(){
    vec2 smokeuv=vUv;
    smokeuv.x*=0.5;
    smokeuv.y*=0.3;
    smokeuv.y-=uTime*0.03;

    // float smoke=texture(uPerlinTexture,vUv).r;
    float smoke=texture(uPerlinTexture,smokeuv).r;
    // 让烟雾过渡平滑 smoothstep 参数1和2数值控制在0-1之间
    smoke=smoothstep(0.4,1.0,smoke);

    // 让四周过度自然
    smoke*=smoothstep(0.0,0.1,vUv.x);
    smoke*=smoothstep(1.0,0.9,vUv.x);
    smoke*=smoothstep(0.0,0.1,vUv.y);
    smoke*=smoothstep(1.0,0.4,vUv.y);

    gl_FragColor=vec4(0.6,0.3,0.2,smoke);
    // gl_FragColor=vec4(1.0,0.0,0.0,1.0);
    // 用于 色调映射（Tone Mapping） 和 色彩空间转换（Color Space Conversion） 的预处理指令
    #include <tonemapping_fragment> 
    #include <colorspace_fragment>
  }`,
})
const smoke = new THREE.Mesh(smokeGeometry, smokeMertial)
smoke.position.y=5
scene.add(smoke)
</script>

```


