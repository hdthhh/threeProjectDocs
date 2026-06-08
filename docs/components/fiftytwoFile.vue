<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

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

camera.position.set(10, 10, 10)
let resizefn = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();

  resizefn = () => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
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
const gui = new GUI()
let animationId
function animate() {
  const elapsedTime = clock.getElapsedTime()

  juan.rotation.x=-elapsedTime*0.5
  juan.rotation.y = elapsedTime * 0.5
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.5
    suzanne.rotation.y = elapsedTime * 0.5
  }

  material.uniforms.uTime.value=elapsedTime

  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}
const clock=new THREE.Clock()

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  float random2D(vec2 value){
    // 随机数
    return fract(sin(dot(value.xy,vec2(12.9898,78.233)))*43758.5453123);
  }
  void main(){
    vec4 modelPosition=modelMatrix * vec4(position,1.0);
    float gltchTime=uTime-modelPosition.y;
    float gltchStrength=sin(gltchTime)+sin(gltchTime*3.45)+sin(gltchTime*8.76);
    gltchStrength/=3.0;
    gltchStrength=smoothstep(0.3,1.0,gltchStrength);
    gltchStrength*=0.5;
    modelPosition.x+=(random2D(modelPosition.xz+uTime)-0.5)*gltchStrength;
    modelPosition.z+=(random2D(modelPosition.zx+uTime)-0.5)*gltchStrength;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vPosition= modelPosition.xyz;
    // 当为0.0时，非齐次向量，希望法线向量不随平移旋转缩放变化而变化
    vec4 modelNormal =modelMatrix*vec4(normal, 0.0);
    vNormal=modelNormal.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  uniform float uTime;
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main(){
    // mod 模运算，当超过第二个参数，变0，
    float stripes =mod((vPosition.y-uTime*0.02)*20.0,1.0);// 条纹
    stripes=pow(stripes,3.0);
    // gl_FragColor=vec4(1.0,1.0,1.0,stripes);
    // 顶点位置 视图位置
    vec3 viewDirection=normalize(vPosition-cameraPosition);
    // 法线向量和视图向量   菲涅尔
    // float fresnel=dot(viewDirection,vNormal);// 点积函数dot
    // float fresnel=dot(viewDirection,vNormal)+1.0;
    vec3 normal = normalize(vNormal);//当到这里，和vertexShader发送过来的vNormal和vNormal不一致，要重新归一化
    if(!gl_FrontFacing){normal*=-1.0;}
    float fresnel=dot(viewDirection,normal)+1.0;
    fresnel=pow(fresnel,2.0);//把渐变向外推
    float falloff=smoothstep(0.8,0.0,fresnel);
    float holographic=stripes*fresnel;// 菲涅尔+条纹
    holographic+=fresnel*1.25; 
    holographic*=falloff;//边缘过渡
    // gl_FragColor=vec4(1.0,1.0,1.0,fresnel);
    gl_FragColor=vec4(uColor,holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uTime: { value: 0 },
    uColor:{value:new THREE.Color('#70c1ff')}
  },
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,// 深度缓冲 
  blending:THREE.AdditiveBlending,//颜色更亮，效果叠加
})
const qiu = new THREE.Mesh(new THREE.SphereGeometry(2,64,32), material)
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(1, 0.4, 100, 20), material)
juan.position.set(5,0,0)
scene.add(qiu, juan)

let suzanne=null
loader.load('/threeProjectDocs/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material= material
  })
  gltf.scene.position.set(-5, 0, 0)
  gltf.scene.scale.set(2, 2, 2)
  suzanne= gltf.scene
  scene.add(gltf.scene)
})

const meterialParameters = {}
meterialParameters.color = '#70c1ff'

gui.addColor(meterialParameters, 'color').onChange(() => {
  material.uniforms.uColor.value.set(meterialParameters.color)
})
</script>

<style scoped></style>