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
import gsap from 'gsap';
import { Sky } from 'three/addons/objects/Sky.js';

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
// scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(2, 2, 5)
let resizefn = null
let animatefn = null
let gui=null
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  gui = new GUI({ container: a.value })
  add()

  resizefn = () => {
    sizes.width = ddd.value.offsetWidth
    sizes.height =  ddd.value.offsetHeight
    sizes.pixelRadio = Math.min(window.devicePixelRatio, 2)
    sizes.resolution.set(sizes.width * sizes.pixelRadio, sizes.height * sizes.pixelRadio)

    render.setPixelRatio(sizes.pixelRadio)

    render.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    camera.aspect = ddd.value.offsetWidth/ ddd.value.offsetHeight
    camera.updateProjectionMatrix()
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

  // animatefn = () => {
  //   const count = Math.round(1400 + Math.random() * 1000)
  //   const position = new THREE.Vector3(
  //     (Math.random() - 0.5) * 2,
  //     Math.random(),
  //     (Math.random() - 0.5) * 2,
  //   )
  //   const size = 0.1 + Math.random() * 0.1
  //   const texture = textureLoader.load('/xingxing.png')
  //   const radius = 0.5 + Math.random()+2
  //   const color = new THREE.Color()
  //   color.setHSL(Math.random(),1, 0.7)
  //   createFirework(count, position, size, texture, radius, color)
  //   // createFirework(100, new THREE.Vector3(0, 0, 0), 0.5, textureLoader.load('/xingxing.png'), 1, new THREE.Color('#1596db'))
  // }
  // window.addEventListener('click', animatefn)

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
  // window.removeEventListener('click', animatefn)
})
// const gui = new GUI()
let animationId
function animate() {
  OrbitControl.update()
  animationId = requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRadio: Math.min(window.devicePixelRatio, 2)
}
// sizes.resolution=new THREE.Vector2(sizes.width,sizes.height)
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRadio, sizes.height * sizes.pixelRadio)

const createFirework = (count, position, size, texture, radius, color) => {
  texture.flipY = false//反转材质y，图案是倒的
  const positionArray = new Float32Array(count * 3)//定位
  const sizeArray = new Float32Array(count)//大小
  const timeMultipliersArray=new Float32Array(count)//生命周期，能存活多久

  for (let i = 0; i < count; i++) {
    // 球形坐标
    // const spherical = new THREE.Spherical(radius, Math.random() * Math.PI, Math.random() * Math.PI * 2)
    // 给半径增加一点随机数，0.75-1之间，让烟花的点不那么固定在球体表面
    const spherical = new THREE.Spherical(radius * (0.72 + 0.25 * Math.random()), Math.random() * Math.PI, Math.random() * Math.PI * 2)
    const position = new THREE.Vector3()
    position.setFromSpherical(spherical)

    // positionArray[i * 3] = Math.random() - 0.5
    // positionArray[i * 3 + 1] = Math.random() - 0.5
    // positionArray[i * 3 + 2] = Math.random() - 0.5
    positionArray[i * 3] = position.x
    positionArray[i * 3 + 1] = position.y
    positionArray[i * 3 + 2] = position.z

    sizeArray[i] = Math.random()

    timeMultipliersArray[i]= 1 + Math.random()
  }
  // console.log(positionArray)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3))
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizeArray, 1))
  geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1))
  const material = new THREE.ShaderMaterial({
    vertexShader: `
    uniform float uSize;
    uniform vec2 uResolution;
    attribute float aSize;
    uniform float uProgress;
    attribute float aTimeMultiplier;

    // x最小，x最大，y最小，y最大，开始结束区间，取值范围区间
    float remap(float value,float originMin,float originMax,float destinationMin,float destinationMax){
      return destinationMin+(value-originMin)*(destinationMax-destinationMin)/(originMax-originMin);
    }

    void main(){
      float progress=uProgress*aTimeMultiplier;
      vec3 newPosition=position;

      // 爆炸效果__/——
      float explodingProgress=remap(progress,0.0,0.1,0.0,1.0);
      explodingProgress=clamp(explodingProgress,0.0,1.0);//限制他0到1，不然一直向外延伸
      explodingProgress=1.0-pow(1.0-explodingProgress,3.0);//速度 幂函数 从快到慢1-（1-x）3次方
      newPosition*=explodingProgress;

      // 爆炸后下落效果_/
      float fallingProgress=remap(progress,0.1,1.0,0.0,1.0);
      fallingProgress=clamp(fallingProgress,0.0,1.0);
      fallingProgress=1.0-pow(1.0-fallingProgress,3.0);
      newPosition.y-=fallingProgress*0.2;

      // 缩放效果,爆炸变大，慢慢变小，直到消失 //     //\\     //
      float sizeOpeningProgress=remap(progress,0.0,0.125,0.0,1.0);
      float sizeClosingProgress=remap(progress,0.125,1.0,1.0,0.0);
      float sizeProgress=min(sizeOpeningProgress,sizeClosingProgress);
      sizeProgress=clamp(sizeProgress,0.0,1.0);

      // 闪烁效果__/——
      float twinklingProgress=remap(progress,0.2,0.8,0.0,1.0);
      twinklingProgress=clamp(twinklingProgress,0.0,1.0);
      float sizeTwinkling=sin(progress*30.0)*0.5+0.5;
      sizeTwinkling=1.0-sizeTwinkling*twinklingProgress;

      vec4 modelPosition = modelMatrix * vec4(newPosition,1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;

      // 粒子大小 
      // gl_PointSize=uSize*uResolution.y;
      // gl_PointSize=uSize*uResolution.y*aSize;
      gl_PointSize=uSize*uResolution.y*aSize*sizeProgress*sizeTwinkling;
      gl_PointSize*=1.0/-viewPosition.z;

      // 粒子大小小于1是还在，但是windows要求粒子大小不能小于1，把他放在远处，不去渲染
      if(gl_PointSize<1.0){gl_Position=vec4(9999.9);}
    }`,
    fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    void main(){
      //用于表示当前片元在其所属点图元（如点精灵）内的相对坐标 gl_PointCoord
      // vec4 textureColor=texture(uTexture,gl_PointCoord);
      // gl_FragColor=textureColor;
      float textureAlpha=texture(uTexture,gl_PointCoord).r;// 取通道的某一个值
      // gl_FragColor=vec4(1.0,1.0,1.0,textureAlpha);
      gl_FragColor=vec4(uColor,textureAlpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
    uniforms: {
      uSize: { value: size },
      uResolution: { value: sizes.resolution },
      uTexture: { value: texture },
      uColor: { value: color },
      uProgress: { value: 0 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const firework = new THREE.Points(geometry, material)
  firework.position.copy(position)
  scene.add(firework)

  const destory = () => {
    // 销毁烟花，在动画结束后
    scene.remove(firework)
    geometry.dispose()
    material.dispose()
  }
  gsap.to(material.uniforms.uProgress, { value: 1, duration: 3, ease: 'none', onComplete: destory })

}

// createFirework(100, new THREE.Vector3(0, 0, 0), 0.5, textureLoader.load('/xingxing.png'), 1, new THREE.Color('#1596db'))


// sky
// Add Sky
const sky = new Sky();
sky.scale.setScalar(45000);
scene.add(sky);

const sun = new THREE.Vector3();

/// GUI

const effectController = {
  turbidity: 10,
  rayleigh: 3,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.95,
  elevation: -2.2,
  azimuth: 180,
  exposure: render.toneMappingExposure
};

function guiChanged() {
  gui.add({
    create: () => {
      const count = Math.round(1400 + Math.random() * 1000)
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2,
      )
      const size = 0.1 + Math.random() * 0.1
      const texture = textureLoader.load('/threeProjectDocs/xingxing.png')
      const radius = 0.5 + Math.random() + 2
      const color = new THREE.Color()
      color.setHSL(Math.random(), 1, 0.7)
      createFirework(count, position, size, texture, radius, color)
      // createFirework(100, new THREE.Vector3(0, 0, 0), 0.5, textureLoader.load('/xingxing.png'), 1, new THREE.Color('#1596db'))
    }
  }, 'create').name('烟花宜落日，丝管醉春风')

  

  const uniforms = sky.material.uniforms;
  uniforms['turbidity'].value = effectController.turbidity;
  uniforms['rayleigh'].value = effectController.rayleigh;
  uniforms['mieCoefficient'].value = effectController.mieCoefficient;
  uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms['sunPosition'].value.copy(sun);

  render.toneMappingExposure = effectController.exposure;
  render.render(scene, camera);

}

// const gui = new GUI();

function add() {
  gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
  gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
  gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
  gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
  gui.add(effectController, 'elevation', -3, 90, 0.01).onChange(guiChanged);
  gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
  gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

  guiChanged();
}

</script>

<style scoped>
#aaa{
  position: absolute;
  top: 0;
  right: 0;
}</style>