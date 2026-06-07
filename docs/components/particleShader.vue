<template>
  <div ref="container" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const COUNT = 8000

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050510)

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200)
camera.position.set(0, 8, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true })
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const vertexShader = `
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aSize;
  attribute vec3  aColor;

  uniform float uTime;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float t = mod(uTime * aSpeed + aOffset, 1.0);
    vec3 pos = position;
    pos.y += t * 20.0 - 10.0;
    // 螺旋扰动
    float angle = t * 6.2832 * 2.0 + aOffset * 6.2832;
    pos.x += sin(angle) * 0.4;
    pos.z += cos(angle) * 0.4;

    vColor = aColor;
    // 生命周期淡入淡出
    vAlpha = sin(t * 3.14159);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragmentShader = `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // 核心：全亮；中环：半透；边缘：消隐
    float core  = 1.0 - smoothstep(0.0, 0.3, d);
    float mid   = 1.0 - smoothstep(0.3, 0.7, d);
    float edge  = 1.0 - smoothstep(0.7, 1.0, d);
    float shape = core * 1.0 + mid * 0.5 + edge * 0.15;
    float alpha = clamp(shape, 0.0, 1.0) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// 随机分布在圆柱体内
const positions = new Float32Array(COUNT * 3)
const offsets   = new Float32Array(COUNT)
const speeds    = new Float32Array(COUNT)
const sizes     = new Float32Array(COUNT)
const colors    = new Float32Array(COUNT * 3)

const palette = [
  new THREE.Color(0x88aaff),
  new THREE.Color(0xff88cc),
  new THREE.Color(0xaaffee),
  new THREE.Color(0xffdd88),
]

for (let i = 0; i < COUNT; i++) {
  const r     = Math.random() * 22
  const theta = Math.random() * Math.PI * 2
  positions[i * 3]     = Math.cos(theta) * r
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20
  positions[i * 3 + 2] = Math.sin(theta) * r

  offsets[i] = Math.random()
  speeds[i]  = 0.1 + Math.random() * 0.3
  sizes[i]   = 1.5 + Math.random() * 3.0

  const c = palette[Math.floor(Math.random() * palette.length)]
  colors[i * 3]     = c.r
  colors[i * 3 + 1] = c.g
  colors[i * 3 + 2] = c.b
}

const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1))
geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))
geo.setAttribute('aColor',   new THREE.BufferAttribute(colors, 3))

const mat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

scene.add(new THREE.Points(geo, mat))

let animationId, resizeFn

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
    mat.uniforms.uTime.value = clock.getElapsedTime()
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeFn)
  geo.dispose()
  mat.dispose()
  renderer.forceContextLoss()
})
</script>
