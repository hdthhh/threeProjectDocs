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
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

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
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(10, 10, 10)

let resizefn = null
let animationId
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
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);
  // 让水流动
  water.material.uniforms["time"].value += 1.0 / 60;
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);




const water = new Water(new THREE.PlaneGeometry(10000, 10000), {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load(
    "/threeProjectDocs/waternormals.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  waterColor: 0x0072ff,
});
water.rotation.x = -Math.PI / 2;
scene.add(water)


const sun = new THREE.Vector3(-80, 5, -100);
water.material.uniforms["sunDirection"].value.copy(sun).normalize();
// 加了太阳之后，水面显示会有点泛白，是因为太阳的位置的向量长度太长
// 归一化 将向量的xyz等比例缩放，将整个向量的长度缩放到长度为1  调用一下normalize函数就可以将向量设置成单位向量

const sky = new Sky();
sky.scale.setScalar(10000);

sky.material.uniforms["sunPosition"].value.copy(sun);
sky.material.uniforms["turbidity"].value = 1;
sky.material.uniforms["rayleigh"].value = 1.5;
sky.material.uniforms["mieCoefficient"].value = 0.005;
sky.material.uniforms["mieDirectionalG"].value = 0.8;

scene.add(sky);



function add() {
  const folderSun = gui.addFolder("太阳位置");
  folderSun
    .add(sun, "x", -100, 100)
    .onChange(updateSunPosition);
  folderSun
    .add(sun, "y", -100, 100)
    .onChange(updateSunPosition);
  folderSun
    .add(sun, "z", -100, 100)
    .onChange(updateSunPosition);
  // 更新太阳的位置
  function updateSunPosition() {
    water.material.uniforms["sunDirection"].value
      .copy(sun)
      .normalize();
    sky.material.uniforms["sunPosition"].value.copy(sun);
  }

  let waterParams = {
    speed: 1.0,
    alpha: 1.0,
    distortionScale: 20,
  };
  const folderWater = gui.addFolder("海水");
  folderWater.add(waterParams, "alpha", 0, 1)
    .onChange((value) => {
      water.material.uniforms["alpha"].value = value;
    });
  folderWater
    .add(waterParams, "distortionScale", 0, 240, 0.1)
    .name("扭曲比例")
    .onChange((value) => {
      water.material.uniforms["distortionScale"].value = value;
    });

  const folderSky = gui.addFolder("天空");
  let skyParams = {
    turbidity: 1,
    rayleigh: 1.5,
  };
  folderSky
    .add(skyParams, "turbidity", 0, 100)
    .name("浑浊度")
    .onChange((value) => {
      sky.material.uniforms["turbidity"].value = value;
    });
  folderSky
    .add(skyParams, "rayleigh", 0, 100)
    .name("锐利值")
    .onChange((value) => {
      sky.material.uniforms["rayleigh"].value = value;
    });
}

</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>