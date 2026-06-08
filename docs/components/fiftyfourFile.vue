<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div id="aaa" ref="a"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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

camera.position.set(10, 10, 10)

let resizefn = null
let gui=null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui= new GUI({ container: a.value })
  gui.addColor(material.uniforms.uColor, 'value',)

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
const clock = new THREE.Clock()
let animationId
function animate() {
  const elapsedTime = clock.getElapsedTime()

  juan.rotation.x = -elapsedTime * 0.5
  juan.rotation.y = elapsedTime * 0.5
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.5
    suzanne.rotation.y = elapsedTime * 0.5
  }

  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec3 uNormal;
  varying vec3 uPosition;
  void main(){
    vec4  modelPosition = modelMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // 当顶点移动时，不希望法线跟着变化，阻止平移等应用到法线上
    vec4 modelNormal = modelMatrix*vec4(normal,0.0);// 后面是非齐次向量

    // uNormal = normal;
    uNormal = modelNormal.xyz;
    uPosition = modelPosition.xyz;
  }`,
  fragmentShader: `
  uniform vec3 uColor;
  varying vec3 uNormal;
  varying vec3 uPosition;
  vec3 AmbientLight(vec3 lightColor,float lightIntensity){
    return lightColor*lightIntensity;
  }
  vec3 DirectionalLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower){
    vec3 lightDirection=normalize(lightPosition);
    vec3 lightRlflection=reflect(-lightDirection,normal);//反射函数
    float shading=dot(normal,lightDirection);
    // 法线和光线点积后，结果从1（方向相反）到0（90度）到-1（方向相同），-1和环境光乘积后光线会很小，所以要控制他至少是0
    shading=max(0.0,shading);
    float specular = -dot(lightRlflection,viewDirection);// 高光
    specular=max(0.0,specular);
    specular=pow(specular,specularPower);
    return lightColor*lightIntensity*(shading+specular);
    // return vec3(shading);
    // return vec3(specular);
  }
  vec3 PointLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower,vec3 position,float lightdecay){
    vec3 lightDelta=lightPosition-position;
    float lightDistance=length(lightDelta);
    vec3 lightDirection=normalize(lightDelta);
    vec3 lightRlflection=reflect(-lightDirection,normal);//反射函数
    float shading=dot(normal,lightDirection);
    // 法线和光线点积后，结果从1（方向相反）到0（90度）到-1（方向相同），-1和环境光乘积后光线会很小，所以要控制他至少是0
    shading=max(0.0,shading);
    float specular = -dot(lightRlflection,viewDirection);// 高光
    specular=max(0.0,specular);
    specular=pow(specular,specularPower);
    float decay=1.0-lightDistance*lightdecay;
    decay=max(0.0,decay);
    return lightColor*lightIntensity*decay*(shading+specular);
    // return vec3(shading);
    // return vec3(specular);
    // return vec3(decay);
  }
  void main(){
    vec3 viewDirection=normalize(uPosition-cameraPosition);// 视图方向

    vec3 color=uColor;

    vec3 light=vec3(0.0);
    light+=AmbientLight(vec3(1.0),0.03);
    light+=DirectionalLight(vec3(0.1,0.1,1.0),1.0,normalize(uNormal),vec3(0.0,0.0,3.0),viewDirection,10.0);
    light+=PointLight(vec3(1.0,0.1,0.1),1.0,normalize(uNormal),vec3(0.0,2.5,0.0),viewDirection,20.0,uPosition,0.05);
    color*=light;//光和颜色作用，照在物体上

    gl_FragColor=vec4(color,1.0);
  }`,
  uniforms: {
    uColor: { value: new THREE.Color(0.1, 0.1, 1.0) }
  }
})

const qiu = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material)
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.4, 100, 20), material)
juan.position.set(2, 0, 0)
scene.add(qiu, juan)

let suzanne = null
loader.load('/threeProjectDocs/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material = material
  })
  gltf.scene.position.set(-2, 0, 0)
  // gltf.scene.scale.set(2, 2, 2)
  suzanne = gltf.scene
  scene.add(gltf.scene)
})

const directionalLightHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide
  })
)
directionalLightHelper.position.set(0, 0.0, 3)
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)
pointLightHelper.position.set(0.0, 2.5, 0.0)
pointLightHelper.material.color.setRGB(1.0, 0.1, 0.1)
scene.add(pointLightHelper)


</script>

<style scoped>
#aaa{
  position: absolute;
  top: 0;
  right: 0;
}</style>