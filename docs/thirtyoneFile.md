---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyoneFile.vue'
// import exampleSource from '../docs/components/thirtyoneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const textureLoader = new THREE.TextureLoader()
const geometry = new THREE.SphereGeometry(5)
const material = new THREE.MeshMatcapMaterial({
  color: '#e5e9a3',
  // wireframe: true,
  // matcap: textureLoader.load('/components/assets/blcz.png')// ??? mei chu xian
  matcap: textureLoader.load((new URL(`/components/assets/blcz.png`, import.meta.url).href))
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 5, 0)
scene.add(cube)


// const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({ color: '#2f2f2f' }))
// dm.position.set(0, -1, 0)
// dm.castShadow = true
// dm.receiveShadow = true
// scene.add(dm)


const pointLight = new THREE.PointLight('white', 10)
pointLight.position.set(0, 10, 10)
pointLight.target = cube
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);

const LambertMaterial = new THREE.MeshLambertMaterial()
const lamber = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), LambertMaterial)
lamber.position.set(-7, 3, 0)
scene.add(lamber)


textureLoader.load('./bg.jpeg', bg => {
  bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
  scene.background = bg
  scene.environment = bg
})


const box = new THREE.Mesh(new THREE.SphereGeometry(5), new THREE.MeshPhysicalMaterial({
  // transparent: true,
  color: 'white',
  transmission: 1,
  thickness: 0.1,
  roughness: 0.05,
  // attenuationColor: new THREE.Color(0.6, 0, 0),
  // attenuationDistance: 1,
  // 设置彩虹色，反射率和彩虹色折射率
  iridescence: 1,
  reflectivity: 1,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
}))
box.position.set(10, 5, 0)
scene.add(box)

</script>

```

