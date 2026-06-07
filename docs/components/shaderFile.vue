<template>
  <div ref="container" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer({ antialias: true })

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 发光着色器材质
const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x00aaff) },
    uGlowColor: { value: new THREE.Color(0x0044ff) },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-worldPos.xyz);
      gl_Position = projectionMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      // 菲涅尔发光：视线与法线夹角越大越亮
      float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
      // 脉冲动画
      float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
      vec3 color = mix(uColor, uGlowColor, fresnel * pulse);
      float alpha = 0.4 + fresnel * 0.6;
      gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  side: THREE.FrontSide,
})

const geometry = new THREE.SphereGeometry(1, 64, 64)
const mesh = new THREE.Mesh(geometry, glowMaterial)
scene.add(mesh)

// 坐标轴
const axes = new THREE.AxesHelper(2)
scene.add(axes)

let animationId
let resizeFn

onMounted(() => {
  container.value.appendChild(renderer.domElement)

  resizeFn = () => {
    const w = container.value.offsetWidth
    const h = container.value.offsetHeight
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resizeFn()
  window.addEventListener('resize', resizeFn)

  const clock = new THREE.Clock()
  function animate() {
    animationId = requestAnimationFrame(animate)
    glowMaterial.uniforms.uTime.value = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeFn)
  geometry.dispose()
  glowMaterial.dispose()
  renderer.forceContextLoss()
})
</script>
