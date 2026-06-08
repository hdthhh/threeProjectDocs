---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftysevenFile.vue'
// import exampleSource from '../docs/components/fiftysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
uniforms: {
    usunDirection: { value: new THREE.Vector3(0, 0, 1) },
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
  }
})
const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)


const sun = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

const debugSun = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 2), new THREE.MeshBasicMaterial())
scene.add(debugSun)

const updateSun = () => {
  sunDirection.setFromSpherical(sun)
  debugSun.position.copy(sunDirection).multiplyScalar(5)
  // 位置乘5，离的更远
  if (material) material.uniforms.usunDirection.value.copy(sunDirection)
  if (atmosphereMaterial) atmosphereMaterial.uniforms.usunDirection.value.copy(sunDirection)
}
updateSun()

gui.add(sun, "phi").min(0).max(Math.PI).onChange(updateSun);
gui.add(sun, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);
</script>

```


