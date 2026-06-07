<template>
  <div ref="container" style="height:100%;width:100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000005)

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500)
camera.position.set(0, 40, 80)

const renderer = new THREE.WebGLRenderer({ antialias: true })
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// ---- shaders ----

const starVert = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAngleOffset;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    float twinkle = 0.7 + 0.3 * sin(uTime * 3.0 + aAngleOffset * 17.3);
    vAlpha = twinkle;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`

const starFrag = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`

const nebulaVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const nebulaFrag = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p), u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    return noise(p)*0.5 + noise(p*2.1)*0.25 + noise(p*4.3)*0.125;
  }
  void main() {
    vec2 uv = vUv - 0.5;
    float d = length(uv);
    float n = fbm(uv * 3.0 + uTime * 0.05);
    float alpha = smoothstep(0.5, 0.0, d - n * 0.2) * n * 0.35;
    gl_FragColor = vec4(uColor, alpha);
  }
`

// ---- galaxy particles ----

const ARMS = 4
const PER_ARM = 4000
const TOTAL = ARMS * PER_ARM + 2000  // arms + core

const positions = new Float32Array(TOTAL * 3)
const colors = new Float32Array(TOTAL * 3)
const sizes = new Float32Array(TOTAL)
const angleOffsets = new Float32Array(TOTAL)

const armColors = [
  new THREE.Color(0x88aaff),
  new THREE.Color(0xffaa66),
  new THREE.Color(0xaaffcc),
  new THREE.Color(0xff88bb),
]

let idx = 0

// spiral arms
for (let arm = 0; arm < ARMS; arm++) {
  const baseAngle = (arm / ARMS) * Math.PI * 2
  const col = armColors[arm]
  for (let i = 0; i < PER_ARM; i++) {
    const t = i / PER_ARM
    const r = 2 + t * 38
    const angle = baseAngle + t * Math.PI * 4 + (Math.random() - 0.5) * 0.6
    const spread = (1 - t * 0.5) * 2.5
    const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread
    const y = (Math.random() - 0.5) * (1.5 - t)
    const z = Math.sin(angle) * r + (Math.random() - 0.5) * spread
    positions[idx * 3] = x
    positions[idx * 3 + 1] = y
    positions[idx * 3 + 2] = z
    const mix = 0.6 + Math.random() * 0.4
    colors[idx * 3] = col.r * mix
    colors[idx * 3 + 1] = col.g * mix
    colors[idx * 3 + 2] = col.b * mix
    sizes[idx] = 0.5 + Math.random() * 1.5
    angleOffsets[idx] = Math.random() * Math.PI * 2
    idx++
  }
}

// core bulge
for (let i = 0; i < 2000; i++) {
  const r = Math.pow(Math.random(), 2) * 6
  const theta = Math.random() * Math.PI * 2
  const phi = (Math.random() - 0.5) * Math.PI
  positions[idx * 3] = Math.cos(theta) * Math.cos(phi) * r
  positions[idx * 3 + 1] = Math.sin(phi) * r * 0.4
  positions[idx * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r
  const warm = 0.7 + Math.random() * 0.3
  colors[idx * 3] = warm
  colors[idx * 3 + 1] = warm * 0.85
  colors[idx * 3 + 2] = warm * 0.5
  sizes[idx] = 0.8 + Math.random() * 2.0
  angleOffsets[idx] = Math.random() * Math.PI * 2
  idx++
}

const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
geo.setAttribute('aAngleOffset', new THREE.BufferAttribute(angleOffsets, 1))

const starMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: starVert,
  fragmentShader: starFrag,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
})

scene.add(new THREE.Points(geo, starMat))

// ---- background stars ----

const bgCount = 3000
const bgPos = new Float32Array(bgCount * 3)
const bgCol = new Float32Array(bgCount * 3)
const bgSize = new Float32Array(bgCount)
const bgAngle = new Float32Array(bgCount)
for (let i = 0; i < bgCount; i++) {
  const r = 80 + Math.random() * 120
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  bgPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
  bgPos[i * 3 + 1] = r * Math.cos(phi)
  bgPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  const b = 0.6 + Math.random() * 0.4
  bgCol[i * 3] = b; bgCol[i * 3 + 1] = b; bgCol[i * 3 + 2] = b
  bgSize[i] = 0.3 + Math.random() * 0.8
  bgAngle[i] = Math.random() * Math.PI * 2
}
const bgGeo = new THREE.BufferGeometry()
bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
bgGeo.setAttribute('aColor', new THREE.BufferAttribute(bgCol, 3))
bgGeo.setAttribute('aSize', new THREE.BufferAttribute(bgSize, 1))
bgGeo.setAttribute('aAngleOffset', new THREE.BufferAttribute(bgAngle, 1))
const bgMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: starVert, fragmentShader: starFrag,
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
})
scene.add(new THREE.Points(bgGeo, bgMat))

// ---- nebulae ----

const nebulaDefs = [
  { pos: [12, 1, -8],  color: new THREE.Color(0x3355ff), scale: 18 },
  { pos: [-15, 2, 10], color: new THREE.Color(0xff4488), scale: 14 },
  { pos: [5, -1, 20],  color: new THREE.Color(0x44ffaa), scale: 12 },
]

const nebulaMats = []
nebulaDefs.forEach(({ pos, color, scale }) => {
  const nGeo = new THREE.PlaneGeometry(scale, scale)
  const nMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: color } },
    vertexShader: nebulaVert, fragmentShader: nebulaFrag,
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  })
  nebulaMats.push(nMat)
  const mesh = new THREE.Mesh(nGeo, nMat)
  mesh.position.set(...pos)
  mesh.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.5
  scene.add(mesh)
})

// ---- central glow ----

const glowGeo = new THREE.PlaneGeometry(12, 12)
const glowMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xfff0cc) } },
  vertexShader: nebulaVert, fragmentShader: nebulaFrag,
  transparent: true, depthWrite: false,
  blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
})
nebulaMats.push(glowMat)
const glow = new THREE.Mesh(glowGeo, glowMat)
glow.rotation.x = -Math.PI / 2
scene.add(glow)

const allMats = [starMat, bgMat, ...nebulaMats]
const allGeos = [geo, bgGeo, glowGeo, ...nebulaDefs.map(() => new THREE.PlaneGeometry(1,1))]

let animationId, resizeFn

onMounted(() => {
  container.value.appendChild(renderer.domElement)
  resizeFn = () => {
    const w = container.value.offsetWidth, h = container.value.offsetHeight
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
    const t = clock.getElapsedTime()
    allMats.forEach(m => { if (m.uniforms?.uTime) m.uniforms.uTime.value = t })
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeFn)
  allGeos.forEach(g => g.dispose())
  allMats.forEach(m => m.dispose())
  renderer.forceContextLoss()
})
</script>
