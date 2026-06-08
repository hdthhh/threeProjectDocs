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
import simplexNoise4dFile from '../components/assets/glsl/simplexNoise4d.glsl'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
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

camera.position.set(13, -3, -5)
let resizefn = null
let gui = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui = new GUI({ container: a.value })
  add()

  resizefn = () => {
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
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);
const rgbeLoader = new RGBELoader()

rgbeLoader.load('/threeProjectDocs/urban_alley_01_1k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

let geometry = new THREE.IcosahedronGeometry(2.5, 50)
geometry = mergeVertices(geometry)
geometry.computeTangents()
console.log(geometry.attributes)

let debugObject={}
debugObject.colorA = '#0000ff'
debugObject.colorB = '#ff0000'

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.5),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),

  uWrapPositionFrequency: new THREE.Uniform(0.38),
  uWrapTimeFrequency: new THREE.Uniform(0.12),
  uWrapStrength: new THREE.Uniform(1.7),

  uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB))
}

const vertexShader = `
 varying vec2 vUv;
 attribute vec4 tangent;
 varying float vWobble;

 uniform float uTime;
 uniform float uPositionFrequency;
 uniform float uTimeFrequency;
 uniform float uStrength;

 uniform float uWrapPositionFrequency;
 uniform float uWrapTimeFrequency;
 uniform float uWrapStrength;

 ${simplexNoise4dFile}

 float getWobble(vec3 position){
  vec3 warpedPosition =position;
  warpedPosition += simplexNoise4d(vec4(
    // position,
    position*uWrapPositionFrequency,
    // uTime
    uTime*uWrapTimeFrequency
  ))*uWrapStrength;
   return simplexNoise4d(vec4(
    //  position,
    //  position*uPositionFrequency,
    warpedPosition*uPositionFrequency,
    //  0.0
    uTime*uTimeFrequency
   ))*uStrength;
 }

 void main(){
   // csm_Position.y+=sin(csm_Position.x*3.0)*0.5;

   vec3 biTangent = cross(normal,tangent.xyz);
   float shift = 0.01;
   vec3 positionA = csm_Position + tangent.xyz * shift;
   vec3 positionB = csm_Position + biTangent * shift;

   // float wobble =simplexNoise4d(vec4(
   //   csm_Position,
   //   0.0
   // ));
   float wobble = getWobble(csm_Position);
   csm_Position += wobble * normal;
   positionA+= getWobble(positionA)* normal;
   positionB+= getWobble(positionB)* normal;

   vec3 toA=normalize(positionA-csm_Position);
   vec3 toB=normalize(positionB-csm_Position);
   csm_Normal = cross(toA, toB);

   vUv=uv;
  //  vWobble=wobble;
   vWobble=wobble/uStrength;
}`
const material = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader: vertexShader,
  fragmentShader: `
  varying vec2 vUv;
  varying float vWobble;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main(){
    // csm_FragColor.rgb=vec3(1.0,0.5,0.5);//使用这个属性csm_FragColor会失去阴影
    // csm_DiffuseColor.rgb=vec3(1.0,0.5,0.5);//csm_DiffuseColor不会

    // csm_Metalness=sin(vUv.x*100.0);
    // csm_Metalness=step(0.0,sin(vUv.x*100.0));
    // csm_Metalness=step(0.0,sin(vUv.x*100.0+0.5));
    // csm_Roughness=0.0;
    // csm_Roughness=1.0-csm_Metalness;

    // csm_FragColor.rgb=vec3(vWobble);

    float colorMix=smoothstep(-1.0,1.0,vWobble);
    csm_DiffuseColor.rgb =mix(uColorA,uColorB, colorMix);

    // csm_Metalness =step(0.25, vWobble);
    // csm_Roughness=1.0-csm_Metalness;
    csm_Roughness =1.0- colorMix;
  }`,
  uniforms: uniforms,
  silent: true,//去掉报错Function copy already exists on CSM, renaming to base_copy
  // MeshPhysicalMaterial
  metalness: 0,
  roughness: 0.5,
  color: '#ffffff',
  transmission: 0,
  ior: 1.5,
  thickness: 1.5,
  transparent: true,
  wireframe: false
})
const depthMaterial = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader: vertexShader,
  uniforms: uniforms,
  silent: true,

  // MeshDepthMaterial
  depthPacking: THREE.RGBADepthPacking
})


const cube = new THREE.Mesh(geometry, material)
cube.customDepthMaterial = depthMaterial
cube.receiveShadow = true
cube.castShadow = true
// cube.position.set(0, 0, 0)
scene.add(cube)

loader.load('/threeProjectDocs/suzanne2.glb', (gltf) => {
  // console
  const wobble = gltf.scene.children[0]
  wobble.receiveShadow = true
  wobble.castShadow = true
  wobble.material = material
  wobble.customDepthMaterial = depthMaterial
  wobble.position.x=5
  scene.add(wobble)
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
)
plane.receiveShadow = true
plane.rotation.y = Math.PI
plane.position.y = - 5
plane.position.z = 5
scene.add(plane)

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)

function add() {
  gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency')
  gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency')
  gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name("uStrength")

  gui.add(uniforms.uWrapPositionFrequency, 'value', 0, 2, 0.001).name('uWrapPositionFrequency')
  gui.add(uniforms.uWrapTimeFrequency, 'value', 0, 2, 0.001).name('uWrapTimeFrequency')
  gui.add(uniforms.uWrapStrength, 'value', 0, 2, 0.001).name("uWrapStrength")

  gui.addColor(debugObject, 'colorA').onChange(() => {
    uniforms.uColorA.value.set(debugObject.colorA)
  })
  gui.addColor(debugObject, 'colorB').onChange(() => {
    uniforms.uColorB.value.set(debugObject.colorB)
  })

  gui.add(material, 'metalness', 0, 1, 0.001)
  gui.add(material, 'roughness', 0, 1, 0.001)
  gui.add(material, 'transmission', 0, 1, 0.001)
  gui.add(material, 'ior', 0, 10, 0.001)
  gui.add(material, 'thickness', 0, 10, 0.001)
  gui.addColor(material, 'color')
}

</script>

<style scoped>
#aaa{
  position: absolute;
  top: 0;
  right: 0;
}</style>