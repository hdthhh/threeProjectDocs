<template>
  <div ref="container" style="height:100%;width:100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050a0f)
scene.fog = new THREE.FogExp2(0x050a0f, 0.035)

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200)
camera.position.set(10, 6, 16)
camera.lookAt(0, 4, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 4, 0)

// ---- shaders ----

const wallVert = `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const wallFrag = `
  varying vec3 vPos;
  varying vec3 vNormal;
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  void main(){
    float n = noise(vPos.xz*2.0)*0.5 + noise(vPos.xy*3.0)*0.3;
    vec3 stone = mix(vec3(0.10,0.08,0.07), vec3(0.20,0.16,0.13), n);
    float diff = clamp(dot(vNormal, normalize(vec3(-0.5,1.0,0.3))), 0.0,1.0)*0.25 + 0.08;
    gl_FragColor = vec4(stone * diff, 1.0);
  }
`

const winFrag = `
  uniform float uTime;
  varying vec2 vUv;
  float hash(float n){ return fract(sin(n)*43758.5); }
  void main(){
    float flicker = (0.7 + 0.3*sin(uTime*7.3)*sin(uTime*13.1+1.2))
                  * (0.85 + 0.15*hash(floor(uTime*9.0)));
    vec2 uv = vUv - 0.5;
    float v = 1.0 - smoothstep(0.15, 0.5, length(uv));
    gl_FragColor = vec4(vec3(1.0,0.5,0.08)*flicker*v, v);
  }
`
const uvVert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`

const ghostVert = `
  uniform float uTime;
  uniform float uIdx;
  varying vec2 vUv;
  varying float vA;
  void main(){
    vUv = uv;
    vec3 p = position;
    p.y += sin(uTime*1.1 + uIdx)*0.35;
    p.x += sin(uTime*0.8 + uIdx*2.0)*0.2;
    vA = 0.5 + 0.3*sin(uTime*1.8 + uIdx);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const ghostFrag = `
  varying vec2 vUv;
  varying float vA;
  void main(){
    vec2 uv = vUv - 0.5;
    float d = length(uv * vec2(1.0,1.3));
    float shape = smoothstep(0.5, 0.18, d);
    float wave = sin(vUv.x*10.0)*0.04*(1.0-vUv.y);
    shape *= smoothstep(0.0, 0.12, vUv.y + wave);
    gl_FragColor = vec4(0.75, 0.92, 1.0, shape * vA * 0.75);
  }
`

const groundFrag = `
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormal;
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  void main(){
    float n = noise(vPos.xz*0.6)*0.5 + noise(vPos.xz*2.5)*0.3;
    vec3 col = mix(vec3(0.04,0.07,0.03), vec3(0.09,0.11,0.06), n);
    float mist = noise(vPos.xz*0.3 + uTime*0.04) * 0.4;
    col = mix(col, vec3(0.10,0.14,0.18), mist);
    gl_FragColor = vec4(col, 1.0);
  }
`

// ---- materials ----

const allMats = []
const allGeos = []

const wallMat = new THREE.ShaderMaterial({ vertexShader: wallVert, fragmentShader: wallFrag })
allMats.push(wallMat)

const winMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: uvVert, fragmentShader: winFrag,
  transparent: true, depthWrite: false,
})
allMats.push(winMat)

const groundMat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 } },
  vertexShader: wallVert, fragmentShader: groundFrag,
})
allMats.push(groundMat)

// ---- helpers ----

function box(w, h, d, x, y, z, mat = wallMat) {
  const geo = new THREE.BoxGeometry(w, h, d)
  allGeos.push(geo)
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  scene.add(m)
}

function cone(r, h, x, y, z) {
  const geo = new THREE.ConeGeometry(r, h, 4)
  allGeos.push(geo)
  const m = new THREE.Mesh(geo, wallMat)
  m.position.set(x, y, z)
  m.rotation.y = Math.PI / 4
  scene.add(m)
}

function win(x, y, z, ry = 0) {
  const geo = new THREE.PlaneGeometry(1.0, 1.4)
  allGeos.push(geo)
  const m = new THREE.Mesh(geo, winMat)
  m.position.set(x, y, z); m.rotation.y = ry
  scene.add(m)
}

// ---- ground ----
const groundGeo = new THREE.PlaneGeometry(80, 80)
groundGeo.rotateX(-Math.PI / 2)
allGeos.push(groundGeo)
scene.add(new THREE.Mesh(groundGeo, groundMat))

// ---- house ----
box(6, 8, 5,  0, 4,  0)          // main body
box(2.5, 11, 2.5, 2.5, 5.5, -1)  // tower
cone(4.5, 3,  0, 9.5,  0)        // main roof
cone(2,   4,  2.5, 13, -1)       // tower roof

// windows front
win(-1.2, 4.5,  2.51)
win( 1.2, 4.5,  2.51)
win( 0,   6.8,  2.51)
// windows back
win(-1.2, 4.5, -2.51, Math.PI)
// side + tower
win( 3.01, 5.5,  0,   Math.PI / 2)
win( 3.01, 8.5, -1,   Math.PI / 2)

// door
box(1.2, 2.2, 0.1,  0, 1.1, 2.56)

// ---- dead trees ----
function tree(x, z) {
  box(0.18, 4, 0.18, x, 2, z)
  for (let i = 0; i < 3; i++) {
    const side = i % 2 === 0 ? 1 : -1
    const bGeo = new THREE.BoxGeometry(0.1, 0.1, 1.4 - i * 0.3)
    allGeos.push(bGeo)
    const bm = new THREE.Mesh(bGeo, wallMat)
    bm.position.set(x + side * 0.4, 2.4 + i * 0.6, z)
    bm.rotation.z = side * 0.45
    scene.add(bm)
  }
}
tree(-5.5, 4); tree(7, 5); tree(-7, -1); tree(8, -2)
tree(-4, 7); tree(6, -5); tree(-9, 3); tree(10, 1)
tree(-6, -4); tree(9, 6); tree(-3, -7); tree(5, 8)

// ---- tombstones ----
function tombstone(x, z, ry = 0) {
  // base slab
  box(0.9, 1.6, 0.2, x, 0.8, z)
  // rounded top: small box cap
  box(0.9, 0.3, 0.2, x, 1.75, z)
  // cross bar
  box(0.5, 0.15, 0.22, x, 1.4, z)
  // optional tilt
  scene.children[scene.children.length - 3].rotation.y = ry
  scene.children[scene.children.length - 2].rotation.y = ry
  scene.children[scene.children.length - 1].rotation.y = ry
}

;[
  [-4, 6, 0.1], [4, 7, -0.15], [-6, 3, 0.05], [6, 4, 0.2],
  [-3, -5, -0.1], [5, -4, 0.12], [-7, 5, 0.08], [8, 3, -0.2],
  [-5, -2, 0.15], [3, 9, -0.05], [-8, -3, 0.1], [7, -6, 0.18],
].forEach(([x, z, tilt]) => {
  const m = scene.children.length
  tombstone(x, z)
  // apply tilt to the 3 meshes just added
  for (let i = 1; i <= 3; i++) scene.children[scene.children.length - i].rotation.z = tilt
})

// ---- moon ----
const moonGeo = new THREE.SphereGeometry(1.8, 16, 16)
allGeos.push(moonGeo)
const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff8d0 })
allMats.push(moonMat)
const moon = new THREE.Mesh(moonGeo, moonMat)
moon.position.set(-18, 22, -35)
scene.add(moon)

// ---- ghosts ----
const ghostGeo = new THREE.PlaneGeometry(1.5, 2)
allGeos.push(ghostGeo)

;[[-3,5,3],[4,6,-2],[-1,7,-4],[5,4,2]].forEach(([x,y,z], i) => {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uIdx: { value: i } },
    vertexShader: ghostVert, fragmentShader: ghostFrag,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  })
  allMats.push(mat)
  const m = new THREE.Mesh(ghostGeo, mat)
  m.position.set(x, y, z)
  scene.add(m)
})

// ---- lights ----
scene.add(new THREE.AmbientLight(0x111122, 0.6))
const moonLight = new THREE.DirectionalLight(0x7788aa, 0.4)
moonLight.position.set(-18, 22, -35)
scene.add(moonLight)

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
    scene.children.forEach(c => {
      if (c.material?.uniforms?.uIdx !== undefined) c.lookAt(camera.position)
    })
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
