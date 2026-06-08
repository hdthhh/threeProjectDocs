<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div id="aaa" ref="a"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import customShaderMaterial from 'three-custom-shader-material/vanilla'
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg'
import simplexNoise2dFile from '../components/assets/glsl/simplexNoise2d.glsl'

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
render.shadowMap.type = THREE.PCFSoftShadowMap
render.toneMapping = THREE.ACESFilmicToneMapping
render.toneMappingExposure = 1
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap
render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

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

camera.position.set(-10, 6, -2)
let resizefn = null
let gui = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui = new GUI({ container: a.value })
  add()

  resizefn= () => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = ddd.value.offsetWidth/ ddd.value.offsetHeight
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
// const gui = new GUI()
let animationId
const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()

  uniforms.uTime.value = elapsedTime
  
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);
const rgbeLoader = new RGBELoader()

rgbeLoader.load('/threeProjectDocs/spruit_sunrise.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.backgroundBlurriness = 0.5
  scene.environment = environmentMap
})

const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)

const debugObject={}
debugObject.colorWaterDeep = '#002b3d'
debugObject.colorWaterSurface = '#66a8ff'
debugObject.colorSand = '#ffe894'
debugObject.colorGrass ='#85d534'
debugObject.colorSnow = '#ffffff'
debugObject.colorRock = '#bfbd8d'

const uniforms = {
  uPositionFrequency:new THREE.Uniform(0.2),
  uStrength:new THREE.Uniform(2.0),
  uWarpFrequency:new THREE.Uniform(5.0),
  uWarpStrength: new THREE.Uniform(0.5),
  uTime: new THREE.Uniform(0),

  uColorWaterDeep:new THREE.Uniform(new THREE.Color(debugObject.colorWaterDeep)),
  uColorWaterSurface:new THREE.Uniform(new THREE.Color(debugObject.colorWaterSurface)),
  uColorSand:new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
  uColorGrass:new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
  uColorSnow:new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
  uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock)),
}

function add() {
  gui.add(uniforms.uPositionFrequency, 'value', 0, 1, 0.001).name('uPositionFrequency')
  gui.add(uniforms.uStrength, 'value', 0, 10, 0.001).name('uStrength')
  gui.add(uniforms.uWarpFrequency, 'value', 0, 10, 0.001).name('uWarpFrequency')
  gui.add(uniforms.uWarpStrength, 'value', 0, 1, 0.001).name('uWarpStrength')

  gui.addColor(debugObject, 'colorWaterDeep').onChange(() => uniforms.uColorWaterDeep.value.set(debugObject.colorWaterDeep))
  gui.addColor(debugObject, 'colorWaterSurface').onChange(() => uniforms.uColorWaterSurface.value.set(debugObject.colorWaterSurface))
  gui.addColor(debugObject, 'colorSand').onChange(() => uniforms.uColorSand.value.set(debugObject.colorSand))
  gui.addColor(debugObject, 'colorGrass').onChange(() => uniforms.uColorGrass.value.set(debugObject.colorGrass))
  gui.addColor(debugObject, 'colorSnow').onChange(() => uniforms.uColorSnow.value.set(debugObject.colorSnow))
  gui.addColor(debugObject, 'colorRock').onChange(() => uniforms.uColorRock.value.set(debugObject.colorRock))
}

const geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
geometry.deleteAttribute('uv')
geometry.deleteAttribute('normal')
geometry.rotateX(-Math.PI * 0.5)

const material = new customShaderMaterial({
  // CSM
  baseMaterial: THREE.MeshStandardMaterial,
  vertexShader: `
  uniform float uPositionFrequency;
  uniform float uStrength;
  uniform float uWarpFrequency;
  uniform float uWarpStrength;
  uniform float uTime;

  varying vec3 vPosition;
  varying float vUpDot;

  ${simplexNoise2dFile}

  float getElevation(vec2 position){
    // float uPositionFrequency = 0.2;
    // float uStrength = 2.0;
    // float uWarpFrequency =5.0;
    // float uWarpStrength =0.5;

    vec2 warpedPosition= position;
    warpedPosition+=uTime*0.2;
    warpedPosition+=simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency)* uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;
    float elevationSign = sign(elevation);
    // elevation = pow(elevation,2.0);
    // elevation = pow(elevation,2.0)*elevationSign;
    elevation = pow(abs(elevation),2.0)*elevationSign;
    elevation*=uStrength;
    
    return elevation;
  }

  void main(){
    // Neighbours positions
    float shift =0.01;
    vec3 positionA = position + vec3(shift,0.0,0.0);
    vec3 positionB = position + vec3(0.0,0.0,-shift);

    // Elevation
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y+=elevation;
    positionA.y= getElevation(positionA.xz);
    positionB.y= getElevation(positionB.xz);

    // Compute normal
    vec3 toA =normalize(positionA-csm_Position);
    vec3 toB =normalize(positionB-csm_Position);
    csm_Normal = cross(toA,toB);

    vPosition=csm_Position;
    vPosition.xz+=uTime*0.2;
    vUpDot = dot(csm_Normal,vec3(0.0,1.0,0.0));
  }`,
  fragmentShader: `
  uniform vec3 uColorWaterDeep;
  uniform vec3 uColorWaterSurface;
  uniform vec3 uColorSand;
  uniform vec3 uColorGrass;
  uniform vec3 uColorSnow;
  uniform vec3 uColorRock;

  varying vec3 vPosition;
  varying float vUpDot;

  ${simplexNoise2dFile}

  void main(){
    // Color
    vec3 color = vec3(1.0);

    // Water
    float surfaceWaterMix = smoothstep(-1.0,-0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // Sand
    float sandMix=step(-0.1,vPosition.y);
    color=mix(color, uColorSand,sandMix);

    // Grass
    float grassMix=step(-0.06,vPosition.y);
    color=mix(color, uColorGrass,grassMix);

    // Rock
    float  rockMix= vUpDot;
    rockMix=1.0-step(0.8,rockMix);
    rockMix*=step(-0.06,vPosition.y);
    color =mix(color, uColorRock,rockMix);

    // Snow
    float snowThreshold = 0.45;
    snowThreshold +=simplexNoise2d(vPosition.xz*15.0)* 0.1;
    float snowMix=step(snowThreshold, vPosition.y);
    color =mix(color, uColorSnow,snowMix);

    // Final color
    csm_DiffuseColor=vec4(color,1.0);
  }`,
  uniforms: uniforms,
  silent: true,
  // MeshStandardMaterial
  metalness: 0,
  roughness: 0.5,
  color: '#85d534'
})
const depthMaterial = new customShaderMaterial({
  // CSM
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader: `
  uniform float uPositionFrequency;
  uniform float uStrength;
  uniform float uWarpFrequency;
  uniform float uWarpStrength;
  uniform float uTime;

  ${simplexNoise2dFile}

  float getElevation(vec2 position){
    // float uPositionFrequency = 0.2;
    // float uStrength = 2.0;
    // float uWarpFrequency =5.0;
    // float uWarpStrength =0.5;

    vec2 warpedPosition= position;
    warpedPosition+=uTime*0.2;
    warpedPosition+=simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency)* uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;
    float elevationSign = sign(elevation);
    // elevation = pow(elevation,2.0);
    // elevation = pow(elevation,2.0)*elevationSign;
    elevation = pow(abs(elevation),2.0)*elevationSign;
    elevation*=uStrength;
    
    return elevation;
  }

  void main(){
    // Neighbours positions
    float shift =0.01;
    vec3 positionA = position + vec3(shift,0.0,0.0);
    vec3 positionB = position + vec3(0.0,0.0,-shift);

    // Elevation
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y+=elevation;
    positionA.y= getElevation(positionA.xz);
    positionB.y= getElevation(positionB.xz);

    // Compute normal
    vec3 toA =normalize(positionA-csm_Position);
    vec3 toB =normalize(positionB-csm_Position);
    csm_Normal = cross(toA,toB);
  }`,
  uniforms: uniforms,
  silent: true,
  // MeshDepthMaterial
  depthPacking:THREE.RGBADepthPacking,
})

const terrain = new THREE.Mesh(geometry, material)
terrain.customDepthMaterial= depthMaterial
terrain.castShadow = true
terrain.receiveShadow = true
scene.add(terrain)

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(10,10,1,1),
  new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0.3
  })
)
water.rotation.x = -Math.PI * 0.5
water.position.y = -0.1
scene.add(water)


const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11))
const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10))

// 运算类型：支持三种基本布尔运算
// ADDITION（并集）：将两个几何体合并
// SUBTRACTION（差集）：从第一个几何体中减去第二个几何体
// INTERSECTION（交集）：保留两个几何体的重叠部分

// 评估器
const evaluator = new Evaluator()
// 评估几何体1，评估几何体2，差集（相减）
const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
board.geometry.clearGroups()
board.material = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0, roughness: 0.3 })
board.castShadow = true
board.receiveShadow = true
scene.add(board)

</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>