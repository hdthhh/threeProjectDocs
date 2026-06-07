---
outline: deep
---

<script setup>
import FogShader from './components/fogShader.vue'
</script>

<div style="height:500px;width:100%;">
  <ClientOnly><FogShader /></ClientOnly>
</div>

## 雾着色器

在片元着色器中手动计算雾效，结合**高度雾**和**距离雾**，并用噪声扰动雾的边界，使其自然流动。

| 效果 | 实现方式 |
|---|---|
| 高度雾 | `exp(-y * k)`，贴地浓、向上稀 |
| 距离雾 | `1 - exp(-depth * k)`，指数衰减 |
| 流动感 | 噪声扰动 fogFactor，随 uTime 移动 |

## code
```glsl
float heightFog = exp(-max(vWorldPos.y, 0.0) * 0.5);
float distFog = 1.0 - exp(-vFogDepth * 0.06);
float n = noise(vWorldPos.xz * 0.25 + uTime * 0.08);
float fogFactor = clamp(distFog * (heightFog + 0.15 * n), 0.0, 1.0);
gl_FragColor = vec4(mix(uColor, uFogColor, fogFactor), 1.0);
```
