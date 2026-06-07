---
outline: deep
---

<script setup>
import HauntedHouse from './components/hauntedHouse.vue'
</script>

<div style="height:500px;width:100%;">
  <ClientOnly><HauntedHouse /></ClientOnly>
</div>

## 鬼屋场景

用基础几何体搭建鬼屋，所有材质均为自定义 `ShaderMaterial`，通过噪声和时间 uniform 实现动态效果。

| 元素 | 着色器效果 |
|---|---|
| 墙体 / 屋顶 | 噪声石材纹理 + 方向光漫反射 |
| 窗户 | 烛光闪烁（双频 sin × 随机跳变） |
| 地面 | 噪声草地 + 随时间流动的地面薄雾 |
| 幽灵 | 顶点浮动 + 波浪形底边 + 透明淡入淡出 |

## code
```glsl
// 窗户闪烁
float flicker = (0.7 + 0.3*sin(t*7.3)*sin(t*13.1+1.2))
              * (0.85 + 0.15*hash(floor(t*9.0)));

// 幽灵形状：椭圆 + 底部波浪裁切
float d = length(uv * vec2(1.0, 1.3));
float shape = smoothstep(0.5, 0.18, d);
float wave = sin(vUv.x*10.0)*0.04*(1.0-vUv.y);
shape *= smoothstep(0.0, 0.12, vUv.y + wave);

// 地面薄雾
float mist = noise(vPos.xz*0.3 + uTime*0.04) * 0.4;
col = mix(col, fogColor, mist);
```
