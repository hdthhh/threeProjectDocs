---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtysevenFile.vue'
// import exampleSource from '../docs/components/thirtysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(new THREE.SphereGeometry(1), material)
cube.position.set(0, 1, 0)
cube.castShadow = true
scene.add(cube)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 30, 30), material)
plane.position.set(0, 0, 0)
plane.rotateX(-(Math.PI / 2))
plane.receiveShadow = true
scene.add(plane)

// scene.add(new THREE.AmbientLight(0xffffff, 0.9))

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1)
directionalLight.position.set(0, 10, 10)
directionalLight.castShadow = true
scene.add(directionalLight)

directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.near = 0.1

directionalLight.shadow.camera.left = 2
directionalLight.shadow.camera.right = -2
directionalLight.shadow.camera.top = 4
directionalLight.shadow.camera.bottom = -2
// directionalLight.shadow.radius = 10 // 模糊度

// directionalLight.shadow.mapSize.width = 512  // default 512
// directionalLight.shadow.mapSize.height = 512  // default 512

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalLightHelper)

const directionalCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalCameraHelper)

// color -（可选）一个表示颜色的 Color 的实例、字符串或数字，默认为一个白色（0xffffff）的 Color 对象。
// intensity -（可选）光照强度。默认值为 1。
// distance - 光源照射的最大距离。默认值为 0（无限远）。
// angle - 光线照射范围的角度。默认值为 Math.PI / 3。
// penumbra - 聚光锥的半影衰减百分比。默认值为 0。
// decay - 沿着光照距离的衰减量。默认值为 2。
const spotLight = new THREE.SpotLight(0xFFFFFF, 50)
spotLight.position.set(-7, 10, 10)
spotLight.castShadow = true
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.shadow.camera.far = 20
spotLight.shadow.camera.near = 5
spotLight.shadow.camera.fov = 40
spotLight.shadow.mapSize.width = 512 * 2
spotLight.shadow.mapSize.height = 512 * 2

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
const spotCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotCameraHelper)


const pointLight = new THREE.PointLight(0xffffff, 50)
pointLight.position.set(7, 10, 10)
pointLight.castShadow = true
scene.add(pointLight)

pointLight.shadow.camera.far = 20
pointLight.shadow.camera.near = 5
pointLight.shadow.mapSize.width = 512 * 2
pointLight.shadow.mapSize.height = 512 * 2

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)
const pointCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointCameraHelper)
</script>

```

