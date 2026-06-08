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

camera.position.set(-5, 5, 12)
let resizefn = null
let gui = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui = new GUI({ container: a.value })
  gui.add(uniforms.uSliceStart, 'value', -Math.PI, Math.PI, 0.001).name('usliceStart')
  gui.add(uniforms.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('uSliceArc')

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

  if (model) model.rotation.y = elapsedTime * 0.1

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

rgbeLoader.load('/threeProjectDocs/aerodynamics_workshop.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.backgroundBlurriness = 0.5
  scene.environment = environmentMap
})


const uniforms = {
  uSliceStart: new THREE.Uniform(1.75),
  uSliceArc: new THREE.Uniform(1.25)
}


const patchMap = {
  csm_Slice: {
    '#include <colorspace_fragment>': `
        #include <colorspace_fragment>
          
        if(!gl_FrontFacing)gl_FragColor=vec4(0.75,0.15,0.3,1.0);
      `
  }
}

// const geometry = new THREE.IcosahedronGeometry(2.5, 5)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: '#858080'
})
// const cube = new THREE.Mesh(geometry, material)
// cube.position.set(0, 0, 0)
// scene.add(cube)
const slicedMaterial = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshStandardMaterial,
  silent: true,
  vertexShader: `
  varying vec3 vPosition;
  void main(){
    vPosition=csm_Position.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  uniform float uSliceStart;
  uniform float uSliceArc;
  void main(){

    float angle = atan(vPosition.y,vPosition.x);
    angle-=uSliceStart;
    angle=mod(angle,PI2);
    if(angle >0.0 && angle < uSliceArc)discard;

    // csm_FragColor=vec4(vec3(angle),1.0);
    // if(!gl_FrontFacing)csm_FragColor=vec4(0.75,0.15,0.3,1.0);
    float csm_Slice; //写属性名就可以激活
  }`,
  uniforms: uniforms,
  patchMap: patchMap,
  //MeshStandardMaterial
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: '#858080',
  side:THREE.DoubleSide
})
const slicedDepthMaterial = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshDepthMaterial,
  silent: true,
  vertexShader: `
  varying vec3 vPosition;
  void main(){
    vPosition=csm_Position.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  uniform float uSliceStart;
  uniform float uSliceArc;
  void main(){

    float angle = atan(vPosition.y,vPosition.x);
    angle-=uSliceStart;
    angle=mod(angle,PI2);
    if(angle >0.0 && angle < uSliceArc)discard;

    // csm_FragColor=vec4(vec3(angle),1.0);
    // if(!gl_FrontFacing)csm_FragColor=vec4(0.75,0.15,0.3,1.0);
    float csm_Slice; //写属性名就可以激活
  }`,
  uniforms: uniforms,
  patchMap: patchMap,

  //MeshDepthMaterial
  depthPacking: THREE.RGBADepthPacking
})

let model
loader.load('/threeProjectDocs/gears.glb', (gltf) => {
  model = gltf.scene

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name == 'outerHull') {
        child.material = slicedMaterial
        child.customDepthMaterial = slicedDepthMaterial
      } else {
        child.material = material
      }
      
      child.castShadow=true
      child.receiveShadow = true
    }
  })

  scene.add(model)
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
)
plane.receiveShadow = true
plane.position.x = - 4
plane.position.y = - 3
plane.position.z = - 4
plane.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(plane)

const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.normalBias = 0.05
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)

</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>