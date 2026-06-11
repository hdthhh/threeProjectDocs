<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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
let animationId
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

function animate() {
  OrbitControl.update()
  animationId=requestAnimationFrame(animate);
  render.render(scene, camera);

}


const textureLoader = new THREE.TextureLoader()
// 创建精灵材质对象SpriteMaterial
const spriteMaterial = new THREE.SpriteMaterial({
  // color: 0x699fab,// 设置颜色 黑色完全不显示，白色完全显示 有点像蒙版
  map: textureLoader.load(new URL(`/components/assets/bw.jpg`, import.meta.url).href)
});
// 创建精灵模型对象，不需要几何体geometry参数
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(10, 10, 1)
scene.add(sprite)

scene.background = new THREE.Color('#6b5151')

// 效果差
const yd = textureLoader.load(new URL(`/components/assets/yd.png`, import.meta.url).href)
const spriteMaterial2 = new THREE.SpriteMaterial({
  map: yd,
  transparent: true // png图片要加透明
})

const group = new THREE.Group()
for (let i = 0; i < 10000; i++) {
  const ydsprite = new THREE.Sprite(spriteMaterial2)
  group.add(ydsprite)
  ydsprite.scale.set(1, 1, 1);
  // 设置精灵模型位置，在长方体空间上上随机分布
  const x = 1000 * (Math.random() - 0.5);
  const y = 600 * Math.random();
  const z = 1000 * (Math.random() - 0.5);
  ydsprite.position.set(x, y, z)
}
scene.add(group)
const clock = new THREE.Clock();
function loop() {
  // loop()两次执行时间间隔
  const t = clock.getDelta();
  group.children.forEach(sprite => {
    // 雨滴的y坐标每次减t*60
    sprite.position.y -= t * 60;
    if (sprite.position.y < 0) {
      sprite.position.y = 600;
    }
  });
  requestAnimationFrame(loop);
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

<style scoped></style>