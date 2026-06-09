---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortysixFile.vue'
// import exampleSource from '../docs/components/fortysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js'
// 不存在？？162版本被GroundedSkybox取代
// import { GroundProjectedSkybox } from 'three/addons/jsm/objects/GroundProjectedSkybox.js'

function animate() {
  if (quan) {
    quan.rotation.x = Math.sin(clock.getElapsedTime()) * 2

    cubeCamera.update(render,scene)
  }
  
}
const geometry = new THREE.TorusKnotGeometry(2,0.9,300,62)
const material = new THREE.MeshStandardMaterial({
  color: '#aaaaaa',
  // wireframe: true,
  roughness: 0,
  metalness:1
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 4, 0)
scene.add(cube)

loader.load('/threeProjectDocs/FlightHelmet/FlightHelmet.gltf', (gltf) => {
  scene.add(gltf.scene)
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.set(10,0,0)
})


// scene.backgroundBlurriness = 0 // 背景模糊程度，0-1
// scene.backgroundIntensity=1 // 背景强度，默认1


// 立方体贴图
// const cubeTextureLoader=new THREE.CubeTextureLoader()
// const bg=cubeTextureLoader.load([
//   '/threeProjectDocs/metro_noord_4k/px.png',
//   '/threeProjectDocs/metro_noord_4k/nx.png',
//   '/threeProjectDocs/metro_noord_4k/py.png',
//   '/threeProjectDocs/metro_noord_4k/ny.png',
//   '/threeProjectDocs/metro_noord_4k/pz.png',
//   '/threeProjectDocs/metro_noord_4k/nz.png',
// ])
// scene.background = bg
// scene.environment = bg


// HDR贴图,光照方面，色彩方面更强
// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('/threeProjectDocs/metro_noord_4k.hdr', (emv) => {
//   emv.mapping=THREE.EquirectangularReflectionMapping
//   scene.background = emv
//   scene.environment = emv
// })


// ldr贴图，低色彩
// const map=textureLoader.load('/threeProjectDocs/bg.jpg')
// map.mapping = THREE.EquirectangularReflectionMapping
// map.colorSpace = THREE.SRGBColorSpace
// scene.background = map
// scene.environment = map


// 天空盒
// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('/threeProjectDocs/fireplace_4k.hdr', (emv) => {
//   emv.mapping=THREE.EquirectangularReflectionMapping
//   // scene.background = emv
//   scene.environment = emv

//   // 天空盒
//   // 对于需要地面与天空自然过渡的场景，GroundedSkybox实现基于环境贴图的地面投影效果。
//   const skybox = new GroundedSkybox(emv, 10)
//   skybox.scale.setScalar(50)
//   // skybox.scale(50,50, -50);
//   // skybox.position.set(0,100,0)
//   skybox.position.set(0, 9, 0) //比高低一点
//   scene.add(skybox)
// })



const map=textureLoader.load('/threeProjectDocs/bg.jpg')
map.mapping = THREE.EquirectangularReflectionMapping
map.colorSpace = THREE.SRGBColorSpace
scene.background = map

const quan = new THREE.Mesh(
  new THREE.TorusGeometry(18,0.8),
  new THREE.MeshBasicMaterial({
    color:'white'
  })
)
scene.add(quan)
quan.layers.enable(1)

const webGLCubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  // 分辨率，选择低的，因为有六个面，乘6会变很大
  256,
  // 半浮点型，性能更好
  { type: THREE.HalfFloatType }
)
scene.environment = webGLCubeRenderTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 100, webGLCubeRenderTarget)

// 谨慎使用图层，图层默认是0
// 当我写图层时，只看到1图层的物体
cubeCamera.layers.set(1) 
</script>

```

