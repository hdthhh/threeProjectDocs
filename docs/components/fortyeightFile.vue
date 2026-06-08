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
import vertex from '../components/assets/glsl/vertex.glsl'
import fragment from '../components/assets/glsl/fragment.glsl'
// 引入的glsl文件需要插件进行解析，vite-plugin-glsl 或者 vite-plugin-glslify

const ddd = ref(null)
const a = ref(null)

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

// 渲染元素，启用动画
let resizefn = null
let gui
// 渲染元素，启用动画
onMounted(() => {
  gui = new GUI({ container: a.value })
  ddd.value.appendChild(render.domElement)
  animate();

  gui.add(material.uniforms.my1, 'value').min(0).max(100).step(0.01)
  gui.add(material.uniforms.my2.value, 'x').min(0).max(100).step(0.01)

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

const clock = new THREE.Clock()

function animate() {
  material.uniforms.utime.value=clock.getElapsedTime()

  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


const textureLoader = new THREE.TextureLoader()

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);



const geometry = new THREE.PlaneGeometry(5, 5, 32, 32)
// ShaderMaterial,着色器材质,不需要写矩阵，属性这些
// RawShaderMaterial,原始着色器材质
const material = new THREE.RawShaderMaterial({
  // 着色器可以引入glsl文件，或者写反义字符串``
  vertexShader: vertex,// 顶点着色器
  fragmentShader: fragment,// 片段着色器
  transparent: true,// 只有开启这个才能给颜色透明度，rgba的a
  // 自定义统一值
  uniforms: {
    my1: { value: 10 },
    my2: { value: new THREE.Vector2(10.0, 5.0) },
    utime: { value: 0.0 },
    ucolor: { value: new THREE.Color('green') },
    mytexture: { value: textureLoader.load('/threeProjectDocs/200115103917-1.jpg')}
  }
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(5, 5, 5)
scene.add(cube)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)
for (let i = 0; i < count; i++) {
  randoms[i]=Math.random()
}
// 在物体上添加一段属性，一段随机数，在着色器上使用
geometry.setAttribute('aMyrandom', new THREE.BufferAttribute(randoms, 1))

// const gui = new GUI()

</script>

<style scoped>
#aaa {
  position: absolute;
  top: 0;
  right: 0;
}
</style>