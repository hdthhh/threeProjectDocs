<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div id="aaa" ref='a'></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { Water } from "three/examples/jsm/objects/Water";

const ddd = ref(null)
const a = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，原截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
// scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01 // 鼠标滚动一个单位时拉伸幅度
// OrbitControl.maxPolarAngle = Math.PI / 2 // 限制俯仰角以避免翻转（可选）

camera.position.set(10, 10, 10)

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
function animate() {
  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
  // 让水流动
  water1.material.uniforms["time"].value += 1.0 / 500;
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


// 右 左 上 下 前 后  如不够，颜色透明，无颜色
// const redmaterial = new THREE.MeshBasicMaterial({ color: 'red' })
// const yellowmaterial = new THREE.MeshBasicMaterial({ color: 'yellow' })
// const greenmaterial = new THREE.MeshBasicMaterial({ color: 'green' })
// const bluematerial = new THREE.MeshBasicMaterial({ color: 'blue' })
// const purplematerial = new THREE.MeshBasicMaterial({ color: 'purple' })
// const graymaterial = new THREE.MeshBasicMaterial({ color: 'gray' })

// const geometry = new THREE.BoxGeometry(10, 10, 10)
// const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'red' }))
// cube.position.set(0, 0, 0)
// scene.add(cube)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
const directionalLight = new THREE.DirectionalLight(0XFFFFFF, 0.9)
scene.add(ambientLight, directionalLight)
scene.background = new THREE.Color(0xd8dfe4)

const bl = new THREE.MeshPhysicalMaterial({
  metalness: 0.0,//玻璃非金属  金属度设置0
  roughness: 0.0,//玻璃表面光滑  
  envMapIntensity: 1.0,
  transmission: 1.0,//透射度(透光率)
  ior: 1.5,//折射率 1.0到2.333
  // env: textureLoader.load('./bg.jpeg')
  // color: new THREE.Color().lerpColors('green', 'red', 0.5)
  // transparent: true
})
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff, // 白色玻璃
  transparent: true,
  opacity: 0.1, // 透明度，接近1但不完全为1以模拟玻璃的微微半透明效果
  refractionRatio: 0.95, // 折射比，模拟玻璃的折射效果
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 10, 64), [glassMaterial, null, glassMaterial])
scene.add(cube)


// 创建水的材质
const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x5eafe8, // 青色代表水
  transparent: true,
  opacity: 0.5, // 透明度
  refractionRatio: 0.98, // 模拟水的折射效果
  // alphaMap: textureLoader.load('./black.jpg') // 没效果？？？
});
const water = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 6, 64), waterMaterial);
water.position.y = -2; // 调整位置以匹配杯内的水位
// scene.add(water);
const water1 = new Water(new THREE.CylinderGeometry(3.8, 3.8, 6, 64), {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load(
    "/threeProjectDocs/waternormals.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  waterColor: 0x52acdc,
  alpha: 0.5, // 透明
});
water1.position.y = -2
water1.material.transparent = true // 透明，如果要使用opacity，要开透明
// water1.material.opacity = 0.5 // 加了没有效果？
scene.add(water1);
console.log(water1)

scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'red' }),))
// textureLoader.load('./bg.jpeg', bg => {
//   bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
//   scene.background = bg
//   scene.environment = bg
// })


function add() {
  gui.addColor({ colora: '#d8dfe4' }, 'colora').onChange((val) => {
    //addcolor 第一个参数和第二个参数要一致 colora
    scene.background = new THREE.Color(val)
  })
  // gui.add()
  // const fff = gui.addFolder('material attribute')
  // fff.add(bl, 'metalness', 0, 1)
  // fff.add(bl, 'roughness', 0, 1)
  // fff.add(bl, 'envMapIntensity', 0, 1)
  // fff.add(bl, 'transmission', 0, 1)
  // fff.add(bl, 'ior', 1, 2.33)
  // fff.addColor({ color: '#d8dfe4' }, 'color').onChange(val => {
  //   waterMaterial.color = new THREE.Color(val)
  // })
}


// onUnmounted(() => [
//   // 销毁时销毁gui
//   gui.destroy()
//   // gui.dispose()  // control类但无dispose方法
// ])
</script>

<style scoped>
a {
  color: #52acdc;
}
#aaa {
  position: absolute;
  /* width: 100%;
  height: 100%; */
  top: 0;
  right: 0;
}
</style>