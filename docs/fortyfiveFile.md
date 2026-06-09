---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyfiveFile.vue'
// import exampleSource from '../docs/components/fortyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import * as CANNON from 'cannon-es'
    
const ambientLight = new THREE.AmbientLight('#fff', 0.7)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#fff', 0.7)
directionalLight.position.set(0,30,0)
scene.add(directionalLight)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

scene.background =new THREE.Color('#0d6192')

const dm = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({ color: '#378e17' }))
dm.position.set(0,0,0)
dm.rotateX(-Math.PI/2)
dm.receiveShadow = true
scene.add(dm)


loader.load('/threeProjectDocs/racing_car/scene.gltf', data => {
  console.log(data)
  console.log(data.scene)
  data.scene.position.set(0,5,0)
  data.scene.scale.set(0.05,0.05,0.05)
  data.scene.traverse((child) => {
    console.log(child)
    if (child.isMesh && child.material.normalMap) {
      // 保持纹理属性一致
      // newTexture.colorSpace = child.material.normalMap.colorSpace;
      // newTexture.flipY = child.material.normalMap.flipY;

      // console.log('racing_car/' + child.material.normalMap.name)
      // 替换贴图
      // child.material.normalMap = textureLoader.load('racing_car/' + child.material.normalMap.name);
      // child.material.emissiveMap = textureLoader.load('racing_car/' + child.material.emissiveMap.name);
      // child.material.needsUpdate = true;

    }
  });
  scene.add(data.scene)
  // const body = new CANNON.Body({
  //   shape:new CANNON.Box()
  // })
})

const world = new CANNON.World({ gravity:new CANNON.Vec3(0, -9.82, 0)})

const cube = new CANNON.Plane()
const cubebody = new CANNON.Body({
  shape:cube
})
cubebody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(1,0,0),
  -Math.PI/2
)
world.addBody(cubebody)

</script>

```

