---
outline: deep
---

<script setup>
import GradientShader from './components/gradientShader.vue'
</script>

<div style="height:500px;width:100%;">
  <ClientOnly><GradientShader /></ClientOnly>
</div>

## 渐变色着色器

以平面中心为原点，用 `atan` 取角度映射色相，配合 `hsl2rgb` 转换实现彩虹环形渐变，`uTime` 驱动色相旋转产生动态流动效果。

| 区域 | 效果 |
|---|---|
| 中心 | 偏白（低饱和度） |
| 边缘 | 高饱和彩色 |
| 随时间 | 色相持续旋转 |

## code
```glsl
vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0,4,2), 6.0)-3.0)-1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0*c.z - 1.0));
}

void main() {
  float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (2.0 * 3.14159) + 0.5;
  float hue = mod(angle + uTime * 0.1, 1.0);
  float dist = length(vUv - 0.5);
  float sat = smoothstep(0.0, 0.5, dist) * 0.9;
  float light = 1.0 - dist * 0.6;
  gl_FragColor = vec4(hsl2rgb(vec3(hue, sat, light)), 1.0);
}
```
