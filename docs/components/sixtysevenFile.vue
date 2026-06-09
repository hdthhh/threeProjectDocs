<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div :class="classnames" :style="radio"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import gsap from 'gsap'

const ddd = ref(null)

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
render.toneMapping = THREE.ReinhardToneMapping
render.toneMappingExposure = 3
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

camera.position.set(4, 1, - 4)
let resizefn = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();

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
let animationId
function animate() {
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
}

const radio = ref({ transform: `scalex(0)` })
const classnames=ref('loading')
const loadingManager = new THREE.LoadingManager(() => {
  // 等待0.5秒，因为变化的动画是有等待0.5秒之后才运行的，这样最后一步从0.9到1.0的时候，就不会跳过这一步的动画了
  gsap.delayedCall(0.5, () => {
    gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
    radio.value = {}
    classnames.value += ' loaded'
  })
}, (url,currect,total) => {
  radio.value= { transform: `scalex(${currect / total})` }
})

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)


const debugObject = {}
debugObject.envMapIntensity = 2.5

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

const environmentMap = cubeTextureLoader.load([
  '/threeProjectDocs/environmentMaps/0/px.jpg',
  '/threeProjectDocs/environmentMaps/0/nx.jpg',
  '/threeProjectDocs/environmentMaps/0/py.jpg',
  '/threeProjectDocs/environmentMaps/0/ny.jpg',
  '/threeProjectDocs/environmentMaps/0/pz.jpg',
  '/threeProjectDocs/environmentMaps/0/nz.jpg'
])

environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

loader.load( '/threeProjectDocs/FlightHelmet/FlightHelmet.gltf',  (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, - 4, 0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
  }
)

const overlayGeometry = new THREE.PlaneGeometry(2,2,1,1)
const overlayMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  void main(){
    gl_Position =  vec4(position,1.0);
  }`,
  fragmentShader: `
  uniform float uAlpha;
  void main(){
    gl_FragColor=vec4(0.0,0.0,0.0,uAlpha);
  }`,
  uniforms: {
    uAlpha:{value:1.0}
  },
  transparent:true,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)


</script>

<style scoped>
.loading{
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  background-color: #fff;
  transform: scaleX(0.0);
  transform-origin: top left;
  transition: transform 0.5s;
  will-change: transform;
}
.loaded{
  transform-origin: top right;
  transition: transform 1.5s ease-in-out;
}
</style>