---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortysevenFile.vue'
// import exampleSource from '../docs/components/fortysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const geometry = new THREE.SphereGeometry(4, 72, 32)
const material = new THREE.MeshStandardMaterial({
  color: 'white',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const directionalLight = new THREE.DirectionalLight('white', 5)
directionalLight.position.set(15, 5, -3)
scene.add(directionalLight)

directionalLight.castShadow = true
directionalLight.shadow.camera.far = 20
directionalLight.shadow.mapSize.set(1024, 1024)

// 当圆形光滑的平面在映射光线和阴影时，表面的像素点会产生阴影在物体上，会有锯齿感，网状感，把阴影范围往内缩进再形成阴影，就不会生成了
// directionalLight.shadow.normalBias=0.01

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

loader.load('/threeProjectDocs/FlightHelmet/FlightHelmet.gltf', (gltf) => {
  scene.add(gltf.scene)
  gltf.scene.scale.set(10, 10, 10)
  gltf.scene.position.set(10, 0, 0)

  updateAllMaterial()
  // downgradeForIntelGPU()
})
function updateAllMaterial() {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = bg  //可以用scene environment代替，就不用一个一个遍历写envmap了
      // 强度
      // child.material.envMapIntensity=5
      child.material.needsUpdate=true
      child.castShadow = true
      child.receiveShadow=true
    }
  })
}
function downgradeForIntelGPU(root) {
  root.traverse(obj => {
    if (!obj.isMesh || !obj.material) return

    const mats = Array.isArray(obj.material)
      ? obj.material
      : [obj.material]

    mats.forEach(mat => {
      mat.transmission = 0
      mat.clearcoat = 0
      mat.sheen = 0
      mat.iridescence = 0
      mat.thickness = 0

      mat.metalness = Math.min(mat.metalness ?? 0, 0.5)
      mat.roughness = Math.max(mat.roughness ?? 0.4, 0.4)

      if (mat.transparent) {
        mat.opacity = Math.min(mat.opacity ?? 1, 0.6)
        mat.depthWrite = false
      }

      mat.envMapIntensity = 0.5
      mat.needsUpdate = true
    })
  })
}

const cubeTextureLoader=new THREE.CubeTextureLoader()
const bg=cubeTextureLoader.load([
  '/threeProjectDocs/metro_noord_4k/px.png',
  '/threeProjectDocs/metro_noord_4k/nx.png',
  '/threeProjectDocs/metro_noord_4k/py.png',
  '/threeProjectDocs/metro_noord_4k/ny.png',
  '/threeProjectDocs/metro_noord_4k/pz.png',
  '/threeProjectDocs/metro_noord_4k/nz.png',
])
scene.background = bg
scene.environment = bg
    
  gui.add(render, 'toneMapping', {
    no: THREE.NoToneMapping,
    linear: THREE.LinearToneMapping,
    cineon: THREE.CineonToneMapping,
    reinhard: THREE.ReinhardToneMapping,
    acesf: THREE.ACESFilmicToneMapping
  })
  gui.add(render, 'toneMappingExposure').min(0).max(100)
</script>

```

