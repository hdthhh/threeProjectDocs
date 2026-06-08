<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky.js';


const ddd = ref(null)


let scene, camera, renderer, controls;

function init() {
  // 创建场景  
  scene = new THREE.Scene();

  // 创建相机  
  camera = new THREE.PerspectiveCamera(75, ddd.value.offsetWidth/ ddd.value.offsetHeight, 0.1, 1000);
  camera.position.set(0, 50, 100);

  // 创建渲染器  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight);
  ddd.value.appendChild(renderer.domElement);

  // 创建控件  
  controls = new OrbitControls(camera, renderer.domElement);

  // 创建Sky对象并设置属性  
  let sky = new Sky();
  sky.scale.setScalar(45000); // 设置Sky对象的大小，以确保其覆盖整个场景  

  // 设置太阳效果属性  
  let uniforms = sky.material.uniforms;
  // uniforms['turbidity'].value = 10; // 浑浊度  
  // uniforms['rayleigh'].value = 3; // 瑞利散射  
  // uniforms['mieCoefficient'].value = 0.005; // 米氏散射系数  
  // uniforms['mieDirectionalG'].value = 0.7; // 米氏散射方向性  

  // 设置太阳位置  
  const phi = THREE.MathUtils.degToRad(90 - 2); // 太阳高度角转换为弧度  
  const theta = THREE.MathUtils.degToRad(180); // 太阳方位角转换为弧度  
  const sun = new THREE.Vector3();
  sun.setFromSphericalCoords(1, phi, theta); // 根据经纬度设置太阳位置  
  uniforms['sunPosition'].value.copy(sun);

  // 将Sky对象添加到场景中  
  scene.add(sky);

  // 渲染循环  
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

onMounted(() => {
  init();
})


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