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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OBB } from 'three/examples/jsm/math/OBB.js'
    
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
  map: textureLoader.load(new URL(`/components/assets/xh.png`, import.meta.url).href)
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
dracoLoader.setDecoderPath('/threeProjectDocs/draco/');
loader.setDRACOLoader(dracoLoader);
loader.load('/threeProjectDocs/racing_car/scene.gltf', gltf => {
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
loader.load('/threeProjectDocs/coconut_tree/scene.gltf', gltf => {
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
  let ver = new THREE.Vector3()
  ver.copy(box.position)
  if (key.w || key.s) {
    // cube.position.x -= ((key.a ? vehicleSpeed : 0))
    // cube.position.x += ((key.d ? vehicleSpeed : 0))
    // box.position.z -= ((key.w ? vehicleSpeed : 0))
    // box.position.z += ((key.s ? vehicleSpeed : 0))
    // - (key.a ? vehicleSpeed : 0)   - (key.s ? vehicleSpeed : 0)

    // key.a && cube.rotateY(THREE.MathUtils.degToRad(-deg))
    // key.d && cube.rotateY(THREE.MathUtils.degToRad(deg))
    key.a && (vehicleRotation.y += Math.PI / 180 * 1)
    key.d && (vehicleRotation.y -= Math.PI / 180 * 1)

    const quaternion = new THREE.Quaternion().setFromEuler(vehicleRotation);
    const forwardVector = new THREE.Vector3(0, 0, key.w ? 1 : (key.s ? -1 : 0)).applyQuaternion(quaternion);//将Quaternion变换应用到该向量
    // 更新车辆位置，更新车辆旋转角度
    ver.addScaledVector(forwardVector, vehicleSpeed);//将所传入的v与s相乘所得的乘积和这个向量相加
    // let old = new THREE.Vector3().copy(obb.center)
    // 碰撞检测
    // obb.center = ver

    // let one = treelist.find(item => obb.intersectsOBB(item))
    // console.log(one)

    scene.remove(box3, boxHelper)
    box3 = new THREE.Box3().setFromObject(box.children[1])
    boxHelper = new THREE.Box3Helper(box3, 0x00ff00);
    scene.add(box3, boxHelper)

    let one = treelist.find(item => box3.intersectsBox(new THREE.Box3().setFromObject(item)))
    if (one) {
      console.log('碰撞')
      // obb.center = old
      box.position.x = qqq(box.position.x, ver.x)
      box.position.z = qqq(box.position.z, ver.z)
    } else {
      box.position.copy(ver)
      box.quaternion.copy(quaternion);
      // console.log(forwardVector)
      camera.position.set(box.position.x + 10, box.position.y + 10, box.position.z + 10)
      OrbitControl.target.set(box.position.x, box.position.y, box.position.z)
    }
  }
}
// const obb = new OBB(group.position)

window.addEventListener('keydown', e => {
  if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
    // cube.translateX(1)
    // cube.rotateY(THREE.MathUtils.degToRad(1))
    key.a = true
  } else if (e.code == 'ArrowRight' || e.code == 'KeyD') {
    // cube.translateX(-1)
    // cube.rotateY(THREE.MathUtils.degToRad(-1))
    key.d = true
  } else if (e.code == 'ArrowUp' || e.code == 'KeyW') {
    // cube.translateZ(1)
    key.w = true
  } else if (e.code == 'ArrowDown' || e.code == 'KeyS') {
    // cube.translateZ(-1)
    key.s = true
  }
})
window.addEventListener('keyup', e => {
  if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
    // cube.translateX(1)
    // cube.rotateY(THREE.MathUtils.degToRad(1))
    key.a = false
  } else if (e.code == 'ArrowRight' || e.code == 'KeyD') {
    // cube.translateX(-1)
    // cube.rotateY(THREE.MathUtils.degToRad(-1))
    key.d = false
  } else if (e.code == 'ArrowUp' || e.code == 'KeyW') {
    // cube.translateZ(1)
    key.w = false
  } else if (e.code == 'ArrowDown' || e.code == 'KeyS') {
    // cube.translateZ(-1)
    key.s = false
  }
})

function qqq(x, y) {
  if (x > y) {
    return x + vehicleSpeed * 2
  } else if (x < y) {
    return x - vehicleSpeed * 2
  } else if (x == y) {
    return x
  }
}
</script>

```

