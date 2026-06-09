---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentyfiveFile.vue'
// import exampleSource from '../docs/components/twentyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBB } from 'three/examples/jsm/math/OBB.js';
    
onMounted(() => {
  // 导出模型
  const gltfExporter = new GLTFExporter()
  gltfExporter.parse(
    scene,
    // called when the gltf has been generated
    function (gltf) {
      console.log(gltf);
      // download JSON  gltf 
      // var blob = new Blob([JSON.stringify(gltf)])
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = 'a.gltf'
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
      // URL.revokeObjectURL(url)
    },
    // called when there is an error in the generation
    function (error) {
      console.log('An error happened');
    },
    // options = {}
    {}
  );

})
    
const abl = new THREE.AmbientLight('white')
scene.add(abl)

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhysicalMaterial({ color: 'white' }))
scene.add(dm)

const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 'yellow' }))
const box2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 'black' }))
box1.position.set(0, 1, 0)
box2.position.set(5, 1, 5)
scene.add(box1, box2)

let arr = [10, 10, 10]
window.addEventListener('keydown', e => {
  // console.log(e)
  if (e.code == 'ArrowLeft') {
    box1.translateX(1)
    arr[0]++
  } else if (e.code == 'ArrowRight') {
    box1.translateX(-1)
    arr[0]--
  } else if (e.code == 'ArrowUp') {
    box1.translateZ(1)
    arr[2]++
  } else if (e.code == 'ArrowDown') {
    box1.translateZ(-1)
    arr[2]--
  }
  obb.center = new THREE.Vector3(box1.position.x, box1.position.y, box1.position.z)
  // 碰撞检测
  if (obb.intersectsOBB(obb1)) {
    a.value = '碰撞'
    setTimeout(() => {
      a.value = ''
    }, 1000);
  }
  camera.position.set(...arr)
  OrbitControl.target.set(arr[0] - 10, 0, arr[2] - 10)
  // camera.lookAt(arr[0] - 10, 0, arr[2] - 10)  ////
  // OrbitControl.position.set(...arr)
})

const geometry = new TeapotGeometry(10, 18);
const material = new THREE.MeshBasicMaterial({ color: '#2b1515' });
const teapot = new THREE.Mesh(geometry, material);
teapot.position.set(-20, 10, 0)
scene.add(teapot);

const obb = new OBB(new THREE.Vector3(box1.position.x, box1.position.y, box1.position.z))
const obb1 = new OBB(new THREE.Vector3(box2.position.x, box2.position.y, box2.position.z))
</script>

```

