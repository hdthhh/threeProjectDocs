---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtytwoFile.vue'
// import exampleSource from '../docs/components/thirtytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import f from 'three/examples/fonts/helvetiker_regular.typeface.json'

onMounted(() => {
  setInterval(() => {
    move()
  }, 100);
})


const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 100)
pointLight.position.set(0, 23, 0)
// scene.add(pointLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
directionalLight.position.set(-100, 20, 0)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 10)
directionalLight2.position.set(100, 20, 0)
scene.add(directionalLight, directionalLight2)


const textureLoader = new THREE.TextureLoader()


const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: textureLoader.load(new URL(`/components/assets/xd.jpg`, import.meta.url).href),
  // side: THREE.FrontSide
}))
dm.position.set(0, -1, 0)

// dm.receiveShadow = true;
scene.add(dm)


// let bg = textureLoader.load('/components/assets/bw.jpg')
// bg.mapping = THREE.EquirectangularReflectionMapping;// 球形映射，必填，跟随视角旋转
// scene.background = 0xffffff
// scene.environment = 0xffffff
scene.background = { color: 0xffffff }


const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);
// christmas_tree   2.5k_followers_christmas_special
loader.load('/threeProjectDocs/2.5k_followers_christmas_special/scene.gltf', (gltf) => {
  console.log(gltf)
  gltf.scene.scale.set(30, 30, 30)
  scene.add(gltf.scene)
})
loader.load('/threeProjectDocs/snowman/scene.gltf', (gltf) => {
  gltf.scene.scale.set(5, 5, 5)
  gltf.scene.position.set(25, 3, 0)
  gltf.scene.rotation.y = THREE.MathUtils.degToRad(90)
  scene.add(gltf.scene)
})
loader.load('/threeProjectDocs/santa_claus/scene.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.position.set(-25, 10, 0)
  // gltf.scene.rotation.y = THREE.MathUtils.degToRad(90)
  scene.add(gltf.scene)
})


const group = new THREE.Group()
let map = textureLoader.load(new URL(`/components/assets/xh.png`, import.meta.url).href)
for (let i = 0; i < 200; i++) {
  // 创建精灵材质对象SpriteMaterial
  const spriteMaterial = new THREE.SpriteMaterial({
    // color: 0x699fab,// 设置颜色 黑色完全不显示，白色完全显示 有点像蒙版
    map: map
  });
  // 创建精灵模型对象，不需要几何体geometry参数
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(1, 1, 1)
  sprite.position.set((Math.random() * 100).toFixed(0) - 50, (Math.random() * 100).toFixed(0) - 0, (Math.random() * 100).toFixed(0) - 50)
  group.add(sprite)
}
scene.add(group)

function move() {
  group.children.map(item => {
    if (item.position.y < 1) {
      item.position.set((Math.random() * 100).toFixed(0) - 50, (Math.random() * 100).toFixed(0) - 0, (Math.random() * 100).toFixed(0) - 50)
    } else {
      item.position.y -= 1
      item.position[Math.random() > 0.5 ? 'x' : 'z'] += (Math.random() > 0.5 ? 1 : -1)
    }
  })
}

// const fontloader = new FontLoader()
// console.log(fontloader.parse(f));

// const text = new TextGeometry('merry christmas!', {
//   font: fontloader.parse(f),
//   size: 5,
//   depth: 5,
// })
// const textmesh = new THREE.Mesh(text, new THREE.MeshBasicMaterial({ color: 'green' }))
// textmesh.position.set(0, 50, 0)
// scene.add(textmesh)

const mc = new THREE.Sprite(new THREE.SpriteMaterial({ map: textureLoader.load(new URL(`/components/assets/mc.png`, import.meta.url).href) }));
mc.position.set(0, 70, 0)
mc.scale.set(80, 80, 80)
scene.add(mc)

</script>

```

