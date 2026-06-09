---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtysevenFile.vue'
// import exampleSource from '../docs/components/sixtysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div :class="classnames" :style="radio"></div>
</template>

<script setup>
import gsap from 'gsap'
    
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

const radio = ref({ transform: `scalex(0)` })
const classnames=ref('loading')
const loadingManager = new THREE.LoadingManager(() => {
  // 等待0.5秒，因为变化的动画是有等待0.5秒之后才运行的，这样最后一步从0.9到1.0的时候，就不会跳过这一步的动画了
  gsap.delayedCall(0.5, () => {
    gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
    radio.value = {}
    classnames.value += ' loaded'
  })
}, (url,currect,total) => {
  radio.value= { transform: `scalex(${currect / total})` }
})


const debugObject = {}
debugObject.envMapIntensity = 2.5

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

const environmentMap = cubeTextureLoader.load([
  '/threeProjectDocs/environmentMaps/0/px.jpg',
  '/threeProjectDocs/environmentMaps/0/nx.jpg',
  '/threeProjectDocs/environmentMaps/0/py.jpg',
  '/threeProjectDocs/environmentMaps/0/ny.jpg',
  '/threeProjectDocs/environmentMaps/0/pz.jpg',
  '/threeProjectDocs/environmentMaps/0/nz.jpg'
])

environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

loader.load( '/threeProjectDocs/FlightHelmet/FlightHelmet.gltf',  (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, - 4, 0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
  }
)

const overlayGeometry = new THREE.PlaneGeometry(2,2,1,1)
const overlayMaterial = new THREE.ShaderMaterial({
  vertexShader: `
  void main(){
    gl_Position =  vec4(position,1.0);
  }`,
  fragmentShader: `
  uniform float uAlpha;
  void main(){
    gl_FragColor=vec4(0.0,0.0,0.0,uAlpha);
  }`,
  uniforms: {
    uAlpha:{value:1.0}
  },
  transparent:true,
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)
</script>

<style scoped>
.loading{
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  background-color: #fff;
  transform: scaleX(0.0);
  transform-origin: top left;
  transition: transform 0.5s;
  will-change: transform;
}
.loaded{
  transform-origin: top right;
  transition: transform 1.5s ease-in-out;
}
</style>

```

