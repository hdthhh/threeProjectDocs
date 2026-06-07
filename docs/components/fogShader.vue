<template>
  <div ref="container" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const FOG_COLOR = new THREE.Color(0xc8d8e8)
const scene = new THREE.Scene()
scene.background = FOG_COLOR

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200)
camera.position.set(0, 4, 18)

const renderer = new THREE.WebGLRenderer({ antialias: true })
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const vertexShader = `
  varying vec3 vWorldPos;
  varying float vFogDepth;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vFogDepth = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uFogColor;
  varying vec3 vWorldPos;
  varying float vFogDepth;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(
      mix(hash(i), hash(i+vec2(1,0)), u.x),
      mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }

  void main() {
    // 高度雾：贴地浓，向上稀
    float heightFog = exp(-max(vWorldPos.y, 0.0) * 0.5);
    // 距离雾：指数衰减
    float distFog = 1.0 - exp(-vFogDepth * 0.06);
    // 噪声扰动让雾边界自然流动
    float n = noise(vWorldPos.xz * 0.25 + uTime * 0.08);
    float fogFactor = clamp(distFog * (heightFog + 0.15 * n), 0.0, 1.0);
    gl_FragColor = vec4(mix(uColor, uFogColor, fogFactor), 1.0);
  }
`

function makeMat(color) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uFogColor: { value: FOG_COLOR.clone() },
    },
    vertexShader,
    fragmentShader,
  })
}

const materials = []
const geometries = []

const groundGeo = new THREE.PlaneGeometry(60, 60)
groundGeo.rotateX(-Math.PI / 2)
const groundMat = makeMat(0x4a6741)
scene.add(new THREE.Mesh(groundGeo, groundMat))
geometries.push(groundGeo)
materials.push(groundMat)

const boxGeo = new THREE.BoxGeometry(1, 1, 1)
geometries.push(boxGeo)

const palette = [0x8b7355, 0x6b8e6b, 0x7a6b8e, 0x8e7a6b]
for (let x = -4; x <= 4; x += 2) {
  for (let z = -22; z <= 2; z += 3) {
    const h = 2 + Math.random() * 4
    const mat = makeMat(palette[Math.floor(Math.random() * palette.length)])
    materials.push(mat)
    const mesh = new THREE.Mesh(boxGeo, mat)
    mesh.scale.set(1, h, 1)
    mesh.position.set(x + (Math.random() - 0.5), h / 2, z + (Math.random() - 0.5))
    scene.add(mesh)
  }
}

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
    const t = clock.getElapsedTime()
    materials.forEach(m => { m.uniforms.uTime.value = t })
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeFn)
  geometries.forEach(g => g.dispose())
  materials.forEach(m => m.dispose())
  renderer.forceContextLoss()
})
</script>
