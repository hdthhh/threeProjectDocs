<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div id="aaa" ref="a"></div>
</template>

<script setup>
import { ref, onMounted ,onUnmounted} from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import lightglsl from '../components/assets/glsl/light.glsl';

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap


const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(3, 3, 3)

// 渲染元素，启用动画
let resizefn = null
let gui
// 渲染元素，启用动画
onMounted(() => {
  gui = new GUI({ container: a.value })
  ddd.value.appendChild(render.domElement)
  animate();
  add()

  resizefn = () => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = ddd.value.offsetWidth / ddd.value.offsetHeight
    camera.updateProjectionMatrix()
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

})
onUnmounted(() => {
  gui.destroy()
  // render.dispose();

  cancelAnimationFrame(animationId)
  scene.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose()

    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose())
      } else {
        obj.material.dispose()
      }
    }

    if (obj.texture) obj.texture.dispose()
  })
  scene.clear()
  render.forceContextLoss()
  // render.dispose()
  window.removeEventListener('resize', resizefn)
})

const clock=new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()

  material.uniforms.uTime.value= elapsedTime

  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader() 

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);

let debugObject = {}
debugObject.depthColor='#ff4000'
debugObject.sufaceColor = '#151c37'


const geometry = new THREE.PlaneGeometry(2, 2, 512, 512)
geometry.deleteAttribute('noraml')
geometry.deleteAttribute('uv')
const material = new THREE.ShaderMaterial({
  vertexShader: `
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;
  uniform float uTime;
  uniform float uBigWavesSpeed;

  uniform float uSmallWavesElevation;
  uniform float uSmallWavesFrequency;
  uniform float uSmallWavesSpeed;
  uniform float uSmallWavesIterations;

  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;


  //	Classic Perlin 3D Noise 经典柏林噪音
  //	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
  //  https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  float waveElevation(vec3 position){
    float elevation=sin(position.x*uBigWavesFrequency.x+uTime*uBigWavesSpeed)
                    *sin(position.z*uBigWavesFrequency.y+uTime*uBigWavesSpeed)*uBigWavesElevation;
    // elevation-=abs(cnoise(vec3(position.xz*3.0,uTime*0.2))*0.15);
    // for(float i=1.0;i<=4.0;i++){
    //   elevation-=abs(cnoise(vec3(position.xz*3.0*i,uTime*0.2))*0.15/i);
    // }
    for(float i=1.0;i<=uSmallWavesIterations;i++){
      elevation-=abs(cnoise(vec3(position.xz*uSmallWavesFrequency*i,uTime*uSmallWavesSpeed))*uSmallWavesElevation/i);
    }
    return elevation;
  }

  void main(){
    float shift=0.01;// 相邻点
    vec4 modelPosition = modelMatrix * vec4(position ,1.0);
    vec3 modelPositionA=modelPosition.xyz;
    modelPositionA.x+=shift;
    vec3 modelPositionB=modelPosition.xyz;
    modelPositionB.z-=shift;
    float elevation=waveElevation(modelPosition.xyz);
    modelPosition.y+=elevation;
    modelPositionA.y+=waveElevation(modelPositionA);
    modelPositionB.y+=waveElevation(modelPositionB);
    vec3 toA=normalize(modelPositionA-modelPosition.xyz);
    vec3 toB=normalize(modelPositionB-modelPosition.xyz);
    vec3 computeNormal=cross(toA,toB);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * viewPosition;
    gl_Position = projectPosition;

    vElevation=elevation;
    // vNormal=(modelMatrix*vec4(normal, 0.0)).xyz;
    vNormal=computeNormal;
    vPosition=modelPosition.xyz;
  }`,
  fragmentShader: `
  uniform vec3 uDepthColor;
  uniform vec3 uSufaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;

  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // light glsl
  ${lightglsl}

  void main(){
    vec3 normal=normalize(vNormal);
    vec3 viewDirection=normalize(vPosition-cameraPosition);

    vec3 light=vec3(0.0);
    light+=PointLight(vec3(1.0),1.0,normal,vec3(0.0,0.25,0.0),viewDirection,30.0,vPosition,0.95);

    float mixStrength=(vElevation+uColorOffset)*uColorMultiplier;
    mixStrength=smoothstep(0.0,1.0,mixStrength);// 混合效果增强
    vec3 color =mix(uDepthColor,uSufaceColor,mixStrength);
    color*=light;
    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uTime: { value: 1.0 },
    uBigWavesSpeed: { value: 0.75 },

    uDepthColor:{value:new THREE.Color(debugObject.depthColor)},
    uSufaceColor: { value: new THREE.Color(debugObject.sufaceColor) },
    uColorOffset: { value: 0.925 },
    uColorMultiplier: { value: 1 },

    uSmallWavesElevation:{value:0.15},
    uSmallWavesFrequency:{value:3},
    uSmallWavesSpeed:{value:0.2},
    uSmallWavesIterations:{value:4},
  }
})
const water = new THREE.Mesh(geometry, material)
water.position.set(0, 0, 0)
water.rotation.x=-Math.PI*0.5
scene.add(water)

function add() {
  gui.add(material.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('uBigWavesElevation')
  gui.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.01).name('uBigWavesFrequency-x')
  gui.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.01).name('uBigWavesFrequency-y')
  gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0).max(5).step(0.01).name('uBigWavesSpeed-y')
  gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => { material.uniforms.uDepthColor.value.set(debugObject.depthColor) })
  gui.addColor(debugObject, 'sufaceColor').name('sufaceColor').onChange(() => { material.uniforms.uSufaceColor.value.set(debugObject.sufaceColor) })
  gui.add(material.uniforms.uColorOffset, 'value').min(0).max(1).step(0.01).name('uColorOffset')
  gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.01).name('uColorMultiplier')
  gui.add(material.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.01).name('uSmallWavesElevation')
  gui.add(material.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.01).name('uSmallWavesFrequency')
  gui.add(material.uniforms.uSmallWavesSpeed, 'value').min(0).max(5).step(0.01).name('uSmallWavesSpeed')
  gui.add(material.uniforms.uSmallWavesIterations, 'value').min(0).max(10).step(1).name('uSmallWavesIterations')
}
</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>