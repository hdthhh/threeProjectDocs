---
outline: deep
---

<script setup>
import TerrainShader from './components/terrainShader.vue'
</script>

<div style="height:500px;width:100%;">
  <ClientOnly><TerrainShader /></ClientOnly>
</div>

## 地形着色器

顶点着色器用 **fBm（分形布朗运动）噪声** 生成地形高度，片元着色器按高度分层混合颜色，并计算简单漫反射光照。

| 高度范围 | 颜色 |
|---|---|
| < 0 | 水（蓝） |
| 0 ~ 0.3 | 沙滩 → 草地 |
| 0.3 ~ 1.5 | 草地 → 岩石 |
| 1.5 ~ 2.2 | 岩石 → 雪 |
| > 2.2 | 雪 |

## code
```glsl
// fBm 噪声叠加 5 个倍频
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0; a *= 0.5;
  }
  return v;
}

// 顶点着色器：用 fbm 抬高 y 轴，偏移法线
float h = fbm(xz * 0.5 + uTime * 0.02) * uHeight;
vec3 pos = position + vec3(0.0, h, 0.0);

// 片元着色器：按高度混色 + 漫反射
float diff = clamp(dot(vNormal, lightDir), 0.2, 1.0);
gl_FragColor = vec4(color * diff, 1.0);
```
