<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { Sky } from "three/examples/jsm/objects/Sky";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import jsontext from "three/examples/fonts/helvetiker_regular.typeface.json";
import zh from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
// 仰角，宽高比，近截面距离，远截面距离
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

render.shadowMap.enabled = true;
// render.shadowMap.type = THREE.PCFShadowMap;// default THREE.PCFShadowMap


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
    render.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    camera.aspect = ddd.value.offsetWidth / ddd.value.offsetHeight
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

function animate() {
  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}

const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);


loader.load('./modle_dangao.glb', (e, r) => {
  console.log(e, r, )
  let a = e.scene.children[0]
  a.position.set(0, 0, 0)
  a.scale.set(20, 20, 20)
  a.children.forEach(e => {
    if (e.name == "Retopo_文本002") {
      e.visible = false
      console.log(e)
    }
  })
  console.log(a)
  scene.add(a)
})
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 10, 0); // 设置光源位置
directionalLight.lookAt(0, 0, 0); // 设置光源朝向
scene.add(directionalLight);

// scene.background = new THREE.Color('#6bb6e5')

const sun = new THREE.Vector3(-80, 5, -100);
// water.material.uniforms["sunDirection"].value.copy(sun).normalize();
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

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({ color: '#038b18' }))
dm.position.set(0, 0, 0)
dm.receiveShadow = true
// dm.castShadow = true
// scene.add(dm)

// const wall1 = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshBasicMaterial({ color: 'green' }))
// wall1.position.set(0, 0, 0)
// wall1.receiveShadow = true
// wall1.rotateX(Math.PI / 2)
// scene.add(wall1)



// font
const floader = new FontLoader()
const f = floader.parse(zh)
if (f) {
  const textgeometry = new TextGeometry('25', {
    font: f,
    size: 1,
    depth: 0.1,
    // height: 15,
    // curveSegments: 10,
    // bevelThickness: 5,
    // bevelSize: 1.5,
    // bevelEnabled: true,
    // bevelSegments: 10,
  });

  // textgeometry.center();
  console.log(textgeometry);
  textgeometry.computeBoundingBox();
  const line = new THREE.Mesh(textgeometry, new THREE.MeshBasicMaterial({
    color: 'white',
    side: THREE.DoubleSide,//双面显示
    wireframe: false
  }))

  console.log(line);
  line.position.set(-0.6, 5.2, 2.5)
  line.scale.set(0.6,0.6,0.6)
  scene.add(line)
} else {
  console.log('err');
}

onUnmounted(() => {
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
  if (typeof resizefn === 'function') window.removeEventListener('resize', resizefn)
  if (typeof resizeHandler === 'function') window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
a{
  color: #038b18;
}</style>