<template>
  <div ref="container" style="height: 100%;width: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref(null)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
camera.position.set(0, 8, 12)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const terrainMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uHeight: { value: 5.5 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uHeight;
    varying float vHeight;
    varying float vSlope;

    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(
        mix(dot(hash2(i+vec2(0,0)),f-vec2(0,0)), dot(hash2(i+vec2(1,0)),f-vec2(1,0)), u.x),
        mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)), dot(hash2(i+vec2(1,1)),f-vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v=0.0, a=0.5;
      for(int i=0;i<6;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
      return v;
    }
    float getH(vec2 xz) {
      return fbm(xz * 0.4 + uTime * 0.008) * uHeight;
    }

    void main() {
      vec2 xz = position.xz;
      float h = getH(xz);
      vHeight = h;

      float e = 1.2;
      float hR = getH(xz + vec2(e, 0.0));
      float hU = getH(xz + vec2(0.0, e));
      // 法线Y分量 = 坡度，在模型空间直接可用
      vec3 tx = vec3(e, hR - h, 0.0);
      vec3 tz = vec3(0.0, hU - h, e);
      vec3 n = normalize(cross(tz, tx));
      // n.y 越大越平坦（山顶），越小越陡
      vSlope = n.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0.0, max(h, -1.5), 0.0), 1.0);
    }
  `,
  fragmentShader: `
    varying float vHeight;
    varying float vSlope;

    void main() {
      // 实测 fBm*8 范围: [-3.0, 2.8]
      vec3 water = vec3(0.1, 0.35, 0.75);
      vec3 sand  = vec3(0.76, 0.70, 0.50);
      vec3 grass = vec3(0.18, 0.52, 0.12);
      vec3 rock  = vec3(0.42, 0.38, 0.32);
      vec3 snow  = vec3(0.95, 0.95, 1.0);

      vec3 color = water;
      // 用坡度扰动高度，让地质边界随地形起伏自然变化
      float h = vHeight + (1.0 - vSlope) * 0.3;
      color = mix(color, sand,  smoothstep(-0.6,  0.1, h));
      color = mix(color, grass, smoothstep(-0.1,  0.8, h));
      color = mix(color, snow,  smoothstep( 0.4,  1.1, h));

      // vSlope 是模型空间法线Y分量，平坦=1，陡坡=0
      // 用它做明暗：平坦亮，陡坡暗，不依赖视图空间变换
      float light = clamp(vSlope * 0.7 + 0.3, 0.3, 1.0);
      gl_FragColor = vec4(color * light, 1.0);
    }
  `,
})

const geometry = new THREE.PlaneGeometry(20, 20, 256, 256)
geometry.rotateX(-Math.PI / 2)
const mesh = new THREE.Mesh(geometry, terrainMaterial)
scene.add(mesh)

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
    terrainMaterial.uniforms.uTime.value = clock.getElapsedTime()*5
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeFn)
  geometry.dispose()
  terrainMaterial.dispose()
  renderer.forceContextLoss()
})
</script>
