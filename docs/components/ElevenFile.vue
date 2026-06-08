<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted , onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const ddd = ref(null)

// 场景，相机，渲染器，坐标系，控制器
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer({
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)

const axesHelper = new THREE.AxesHelper(100);// 坐标系
// axesHelper.setColors('white')
axesHelper.up.set(0, 0, 1)

scene.add(axesHelper)

const gridhelper = new THREE.GridHelper(100, 100); // 网格地面
gridhelper.material.opacity = 0.2
gridhelper.material.transparent = true
scene.add(gridhelper)

const OrbitControl = new OrbitControls(camera, render.domElement)
OrbitControl.enableDamping = true // 阻尼
OrbitControl.dampingFactor = 0.01

camera.position.set(10, 10, 10)

// 渲染元素，启用动画
let resizefn = null
let animationId
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
const EARTH_YEAR = (2 * Math.PI) / 365;
function animate() {
  sun.rotation.y += 0.001;

  planetsMap.get('mercury').rotation.y += EARTH_YEAR * 4;
  planetsMap.get('venus').rotation.y += EARTH_YEAR * 2;
  planetsMap.get('earth').rotation.y += EARTH_YEAR;
  planetsMap.get('mars').rotation.y += EARTH_YEAR / 2;
  planetsMap.get('jupiter').rotation.y += EARTH_YEAR / 4;
  planetsMap.get('saturn').rotation.y += EARTH_YEAR / 8;
  planetsMap.get('uranus').rotation.y += EARTH_YEAR / 16;
  planetsMap.get('neptune').rotation.y += EARTH_YEAR / 32;

  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
const pointLight = new THREE.PointLight(0xffffff, 1);

pointLight.position.set(0, 0, 0);

scene.add(ambientLight, pointLight);


const starsCoords = [];

for (let i = 0; i < 10000; i++) {
  const x = THREE.MathUtils.randFloatSpread(1000);
  const y = THREE.MathUtils.randFloatSpread(1000);
  const z = THREE.MathUtils.randFloatSpread(1000);

  starsCoords.push(x, y, z);
}
const starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsCoords, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


class ObjectGroup {
  constructor(index, title, radius, extra) {
    const objectGroup = new THREE.Group();

    if (extra) {
      switch (title) {
        case 'earth':
          extra.position.x += 8 * index + 2.5;

          break;
        case 'saturn':
          extra.position.x += 8 * index;
          extra.rotation.x = 2;

          break;
      }

      objectGroup.add(extra);
    }

    const planet = ObjectGroup.createObject(title, new THREE.SphereGeometry(radius, 64, 32));

    planet.position.x += 8 * index;
    objectGroup.add(planet);

    return objectGroup;
  }

  static createObject = (title, objectGeometry) => {
    const objectTexture = new THREE.TextureLoader().load(new URL(`/components/assets/planet/${title}.jpg`, import.meta.url).href);
    const objectMaterial = new THREE.MeshPhongMaterial({ map: objectTexture });
    const objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

    return objectMesh;
  };
}

const sun = ObjectGroup.createObject('sun', new THREE.SphereGeometry(11, 64, 32));
scene.add(sun);


const planets = [
  { title: 'mercury', radius: 1 },
  { title: 'venus', radius: 2 },
  {
    title: 'earth',
    radius: 2,
    extra: ObjectGroup.createObject('moon', new THREE.SphereGeometry(0.5, 64, 32))
  },
  { title: 'mars', radius: 1 },
  { title: 'jupiter', radius: 5 },
  {
    title: 'saturn',
    radius: 4,
    extra: ObjectGroup.createObject('saturn_rings', new THREE.TorusGeometry(6, 1, 2, 32))
  },
  { title: 'uranus', radius: 3 },
  { title: 'neptune', radius: 3 }
];

const planetsMap = new Map();
for (let [index, { title, radius, extra }] of planets.entries()) {
  const planetGroup = new ObjectGroup(index + 1, title, radius, extra);

  planetsMap.set(title, planetGroup);
  sun.add(planetGroup);
}
</script>

<style scoped></style>