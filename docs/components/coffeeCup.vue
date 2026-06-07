<template>
  <div ref="container" style="height:100%;width:100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x120d08)

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
camera.position.set(0, 5, 10)
camera.lookAt(0, 2, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 2, 0)

// ---- shaders ----

const ceramicVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ceramicFrag = `
  varying vec3 vNormal;
  void main() {
    float diff = clamp(dot(vNormal, normalize(vec3(1.0, 2.0, 1.5))), 0.0, 1.0);
    vec3 col = vec3(0.92, 0.88, 0.82) * (0.18 + diff * 0.82);
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0) * 0.25;
    gl_FragColor = vec4(col + rim, 1.0);
  }
`

const uvVert = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const coffeeFrag = `
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  void main() {
    vec2 uv = vUv + vec2(uTime*0.02, 0.0);
    float n = noise(uv*4.0)*0.5 + noise(uv*8.0+0.5)*0.25;
    vec3 col = mix(vec3(0.07,0.03,0.01), vec3(0.18,0.09,0.03), n);
    gl_FragColor = vec4(col, 1.0);
  }
`

const smokeVert = `
  uniform sampler2D uPerlin;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  varying float vH;
  vec2 rotate2D(vec2 v,float a){float s=sin(a),c=cos(a);return mat2(c,s,-s,c)*v;}
  void main(){
    vec3 pos = position;
    float h = uv.y;
    // twist driven by noise, grows with height
    float twist = texture(uPerlin, vec2(uSeed, h*0.22 - uTime*0.009)).r;
    pos.xz = rotate2D(pos.xz, (twist - 0.5) * 14.0 * h);
    // wind drift
    float wx = texture(uPerlin, vec2(uSeed+0.3, uTime*0.006)).r - 0.5;
    float wz = texture(uPerlin, vec2(uSeed+0.6, uTime*0.006)).r - 0.5;
    pos.xz += vec2(wx, wz) * pow(h, 1.8) * 4.5;
    // S-curve sway unique per ribbon
    pos.x += sin(uTime*0.55 + uSeed*6.28 + h*3.14) * h * 0.28;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv; vH = h;
  }
`
const smokeFrag = `
  uniform sampler2D uPerlin;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  varying float vH;
  void main(){
    vec2 uv = vec2(vUv.x*0.5 + uSeed*0.25, vUv.y*0.3 - uTime*0.028);
    // 多层次噪声叠加 fbm
    float n1 = texture(uPerlin, uv).r;
    float n2 = texture(uPerlin, uv*2.3 + 0.5).r;
    float n3 = texture(uPerlin, uv*4.7 + 1.2).r;
    float smoke = n1*0.5 + n2*0.3 + n3*0.2;
    // 柔和过渡，保留深浅层次
    smoke = smoothstep(0.25, 0.85, smoke);
    // 边缘自然淡出
    smoke *= smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    smoke *= smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.35, vUv.y);
    // 底部浓、顶部淡
    smoke *= mix(0.75, 0.25, pow(vH, 1.5));
    vec3 col = mix(vec3(0.92,0.88,0.85), vec3(0.82,0.84,0.88), vH*0.6);
    gl_FragColor = vec4(col, smoke * 0.5);
  }
`

// ---- materials & geometry ----

const allMats = []
const allGeos = []

const ceramicMat = new THREE.ShaderMaterial({ vertexShader: ceramicVert, fragmentShader: ceramicFrag })
allMats.push(ceramicMat)

const coffeeMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: uvVert, fragmentShader: coffeeFrag,
})
allMats.push(coffeeMat)

function mesh(geo, mat, x = 0, y = 0, z = 0, rx = 0) {
  allGeos.push(geo)
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.rotation.x = rx
  scene.add(m)
  return m
}

// saucer
mesh(new THREE.CylinderGeometry(2.2, 2.0, 0.18, 48), ceramicMat)
mesh(new THREE.TorusGeometry(2.1, 0.06, 8, 48), ceramicMat, 0, 0.09, 0, Math.PI / 2)

// cup body
mesh(new THREE.CylinderGeometry(1.3, 1.05, 2.8, 48), ceramicMat, 0, 1.5)
mesh(new THREE.CircleGeometry(1.05, 48), ceramicMat, 0, 0.11, 0, -Math.PI / 2)
mesh(new THREE.TorusGeometry(1.3, 0.07, 8, 48), ceramicMat, 0, 2.9, 0, Math.PI / 2)

// coffee surface
mesh(new THREE.CircleGeometry(1.22, 48), coffeeMat, 0, 2.85, 0, -Math.PI / 2)

// handle (half torus) — sits on the right side of the cup
const handleGeo = new THREE.TorusGeometry(0.52, 0.10, 10, 24, Math.PI)
allGeos.push(handleGeo)
const handle = new THREE.Mesh(handleGeo, ceramicMat)
// half-circle opens to the right: rotate so the arc faces +X
handle.rotation.z = -Math.PI / 2   // arc now opens rightward
handle.position.set(1.3, 1.5, 0)   // flush with cup wall
scene.add(handle)

// ---- smoke ribbons (3 independent thin strips) ----
const smokeMats = []
const seeds = [0.08, 0.38, 0.68]
const offsets = [[-0.12, 0.05], [0.0, 0.0], [0.10, -0.04]]

seeds.forEach((seed, i) => {
  const geo = new THREE.PlaneGeometry(1, 1, 4, 48)
  geo.translate(0, 0.5, 0)
  geo.scale(0.38, 5.2, 1)
  allGeos.push(geo)
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uPerlin: new THREE.Uniform(null),
      uTime:   new THREE.Uniform(0),
      uSeed:   new THREE.Uniform(seed),
    },
    vertexShader: smokeVert, fragmentShader: smokeFrag,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  })
  allMats.push(mat)
  smokeMats.push(mat)
  const m = new THREE.Mesh(geo, mat)
  m.position.set(offsets[i][0], 2.88, offsets[i][1])
  scene.add(m)
})

// ---- lights ----
scene.add(new THREE.AmbientLight(0x332211, 0.9))
const keyLight = new THREE.PointLight(0xfff0dd, 1.8, 30)
keyLight.position.set(4, 8, 5)
scene.add(keyLight)

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

  new THREE.TextureLoader().load(import.meta.env.BASE_URL + 'noiseTexture.png', tex => {
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    smokeMats.forEach(m => m.uniforms.uPerlin.value = tex)
  })

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
