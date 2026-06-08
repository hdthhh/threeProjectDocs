---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirtyFile.vue'
// import exampleSource from '../docs/components/thirtyFile.vue?raw'


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
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 1, 0)
// scene.add(cube)
const group = new THREE.Group()
const textureLoader = new THREE.TextureLoader()
// 创建精灵材质对象SpriteMaterial
const spriteMaterial = new THREE.SpriteMaterial({
  // color: 0x699fab,// 设置颜色 黑色完全不显示，白色完全显示 有点像蒙版
  map: textureLoader.load(new URL(`../assets/xh.png`, import.meta.url).href)
});
// 创建精灵模型对象，不需要几何体geometry参数
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(1, 1, 1)
sprite.position.set(0, 1, 2)
group.position.set(0, 0, 0)
group.add(sprite)
scene.add(group)

const dm = new THREE.Mesh(new THREE.BoxGeometry(1000, 1, 1000), new THREE.MeshBasicMaterial({ color: '#f9bb81' }))
dm.position.set(0, -1, 0)
dm.castShadow = true
dm.receiveShadow = true
scene.add(dm)


const ambLight = new THREE.AmbientLight(0xffffff, 0.6)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7)

dirLight.position.set(20, 20, 20)
dirLight.target.position.set(0, 0, 0)
dirLight.shadow.mapSize.set(1024, 1024)
dirLight.shadow.radius = 7
dirLight.shadow.blurSamples = 20
dirLight.shadow.camera.top = 30
dirLight.shadow.camera.bottom = -30
dirLight.shadow.camera.left = -30
dirLight.shadow.camera.right = 30
dirLight.castShadow = true

scene.add(ambLight, dirLight)


const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
loader.setDRACOLoader(dracoLoader);
loader.load('racing_car/scene.gltf', gltf => {
  console.log(gltf);
  gltf.scene.position.set(0, 0, 0)
  gltf.scene.scale.set(0.02, 0.02, 0.02)
  gltf.scene.rotateY(THREE.MathUtils.degToRad(180))
  group.add(gltf.scene);
  box3 = new THREE.Box3().setFromObject(group.children[1])
  boxHelper = new THREE.Box3Helper(box3, 0x00ff00);
  scene.add(box3, boxHelper)
})

let treelist = []
loader.load('coconut_tree/scene.gltf', gltf => {
  // console.log(gltf);
  for (let i = 0; i < 10; i++) {
    const clone = gltf.scene.clone()
    clone.position.set(getpos(), 0, getpos())
    // treelist.push(new OBB(gltf.scene.position))
    // new THREE.Box3Helper(box, 0xffff00)
    treelist.push(clone)
    scene.add(clone);

    const box = new THREE.Box3();
    box.setFromObject(clone);
    const boxHelper = new THREE.Box3Helper(box, 0x0000ff);
    scene.add(boxHelper);
  }
})
function getpos() {
  let a = (Math.random() * 100).toFixed(0) - 50
  return a < 10 && a > -10 ? getpos() : a
}


const fog = new THREE.FogExp2('#ff9043', 0.03)
scene.fog = fog
scene.background = new THREE.Color('#ff9043')


const key = reactive({
  w: false, s: false, a: false, d: false,
})
let vehicleSpeed = 0.1, deg = 0.5, box3, boxHelper
const vehicleRotation = new THREE.Euler(0, 0, 0, 'YXZ');
function move() {
  let box = group
  let ver = new 
// ... more code ...
</script>

```


