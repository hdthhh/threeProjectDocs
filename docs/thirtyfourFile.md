---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyfourFile.vue'
// import exampleSource from '../docs/components/thirtyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { Water } from "three/examples/jsm/objects/Water.js";
    
// 右 左 上 下 前 后  如不够，颜色透明，无颜色
// const redmaterial = new THREE.MeshBasicMaterial({ color: 'red' })
// const yellowmaterial = new THREE.MeshBasicMaterial({ color: 'yellow' })
// const greenmaterial = new THREE.MeshBasicMaterial({ color: 'green' })
// const bluematerial = new THREE.MeshBasicMaterial({ color: 'blue' })
// const purplematerial = new THREE.MeshBasicMaterial({ color: 'purple' })
// const graymaterial = new THREE.MeshBasicMaterial({ color: 'gray' })

// const geometry = new THREE.BoxGeometry(10, 10, 10)
// const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 'red' }))
// cube.position.set(0, 0, 0)
// scene.add(cube)
    
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
const directionalLight = new THREE.DirectionalLight(0XFFFFFF, 0.9)
scene.add(ambientLight, directionalLight)
scene.background = new THREE.Color(0xd8dfe4)

const bl = new THREE.MeshPhysicalMaterial({
  metalness: 0.0,//玻璃非金属  金属度设置0
  roughness: 0.0,//玻璃表面光滑  
  envMapIntensity: 1.0,
  transmission: 1.0,//透射度(透光率)
  ior: 1.5,//折射率 1.0到2.333
  // env: textureLoader.load('./bg.jpeg')
  // color: new THREE.Color().lerpColors('green', 'red', 0.5)
  // transparent: true
})
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff, // 白色玻璃
  transparent: true,
  opacity: 0.1, // 透明度，接近1但不完全为1以模拟玻璃的微微半透明效果
  refractionRatio: 0.95, // 折射比，模拟玻璃的折射效果
  side: THREE.DoubleSide,
});
const cube = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 10, 64), [glassMaterial, null, glassMaterial])
scene.add(cube)


// 创建水的材质
const waterMaterial = new THREE.MeshStandardMaterial({
  color: 0x5eafe8, // 青色代表水
  transparent: true,
  opacity: 0.5, // 透明度
  refractionRatio: 0.98, // 模拟水的折射效果
  // alphaMap: textureLoader.load('./black.jpg') // 没效果？？？
});
const water = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 6, 64), waterMaterial);
water.position.y = -2; // 调整位置以匹配杯内的水位
// scene.add(water);
const water1 = new Water(new THREE.CylinderGeometry(3.8, 3.8, 6, 64), {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: textureLoader.load(
    "/threeProjectDocs/waternormals.jpg",
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  waterColor: 0x52acdc,
  alpha: 0.5, // 透明
});
water1.position.y = -2
water1.material.transparent = true // 透明，如果要使用opacity，要开透明

scene.add(water1);
console.log(water1)

scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 'red' }),))


</script>

```

