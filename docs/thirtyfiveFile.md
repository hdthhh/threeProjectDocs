---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyfiveFile.vue'
// import exampleSource from '../docs/components/thirtyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
    
function animate() {
  // 让水流动
  water.material.uniforms["time"].value += 1.0 / 60;
}
    
const water = new Water(new THREE.PlaneGeometry(10000, 10000), {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load(
    "/threeProjectDocs/waternormals.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  waterColor: 0x0072ff,
});
water.rotation.x = -Math.PI / 2;
scene.add(water)


const sun = new THREE.Vector3(-80, 5, -100);
water.material.uniforms["sunDirection"].value.copy(sun).normalize();
// 加了太阳之后，水面显示会有点泛白，是因为太阳的位置的向量长度太长
// 归一化 将向量的xyz等比例缩放，将整个向量的长度缩放到长度为1  调用一下normalize函数就可以将向量设置成单位向量

const sky = new Sky();
sky.scale.setScalar(10000);

sky.material.uniforms["sunPosition"].value.copy(sun);
sky.material.uniforms["turbidity"].value = 1;
sky.material.uniforms["rayleigh"].value = 1.5;
sky.material.uniforms["mieCoefficient"].value = 0.005;
sky.material.uniforms["mieDirectionalG"].value = 0.8;

scene.add(sky);
    
    
  const folderSun = gui.addFolder("太阳位置");
  folderSun
    .add(sun, "x", -100, 100)
    .onChange(updateSunPosition);
  folderSun
    .add(sun, "y", -100, 100)
    .onChange(updateSunPosition);
  folderSun
    .add(sun, "z", -100, 100)
    .onChange(updateSunPosition);
  // 更新太阳的位置
  function updateSunPosition() {
    water.material.uniforms["sunDirection"].value
      .copy(sun)
      .normalize();
    sky.material.uniforms["sunPosition"].value.copy(sun);
  }

  let waterParams = {
    speed: 1.0,
    alpha: 1.0,
    distortionScale: 20,
  };
  const folderWater = gui.addFolder("海水");
  folderWater.add(waterParams, "alpha", 0, 1)
    .onChange((value) => {
      water.material.uniforms["alpha"].value = value;
    });
  folderWater
    .add(waterParams, "distortionScale", 0, 240, 0.1)
    .name("扭曲比例")
    .onChange((value) => {
      water.material.uniforms["distortionScale"].value = value;
    });

  const folderSky = gui.addFolder("天空");
  let skyParams = {
    turbidity: 1,
    rayleigh: 1.5,
  };
  folderSky
    .add(skyParams, "turbidity", 0, 100)
    .name("浑浊度")
    .onChange((value) => {
      sky.material.uniforms["turbidity"].value = value;
    });
  folderSky
    .add(skyParams, "rayleigh", 0, 100)
    .name("锐利值")
    .onChange((value) => {
      sky.material.uniforms["rayleigh"].value = value;
    });
</script>

```

