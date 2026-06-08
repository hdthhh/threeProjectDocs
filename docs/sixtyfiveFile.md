---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtyfiveFile.vue'
// import exampleSource from '../docs/components/sixtyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
uniform sampler2D uNormalMap;
    varying vec2 vUv;

    void main(){
      // 添加时间后有种波浪眩晕效果
      // vec2 newUv =vec2(
      //   vUv.x,
      //   vUv.y+sin(vUv.x*10.0+uTime)*0.1
      // );

      vec3 normalColor =texture2D(uNormalMap,vUv).xyz*2.0-1.0;

      // vec2 newUv=vUv;
      vec2 newUv=vUv+normalColor.xy*0.1;

      vec4 color=texture2D(tDiffuse,newUv);

      vec3 lightDirection=normalize(vec3(-1.0,1.0,0.0));
      float lightness =clamp(dot(normalColor, lightDirection),0.0, 1.0);
      color.rgb += lightness *2.0;

      gl_FragColor=color;
    }
  `,
}
const DisplacementPass = new ShaderPass(DisplacementShader)
DisplacementPass.material.uniforms.uTime.value = 0
DisplacementPass.material.uniforms.uNormalMap.value=textureLoader.load('/interfaceNormalMap.png')
effectComposer.addPass(DisplacementPass)
</script>

```


