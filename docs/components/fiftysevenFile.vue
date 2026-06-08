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

camera.position.set(5, 5, 5)
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
    camera.aspect = ddd.value.offsetWidth/ddd.value.offsetHeight
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
const clock = new THREE.Clock()
let animationId
function animate() {
  const elapsedTime = clock.getElapsedTime()

  earth.rotation.y = elapsedTime * 0.5

  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);
// anisotropy 各向异性 可以提高纹理的清晰度
// 获取该设备下的最大各向异性可设置值
// console.log(render.capabilities.getMaxAnisotropy())

// texture导入assets的图片，使用这种方式
// 或者 import a from assets/a.jpg  textureLoader.load(a)
const dayTexture = textureLoader.load(new URL(`/components/assets/earth/day.jpg`, import.meta.url).href)
dayTexture.colorSpace = THREE.SRGBColorSpace
dayTexture.anisotropy = 8
const nightTexture = textureLoader.load(new URL(`/components/assets/earth/night.jpg`, import.meta.url).href)
nightTexture.colorSpace = THREE.SRGBColorSpace
nightTexture.anisotropy = 8
const specularCloudsTexture = textureLoader.load(new URL(`/components/assets/earth/specularClouds.jpg`, import.meta.url).href)
specularCloudsTexture.anisotropy = 8

const earthParameters ={}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#ff6600'


const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
  }`,
  fragmentShader: `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform sampler2D udayTexture;
  uniform sampler2D unightTexture;
  uniform sampler2D uspecularCloudsTexture;
  uniform vec3 usunDirection;
  uniform vec3 uAtmosphereTwilightColor;
  uniform vec3 uAtmosphereDayColor;

  void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = vec3(0.0);

    float sunOrientation=dot(usunDirection,normal);// 根据太阳的方位，定义一半的白天和一半的黑天

    // 日夜
    vec3 day=texture(udayTexture,vUv).xyz;
    vec3 night=texture(unightTexture,vUv).rgb;
    // color=vec3(sunOrientation);
    // color=day;
    float daymix=smoothstep(-0.25,0.5,sunOrientation);
    color=mix(night,day,daymix);

    // 云
    vec2 specularCloudsColor=texture(uspecularCloudsTexture,vUv).rg;
    // float cloudsMix = specularCloudsColor.g;
    // 0.3-1.0 范围 ，减少云的数量
    float cloudsMix = smoothstep(0.3,1.0,specularCloudsColor.g);
    cloudsMix*=daymix; // 把云在黑夜移除
    color=mix(color,vec3(1.0),cloudsMix);

    // 菲涅尔
    float fresnel=dot(viewDirection,normal)+1.0;
    fresnel= pow(fresnel,2.0);

    // 大气层
    float atmosphereDayMix=smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    // color= atmosphereColor;
    // color=mix(color,atmosphereColor,fresnel);
    color=mix(color,atmosphereColor,fresnel*atmosphereDayMix);

    // 镜面反射，太阳光照在地球上反光
    vec3 reflection = reflect(-usunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular,0.0);
    specular = pow(specular,32.0);
    specular*=specularCloudsColor.r;// 陆地上，不反射太阳光
    // color += vec3(specular);
    // 我们希望边缘呈现大气层的颜色
    vec3 specularColor = mix(vec3(1.0),atmosphereColor, fresnel);
    color += specular * specularColor;

    gl_FragColor = vec4(color, 1.0); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    udayTexture: new THREE.Uniform(dayTexture),
    unightTexture: { value: nightTexture },
    uspecularCloudsTexture: { value: specularCloudsTexture },
    usunDirection: { value: new THREE.Vector3(0, 0, 1) },
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
  }
})

const geometry = new THREE.SphereGeometry(2, 64, 64)
const earth = new THREE.Mesh(geometry, material)
scene.add(earth)

// 大气层外层 类似雾气一样
const atmosphereMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  transparent: true,
  vertexShader: `
  // varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
  }`,
  fragmentShader: `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 usunDirection;
  uniform vec3 uAtmosphereTwilightColor;
  uniform vec3 uAtmosphereDayColor;

  void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = vec3(0.0);

    float sunOrientation=dot(usunDirection,normal);// 根据太阳的方位，定义一半的白天和一半的黑天

    // 大气层
    float atmosphereDayMix=smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color+=atmosphereColor;

    // 透明度
    float edgeAlpha=dot(viewDirection, normal);
    edgeAlpha =smoothstep(0.0,0.5,edgeAlpha);
   
    float dayAlpha =smoothstep(-0.5,0.0,sunOrientation);
    float alpha = edgeAlpha * dayAlpha;

    gl_FragColor = vec4(color, alpha); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    usunDirection: { value: new THREE.Vector3(0, 0, 1) },
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
  }
})
const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)


const sun = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

const debugSun = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 2), new THREE.MeshBasicMaterial())
scene.add(debugSun)

const updateSun = () => {
  sunDirection.setFromSpherical(sun)
  debugSun.position.copy(sunDirection).multiplyScalar(5)
  // 位置乘5，离的更远
  if (material) material.uniforms.usunDirection.value.copy(sunDirection)
  if (atmosphereMaterial) atmosphereMaterial.uniforms.usunDirection.value.copy(sunDirection)
}
updateSun()

function add() {
  gui.addColor(earthParameters, 'atmosphereDayColor').onChange(() => {
    material.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
  })
  gui.addColor(earthParameters, 'atmosphereTwilightColor').onChange(() => {
    material.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
  })

  gui.add(sun, "phi").min(0).max(Math.PI).onChange(updateSun);
  gui.add(sun, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);
}

</script>

<style scoped>
#aaa{
  position: absolute;
  top: 0;
  right: 0;
}</style>