---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentyfourFile.vue'
// import exampleSource from '../docs/components/twentyfourFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const land = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 50), new THREE.MeshPhysicalMaterial({ color: '#15192c' }))
land.position.set(0, -1, 0)
land.receiveShadow = true
scene.add(land)

const dm = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 20), new THREE.MeshPhysicalMaterial({ color: '#6e79b4' }))
dm.position.set(10, 0, 10)
dm.receiveShadow = true
// dm.castShadow = true
scene.add(dm)

const left = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 20), new THREE.MeshPhysicalMaterial({ color: '#6e79b4' }))
left.position.set(0, 10, 10)
left.receiveShadow = true
scene.add(left)

const right = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 1), new THREE.MeshPhysicalMaterial({ color: '#6e79b4' }))
right.position.set(10, 10, 0)
right.receiveShadow = true
scene.add(right)

const top1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 20), new THREE.MeshPhysicalMaterial({ color: '#8b90c7' }))
const top2 = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 2), new THREE.MeshPhysicalMaterial({ color: '#8b90c7' }))
top1.position.set(0.5, 20.5, 10)
top2.position.set(10, 20.5, 0.5)
scene.add(top1, top2)

const ambientLight = new THREE.AmbientLight('#383358')
scene.add(ambientLight)

const rectLight = new THREE.RectAreaLight(0xffffff, 1, 14, 18);
rectLight.position.set(0.9, 9, 10);
rectLight.lookAt(0, 9, 10);
scene.add(rectLight)

const tjx1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 20), new THREE.MeshPhysicalMaterial({ color: '#4c82ce' }))
const tjx2 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.5, 0.5), new THREE.MeshPhysicalMaterial({ color: '#4c82ce' }))
tjx1.position.set(0.5, 0.5, 10)
tjx2.position.set(10, 0.5, 0.5)
scene.add(tjx1, tjx2)

const tvwall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 18, 14), new THREE.MeshBasicMaterial({ color: '#090d21' }))
tvwall.position.set(1, 9, 10);
scene.add(tvwall)

const tv = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#8fb3fc') }))
tv.position.set(1.5, 11, 10)
tv.rotateY(THREE.MathUtils.degToRad(90))
scene.add(tv)
// '#8fb3fc''#6b9afb'

const tvtable = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 10), new THREE.MeshBasicMaterial({ color: '#928eb6' }))
tvtable.position.set(2, 5, 10)
scene.add(tvtable)
const thing1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 1.5), new THREE.MeshBasicMaterial({ color: '#aa9fd7' }))
const thing2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 1.5), new THREE.MeshBasicMaterial({ color: '#aa9fd7' }))
thing1.position.set(2.2, 5.7, 12)
thing2.position.set(2.2, 5.7, 8)
thing1.rotateY(THREE.MathUtils.degToRad(20))
thing2.rotateY(THREE.MathUtils.degToRad(-20))
scene.add(thing1, thing2)

const desk = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshPhysicalMaterial({
  color: '#0e1024',
  side: THREE.DoubleSide
}))
desk.position.set(10, 3, 10)
desk.rotateX(THREE.MathUtils.degToRad(-90))
desk.castShadow = true
desk.receiveShadow = true
scene.add(desk)

const book = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7da7fc') }))
book.position.set(12, 3.2, 8)
book.rotateY(THREE.MathUtils.degToRad(-45))
scene.add(book)

const tui1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), new THREE.MeshPhysicalMaterial({ color: 'black' }))
const tui2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), new THREE.MeshPhysicalMaterial({ color: 'black' }))
const tui3 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), new THREE.MeshPhysicalMaterial({ color: 'black' }))
const tui4 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3), new THREE.MeshPhysicalMaterial({ color: 'black' }))
tui1.position.set(6.5, 1.5, 13.5)
tui2.position.set(6.5, 1.5, 6.5)
tui3.position.set(13.5, 1.5, 13.5)
tui4.position.set(13.5, 1.5, 6.5)
scene.add(tui1, tui2, tui3, tui4)

const sfback = new THREE.Mesh(new THREE.BoxGeometry(1, 6, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#0e0f27') }))
sfback.position.set(19.5, 3.5, 10)
scene.add(sfback)
const sfset = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#1f316a') }))
sfset.position.set(17.5, 2, 10)
scene.add(sfset)
const sfleft = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color('#0e0f27') }))
sfleft.position.set(17.5, 2, 14.5)
scene.add(sfleft)
const sfright = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color('#0e0f27') }))
sfright.position.set(17.5, 2, 5.5)
scene.add(sfright)

const door = new THREE.Mesh(new THREE.BoxGeometry(6, 16, 0.5), new THREE.MeshBasicMaterial({ color: new THREE.Color('#101a45') }))
door.position.set(5, 8, 0.5)
scene.add(door)

const lll = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4), new THREE.MeshBasicMaterial({ color: new THREE.Color('#9e99c1') }))
lll.position.set(7.5, 8, 1)
lll.rotateX(THREE.MathUtils.degToRad(90))
scene.add(lll)

const textureLoader = new THREE.TextureLoader();

const picture = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshPhongMaterial({
  // color: '#0e1024',
  // side: THREE.DoubleSide,
  map: textureLoader.load(new URL(`/components/assets/1.jpg`, import.meta.url).href)
}))
picture.position.set(14, 11, 0.6)
scene.add(picture)
const picrectLight = new THREE.RectAreaLight(0xffffff, 1, 6, 6);
picrectLight.position.set(14, 11, 0.6);
picrectLight.lookAt(14, 11, 0.5);
scene.add(picrectLight)

const wall1 = new THREE.Mesh(new THREE.BoxGeometry(21, 2, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color('#625c87') }))
const wall2 = new THREE.Mesh(new THREE.BoxGeometry(21, 2, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color('#625c87') }))
wall1.position.set(10.5, 1, 20.5)
wall2.position.set(20.5, 1, 10.5)
wall2.rotateY(THREE.MathUtils.degToRad(90))
scene.add(wall1, wall2)

scene.background = new THREE.Color('#000')

const directionalLight = new THREE.DirectionalLight('#557bc8')
directionalLight.position.set(10, 30, 10)
directionalLight.target = desk
directionalLight.castShadow = true
scene.add(directionalLight)

const floader = new FontLoader()
const f = floader.parse(zh)
if (f) {
  const textgeometry = new TextGeometry('three', {
    font: f,
    size: 0.2,
    depth: 0.1,
    // height: 15,
    // curveSegments: 10,
    // bevelThickness: 5,
    // bevelSize: 1.5,
    // bevelEnabled: true,
    // bevelSegments: 10,
  });
  textgeometry.computeBoundingBox();
  const line = new THREE.Mesh(textgeometry, new THREE.MeshBasicMaterial({
    color: 'white',
    side: THREE.DoubleSide,//双面显示
    wireframe: false
  }))
  line.position.set(11.8, 3.3, 8.2)
  line.rotateY(THREE.MathUtils.degToRad(45))
  line.rotateX(THREE.MathUtils.degToRad(-90))
  scene.add(line)
} else {
  console.log('err');
}

</script>

```

