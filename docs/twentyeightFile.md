---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentyeightFile.vue'
// import exampleSource from '../docs/components/twentyeightFile.vue?raw'


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
const geometry = new THREE.BoxGeometry(wh, 1, wh)
const material = new THREE.MeshBasicMaterial({
  color: 'black',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

scene.background = new THREE.Color('gray')

// const box = new THREE.Box3();
// box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 1, 3));

// const box3helper = new THREE.Box3Helper(box, 0xffff00)
// scene.add(box3helper)


// const obb = new OBB()

const group = new THREE.Group()
const material2 = new THREE.MeshBasicMaterial({ color: 'white' })
const geometry2 = new THREE.SphereGeometry(0.2, 64, 32);
for (let i = -(wh / 2); i < (wh / 2); i++) {
  let h = i == -(wh / 2) ? 3 : group.children[group.children.length - (wh - 1)].position.y
  let jj = false
  if (i == -(wh / 2)) {
    jj = false
  } else if (h == 1 || h == 5) {
    jj = h == 1 ? true : false
    jj = h == 5 ? false : true
  } else {
    jj = group.children[group.children.length - wh].position.y - h > 0 ? false : true
  }
  for (let j = -(wh / 2); j < (wh / 2); j++) {
    const mesh = new THREE.Mesh(geometry2, material2)
    mesh.position.set(j, h, i)
    // console.log(j, h, i)
    group.add(mesh)
    // h--
    if (jj) {
      h++
      if (h == 5) {
        jj = false
      }
    } else {
      h--
      if (h == 1) {
        jj = true
      }
    }
  }
}
scene.add(group)
// console.log(group)

// const clock = new THREE.Clock()
function loop() {
  // loop()两次执行时间间隔
  // const t = clock.getDelta();
  let jj = false
  group.children.map((item, index, array) => {
    if (index !== array.length - 1 && (index == 0 || (index + 1) % wh == 1)) {
      let next = array[index + 1]

      jj = item.position.y > next.position.y ? true : false
    }
    if (item.position.y == 1) { jj = true }
    if (item.position.y == 5) { jj = false }

    if (jj) {
      array[index].position.y = index == 0 || (index + 1) % wh == 1 ? item.position.y + 1 : array[index - 1].position.y - 1
      if (array[index].position.y == 1) {
        jj = false
      }
    } else {
      array[index].position.y = index == 0 || (index + 1) % wh == 1 ? item.position.y - 1 : array[index - 1].position.y + 1
      if (array[index].position.y == 5) {
        jj = true
      }
    }

  });
  // requestAnimationFrame(loop);
}

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
  if (typeof resizeHandler === 'function') window.removeEventListener('
// ... more code ...
</script>

```


