---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentynineFile.vue'
// import exampleSource from '../docs/components/twentynineFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <ul>
    <li v-for="(item, index) in 12" :key="item" @click="changeLook(index + 1)"></li>
  </ul>
  <p style="position: absolute;bottom: 20px;right: 20px;color: #ffffff;">{{ indexs }}</p>
  <div @click="changebox(true)"
    style="background-color: #fff;position: absolute;top: 50%;left: 10px;z-index: 999;cursor: pointer;">
    &nbsp;↑&nbsp;</div>
  <div @click="changebox(false)"
    style="background-color: #fff;position: absolute;top: 50%;right: 10px;z-index: 999;cursor: pointer;">
    &nbsp;↓&nbsp;</div>
</template>

<script setup>
const cammove = 50

camera.position.set(cammove, cammove, cammove)

const w = 10; // 宽度

const geometry = new THREE.BoxGeometry(w, w, w)
const redMaterial = new THREE.MeshBasicMaterial({ color: 'red' })
const yellowMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' })
const blueMaterial = new THREE.MeshBasicMaterial({ color: 'blue' })
const greenMaterial = new THREE.MeshBasicMaterial({ color: 'green' })
const orangeMaterial = new THREE.MeshBasicMaterial({ color: 'orange' })
const whiteMaterial = new THREE.MeshBasicMaterial({ color: 'white' })
// 右左上下前后  红黄蓝绿橙白
// const cube = new THREE.Mesh(geometry, [redMaterial, yellowMaterial, blueMaterial, greenMaterial, orangeMaterial, whiteMaterial])
// cube.position.set(0, 0, 0)
// scene.add(cube)

let jianxi = 0.2
let posarr = [
  [-(w + 0.2), (w + 0.2), -(w + 0.2)], [0, (w + 0.2), -(w + 0.2)], [(w + 0.2), (w + 0.2), -(w + 0.2)],
  [-(w + 0.2), (w + 0.2), 0], [0, (w + 0.2), 0], [(w + 0.2), (w + 0.2), 0],
  [-(w + 0.2), (w + 0.2), (w + 0.2)], [0, (w + 0.2), (w + 0.2)], [(w + 0.2), (w + 0.2), (w + 0.2)],
  [-(w + 0.2), 0, -(w + 0.2)], [0, 0, -(w + 0.2)], [(w + 0.2), 0, -(w + 0.2)],
  [-(w + 0.2), 0, 0], [0, 0, 0], [(w + 0.2), 0, 0],
  [-(w + 0.2), 0, (w + 0.2)], [0, 0, (w + 0.2)], [(w + 0.2), 0, (w + 0.2)],
  [-(w + 0.2), -(w + 0.2), -(w + 0.2)], [0, -(w + 0.2), -(w + 0.2)], [(w + 0.2), -(w + 0.2), -(w + 0.2)],
  [-(w + 0.2), -(w + 0.2), 0], [0, -(w + 0.2), 0], [(w + 0.2), -(w + 0.2), 0],
  [-(w + 0.2), -(w + 0.2), (w + 0.2)], [0, -(w + 0.2), (w + 0.2)], [(w + 0.2), -(w + 0.2), (w + 0.2)],
]
// let group27 = []
const group = new THREE.Group()
for (let i = 0; i < 27; i++) {
  let box = new THREE.Mesh(geometry, (i + 1) % 3 !== 100 ? [redMaterial, yellowMaterial, blueMaterial, greenMaterial, orangeMaterial, whiteMaterial] : new THREE.MeshBasicMaterial({ color: 'gray', wireframe: true }))
  box.position.set(...posarr[i])
  box.realpos = posarr[i]
  // group27.push(box)
  group.add(box)
  // scene.add(box)
}
scene.add(group)

const indexs = ref(0)
function changeLook(index) {
  indexs.value = index
  let obj = { 2: [0, cammove, 0], 5: [0, 0, -cammove], 7: [-cammove, 0, 0], 8: [0, -cammove, 0], 9: [cammove, 0, 0], 11: [0, 0, cammove] }
  if (obj[index]) {
    camera.position.set(...obj[index])
  }
}

const raycaster = new THREE.Raycaster()
const ninegroup = new THREE.Group()
scene.add(ninegroup)
function changebox(tf) {
  let deg = THREE.MathUtils.degToRad(tf ? 90 : -90)

  let ver = new THREE.Vector2()
  ver.x = ((ddd.value.offsetWidth  / 2) / ddd.value.offsetWidth ) * 2 - 1
  ver.y = -((ddd.value.offsetHeight / 2) / ddd.value.offsetHeight) * 2 + 1
  raycaster.setFromCamera(ver, camera)
  let arr = raycaster.intersectObjects(group.children)
  console.log(arr, ver.x, ver.y, group.children)
  if (arr.length <= 0) { return }
  let num = [], pos = [arr[0].object.position.x, arr[0].object.position.y, arr[0].object.position.z]
  console.log(pos)
  for (let i = 0; i < pos.length; i++) {
    if (pos[i] !== 0) {
      let xyz = i == 0 ? 'x' : i == 1 ? 'y' : 'z'
      num.push([xyz, pos[i]])
    }
  }
  console.log(num, num.length, num[0])
  // let ninebox = [] 
  if (num.length == 1) {
    // num[0]
    group.children.forEach((item, i) => {
      if (item.position[num[0][0]] == num[0][1]) {
        group.remove(item)
        ninegroup.add(item)
        // ninebox.push(item)
        console.log(item)
        console.log(ninegroup)
      }
    })
    console.log(ninegroup, ninegroup.children, ninegroup.children.length)
    // console.log(ninebox)
    ninegroup.children.forEach(item => {
      console.log(item)
    })
    if (num[0][0] == 'x') {
      ninegroup.rotateX(deg / 2)
      // ninebox.forEach(e => {
      //   e.rotateX(deg / 2)
      //   setTimeout(() => {
      //     e.rotateX(deg / 2)
      //   }, 1000);
      // });
    }
    if (num[0][0] == 'y') {
      ninegroup.rotateY(deg / 2)
      // ninebox.forEach(e => {
      //   e.rotateY(deg)
      //   setTimeout(() => {
      //     e.rotateY(deg / 2)
      //   }, 1000);
      // });
    }
    if (num[0][0] == 'z') {
      ninegroup.rotateZ(deg / 2)
      // ninebox.forEach(e => {
      //   e.rotateZ(deg)
      //   setTimeout(() => {
      //     e.rotateZ(deg / 2)
      //   }, 1000);
      // });
    }
    console.log(ninegroup, ninegroup.children, ninegroup.children.length)
    ninegroup.children.map(item => {
      ninegroup.remove(item)
      group.add(item)
      console.log(item)
    })
    console.log(group.children)
    // [group.children, ninegroup.children] = [[...group.children, ...ninegroup.children], []]
    // ninegroup.remove(...ninegroup.children)
    // scene.remove(ninegroup)


  }
}

</script>

<style scoped>
ul {
  list-style: none;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  display: flex;
  flex-wrap: wrap;

  li {
    width: 10px;
    height: 10px;
  }
}

li:nth-of-type(2) {
  background-color: blue;
}

li:nth-of-type(5) {
  background-color: white;
}

li:nth-of-type(7) {
  background-color: yellow;
}

li:nth-of-type(8) {
  background-color: green;
}

li:nth-of-type(9) {
  background-color: red;
}

li:nth-of-type(11) {
  background-color: orange;
}
</style>

```

