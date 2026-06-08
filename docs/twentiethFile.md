---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentiethFile.vue'
// import exampleSource from '../docs/components/twentiethFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
//////////////////
// 立方体，材质，网格
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshPhysicalMaterial({
  // color: 'white',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(2, 0, 0)
cube.receiveShadow = true; // 接受阴影
cube.castShadow = true; // 产生阴影
cube.rotateZ(THREE.MathUtils.degToRad(20))
scene.add(cube)

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
}))
dm.position.set(0, 0, 0)
dm.receiveShadow = true;
scene.add(dm)

const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 30, 64), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
cylinder.position.set(10, 15, 0)
cylinder.castShadow = true;
cylinder.receiveShadow = true;
scene.add(cylinder);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
sphere.position.set(10, 30, 0)
scene.add(sphere);

const cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10.5, 64), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
cylinder2.position.set(4, 29, 0)
cylinder2.rotateZ(THREE.MathUtils.degToRad(90))
scene.add(cylinder2);

const cone = new THREE.Mesh(new THREE.ConeGeometry(5, 4, 64, 1, true), new THREE.MeshPhysicalMaterial({ color: 'brown' }));
cone.position.set(0, 26.5, 0)
cone.openEnded = true
scene.add(cone);


const light = new THREE.PointLight('white', 1, 30, 0);
light.position.set(0, 26, 0);
light.target = cube
light.castShadow = true;
// light.receiveShadow = false;
light.shadow.mapSize.set(1024, 1024);
scene.add(light);
const lh = new THREE.PointLightHelper(light)
scene.add(lh)

const directionalLight = new THREE.DirectionalLight(0x0000ff, 1);
directionalLight.position.set(0, 15, 0);
directionalLight.target = cube
// scene.add(directionalLight);
const dh = new THREE.DirectionalLightHelper(directionalLight)
// scene.add(dh);

// 线性雾 雾的密度是随着距离线性增大的
// const fog = new THREE.Fog('#aaa', 1, 100)
// 指数雾 相机附近提供清晰的视野，且距离相机越远，雾的浓度随着指数增长越快
const fog = new THREE.FogExp2('#000', 0.01)

scene.fog = fog
scene.background = new THREE.Color('#000')


const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);


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

```


