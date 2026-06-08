---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftythreeFile.vue'
// import exampleSource from '../docs/components/fiftythreeFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
uniforms['turbidity'].value = effectController.turbidity;
  uniforms['rayleigh'].value = effectController.rayleigh;
  uniforms['mieCoefficient'].value = effectController.mieCoefficient;
  uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms['sunPosition'].value.copy(sun);

  render.toneMappingExposure = effectController.exposure;
  render.render(scene, camera);

}

// const gui = new GUI();

gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
gui.add(effectController, 'elevation', -3, 90, 0.01).onChange(guiChanged);
gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged);
gui.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);

guiChanged();
</script>

```


