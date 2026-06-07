---
outline: deep
---

<script setup>
import ShaderFile from './components/shaderFile.vue'
</script>

<div style="height:500px;width:100%;">
  <ClientOnly><ShaderFile /></ClientOnly>
</div>

## 发光着色器（Fresnel Glow）

使用 `ShaderMaterial` 实现菲涅尔边缘发光效果，视线与法线夹角越大，边缘越亮，并带有脉冲动画。

## code
```glsl
// 顶点着色器
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-worldPos.xyz);
  gl_Position = projectionMatrix * worldPos;
}

// 片元着色器
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uGlowColor;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
  float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
  vec3 color = mix(uColor, uGlowColor, fresnel * pulse);
  float alpha = 0.4 + fresnel * 0.6;
  gl_FragColor = vec4(color, alpha);
}
```
