<template>
  <div id="top" style="width: 100%;height: 100%;">
    <div ref="ddd" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import picture from '../components/assets/picture-1.png'
import glow from '../components/assets/glow.png'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
  // powerPreference: 'low-power',
  // preserveDrawingBuffer: false,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap
render.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

camera.position.set(0, 0, 20)
let resizefn = null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  updateCanvas()
  animate();

  resizefn = () => {
    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    camera.aspect = ddd.value.offsetWidth/ddd.value.offsetHeight
    render.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    material.uniforms.uResolution.value.set(ddd.value.offsetWidth * Math.min(window.devicePixelRatio, 2),  ddd.value.offsetHeight * Math.min(window.devicePixelRatio, 2))
    camera.updateProjectionMatrix()
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

})
onUnmounted(() => {
  // gui.destroy()
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

  if(document.querySelector('#top'))document.querySelector('#top').remove(displacement.canvas)
  window.removeEventListener("pointermove", shubiaofn)
})
// const gui = new GUI()
let animationId
function animate() {
  displacement.raycaster.setFromCamera(displacement.screenCursor, camera)
  const intersections = displacement.raycaster.intersectObject(displacement.interactivePlane)
  // console.log(intersections)
  if (intersections.length) {
    const uv = intersections[0].uv

    displacement.canvasCursor.x = uv.x * displacement.canvas.width
    // 1-uv.y是因为uv的方向和canvas是相反的
    displacement.canvasCursor.y = (1-uv.y) * displacement.canvas.height
  }

  displacement.context.globalCompositeOperation = "source-over"//先设置成这个，避免被下面的明亮在下一次函数调用时影响
  displacement.context.globalAlpha = 0.02
  // 用淡黑色填充画布
  displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

  // 速度 角度
  const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor)
  displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
  const alpha= Math.min(cursorDistance * 0.1,1)

  // 位移
  const glowSize = displacement.canvas.width * 0.25 //光标大小
  displacement.context.globalCompositeOperation = "lighten"
  // displacement.context.globalAlpha = 1
  displacement.context.globalAlpha = alpha
  displacement.context.drawImage(
    displacement.glowImage,
    displacement.canvasCursor.x-glowSize*0.5,
    displacement.canvasCursor.y-glowSize*0.5,
    glowSize, glowSize
  )

  displacement.texture.needsUpdate=true

  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);



const displacement = {}
// 2D canvas
displacement.canvas = document.createElement('canvas')
displacement.canvas.width = 128
displacement.canvas.height = 128
displacement.canvas.style.position = "absolute"
displacement.canvas.style.width = '256px'
displacement.canvas.style.height = '256px'
displacement.canvas.style.top = 0
displacement.canvas.style.left = 0
displacement.canvas.style.zIndex = 10

// 鼠标在canvas上的移动轨迹的图案
displacement.glowImage = new Image()
displacement.glowImage.src = glow
// setTimeout(() => {
//   displacement.context.drawImage(displacement.glowImage, 20, 20, 32, 32)
// }, 1100);

// 和图案重叠的平面
displacement.interactivePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide, })
)
displacement.interactivePlane.visible=false
scene.add(displacement.interactivePlane)

// 射线
displacement.raycaster = new THREE.Raycaster()

// 坐标 鼠标
displacement.screenCursor = new THREE.Vector2(9999, 9999)
// 坐标 画布
displacement.canvasCursor = new THREE.Vector2(9999, 9999)

displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)

let shubiaofn
function updateCanvas() {
  document.querySelector('#top').append(displacement.canvas)
  displacement.context = displacement.canvas.getContext('2d')
  // displacement.context.fillStyle = 'red'
  displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

  shubiaofn = (event) => {
    displacement.screenCursor.x = (event.clientX / window.innerWidth) * 2 - 1
    displacement.screenCursor.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  window.addEventListener("pointermove", shubiaofn)
}

// 纹理
displacement.texture = new THREE.CanvasTexture(displacement.canvas)


const material = new THREE.ShaderMaterial({
  vertexShader: `
  uniform vec2 uResolution;
  uniform sampler2D uPictureTexture;
  uniform sampler2D uDisplacementTexture;

  attribute float aIntensity;
  attribute float aAngle;

  varying vec3 vColor;

  void main(){
    vec3 newPosition = position;
    float displacementIntensity=texture(uDisplacementTexture, uv).r;
    displacementIntensity=smoothstep(0.1,0.3,displacementIntensity);//粒子不能回到最初位置，平滑一下

    // 位移
    vec3 displacement = vec3(
      cos(aAngle)*0.2,
      sin(aAngle)*0.2,
      1.0
    );
    displacement=normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    newPosition += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float pictureIntensity=texture(uPictureTexture,uv).r;

    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor=vec3(pow(pictureIntensity,2.0));
  }`,
  fragmentShader: `
  varying vec3 vColor;

  void main(){
    vec2 uv=gl_PointCoord;
    // 相同效果，不同写法
    // float distanceToCenter = distance(uv,vec2(0.5));
    float distanceToCenter = length(uv-vec2(0.5));
    if(distanceToCenter > 0.5) discard;

    gl_FragColor=vec4(vec3(vColor),1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2))),
    uPictureTexture: new THREE.Uniform(textureLoader.load(picture)),
    uDisplacementTexture: new THREE.Uniform(displacement.texture),
  },
})

const geometry = new THREE.PlaneGeometry(10, 10, 128, 128)
geometry.setIndex(null)
geometry.deleteAttribute('normal')
const particles = new THREE.Points(geometry, material)
scene.add(particles)

const intensitiesArray =new Float32Array(geometry.attributes.position.count)
const angleArray = new Float32Array(geometry.attributes.position.count)
for (let i = 0; i < geometry.attributes.position.count; i++){
  intensitiesArray[i] = Math.random()
  angleArray[i]= Math.random()*Math.PI*2
}
geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
geometry.setAttribute('aAngle', new THREE.BufferAttribute(angleArray,1))
</script>

<style scoped></style>