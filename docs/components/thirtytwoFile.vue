<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import f from 'three/examples/fonts/helvetiker_regular.typeface.json'

const ddd = ref(null)

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
// scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
// scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼,允许远近拉伸
OrbitControl.dampingFactor = 0.01// 鼠标滚动一个单位时拉伸幅度

camera.position.set(20, 20, 20)

let resizefn = null
let animationId
// 渲染元素，启用动画
onMounted(() => {
  ddd.value.appendChild(render.domElement)
  animate();
  setInterval(() => {
    move()
  }, 100);

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

function animate() {
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);

}


const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 100)
pointLight.position.set(0, 23, 0)
// scene.add(pointLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
directionalLight.position.set(-100, 20, 0)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 10)
directionalLight2.position.set(100, 20, 0)
scene.add(directionalLight, directionalLight2)


const textureLoader = new THREE.TextureLoader()


const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: textureLoader.load(new URL(`/components/assets/xd.jpg`, import.meta.url).href),
  // side: THREE.FrontSide
}))
dm.position.set(0, -1, 0)

// dm.receiveShadow = true;
scene.add(dm)


// let bg = textureLoader.load('/components/assets/bw.jpg')
// bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
// scene.background = 0xffffff
// scene.environment = 0xffffff
scene.background = { color: 0xffffff }


const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);
// christmas_tree   2.5k_followers_christmas_special
loader.load('/threeProjectDocs/2.5k_followers_christmas_special/scene.gltf', (gltf) => {
  console.log(gltf)
  gltf.scene.scale.set(30, 30, 30)
  scene.add(gltf.scene)
})
loader.load('/threeProjectDocs/snowman/scene.gltf', (gltf) => {
  gltf.scene.scale.set(5, 5, 5)
  gltf.scene.position.set(25, 3, 0)
  gltf.scene.rotation.y = THREE.MathUtils.degToRad(90)
  scene.add(gltf.scene)
})
loader.load('/threeProjectDocs/santa_claus/scene.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.position.set(-25, 10, 0)
  // gltf.scene.rotation.y = THREE.MathUtils.degToRad(90)
  scene.add(gltf.scene)
})


const group = new THREE.Group()
let map = textureLoader.load(new URL(`/components/assets/xh.png`, import.meta.url).href)
for (let i = 0; i < 200; i++) {
  // 创建精灵材质对象SpriteMaterial
  const spriteMaterial = new THREE.SpriteMaterial({
    // color: 0x699fab,// 设置颜色 黑色完全不显示，白色完全显示 有点像蒙版
    map: map
  });
  // 创建精灵模型对象，不需要几何体geometry参数
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(1, 1, 1)
  sprite.position.set((Math.random() * 100).toFixed(0) - 50, (Math.random() * 100).toFixed(0) - 0, (Math.random() * 100).toFixed(0) - 50)
  group.add(sprite)
}
scene.add(group)

function move() {
  group.children.map(item => {
    if (item.position.y < 1) {
      item.position.set((Math.random() * 100).toFixed(0) - 50, (Math.random() * 100).toFixed(0) - 0, (Math.random() * 100).toFixed(0) - 50)
    } else {
      item.position.y -= 1
      item.position[Math.random() > 0.5 ? 'x' : 'z'] += (Math.random() > 0.5 ? 1 : -1)
    }
  })
}

// const fontloader = new FontLoader()
// console.log(fontloader.parse(f));

// const text = new TextGeometry('merry christmas!', {
//   font: fontloader.parse(f),
//   size: 5,
//   depth: 5,
// })
// const textmesh = new THREE.Mesh(text, new THREE.MeshBasicMaterial({ color: 'green' }))
// textmesh.position.set(0, 50, 0)
// scene.add(textmesh)

const mc = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureLoader.load(new URL(`/components/assets/mc.png`, import.meta.url).href) }));
mc.position.set(0, 70, 0)
mc.scale.set(80, 80, 80)
scene.add(mc)



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

<style scoped></style>