---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/seventeenFile.vue'
// import exampleSource from '../docs/components/seventeenFile.vue?raw'


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
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
const geometry = new THREE.BoxGeometry(10, 10, 10)
const chromeMaterial = new THREE.MeshLambertMaterial({ color: 'red', envMap: cubeRenderTarget.texture });
const cube = new THREE.Mesh(geometry, chromeMaterial)
cube.position.set(0, 0, 0)
scene.add(cube)

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: 'green' }))
cube1.position.set(20, 0, 0)
cube1.castShadow = true;
scene.add(cube1)

const cubeCamera = new THREE.CubeCamera(0.1, 30, cubeRenderTarget)
scene.add(cubeCamera)

//更新渲染目标立方体
cube.visible = false;
cubeCamera.position.copy(cube.position);
cubeCamera.update(render, scene);

//绘制场景
cube.visible = true;
render.render(scene, camera);

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// const light1 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1000);
// scene.add(light1);

// const light2 = new THREE.PointLight(0xffffff, 1);
// light2.position.set(0, 50, 0);
// scene.add(light2);

const light3 = new THREE.SpotLight(0xffff00, 10)
light3.position.set(-5, 10, 0); // 设置聚光灯位置
light3.castShadow = true; // 设置聚光灯投射阴影
// light3.intensity = 2; // 设置聚光灯强度

// 设置阴影贴图模糊度
// light3.shadow.radius = 20;
// // 设置阴影贴图的分辨率
// light3.shadow.mapSize.set(512, 512);

// console.log(directionalLight.shadow);
light3.target = cube1; // 设置聚光灯的目标为立方体 会自动对准目标
// light3.angle = Math.PI / 6; // 设置聚光灯的角度
// light3.distance = 0; // 设置聚光灯的距离
// light3.penumbra = 0; // 设置聚光灯的边缘
light3.decay = 0; // 设置聚光灯的衰减
scene.add(light3);
const spotLightHelper = new THREE.SpotLightHelper(light3);
scene.add(spotLightHelper);

// // 创建平面
const planeGeometry = new THREE.PlaneGeometry(100, 100);
// 创建标准材质
const materialplane = new THREE.MeshStandardMaterial({ color: 'gray' });
const plane = new THREE.Mesh(planeGeometry, materialplane);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 接收阴影
plane.receiveShadow = true;
scene.add(plane);


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


