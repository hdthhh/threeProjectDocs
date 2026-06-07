---
outline: deep
---

<script setup>
import ParticleShader from './components/particleShader.vue'
</script>

<div style="height:500px;width:100%;">
  <ClientOnly><ParticleShader /></ClientOnly>
</div>

## 粒子着色器

用 `THREE.Points` + 自定义 ShaderMaterial 实现上升螺旋粒子效果。

| 效果 | 实现方式 |
|---|---|
| 循环上升 | `mod(uTime * aSpeed + aOffset, 1.0)` 控制生命周期 |
| 螺旋扰动 | `sin/cos(angle)` 偏移 x/z，让轨迹不单调 |
| 淡入淡出 | `sin(t * π)` 生命周期首尾透明 |
| 发光叠加 | `AdditiveBlending` + `depthWrite: false` |

## code
```glsl
float t = mod(uTime * aSpeed + aOffset, 1.0);
pos.y += t * 12.0 - 6.0;
float angle = t * 6.2832 * 2.0 + aOffset * 6.2832;
pos.x += sin(angle) * 0.4;
pos.z += cos(angle) * 0.4;
vAlpha = sin(t * 3.14159);
```
