---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyoneFile.vue'
// import exampleSource from '../docs/components/fortyoneFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div style="width: 100%;height: 100%;background-color: rgba(255,255,255,0.2);position: absolute;top: 0;left: 0;" @click="pointerLockControl.lock()"></div>
</template>

<script setup>
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
    
const pointerLockControl = new PointerLockControls(camera, render.domElement)
scene.add(pointerLockControl.getObject());
pointerLockControl.addEventListener('lock', () => {
  
})
pointerLockControl.addEventListener('unlock', () => {

})
let moveSpeed = 1;
let moveDirection = 0;
window.addEventListener('keydown', (e) => {
  e.preventDefault();
  moveDirection = e.deltaY < 0 ? 1 : -1;

  // 清除之前的超时
  if (window.moveTimeout) {
    clearTimeout(window.moveTimeout);
  }

  // 设置停止移动的超时
  window.moveTimeout = setTimeout(() => {
    moveDirection = 0;
  }, 100);
})
    
function animate() {
  // 根据移动方向更新位置
  if (moveDirection === 1) {
    pointerLockControl.moveForward(moveSpeed);
  } else if (moveDirection === -1) {
    pointerLockControl.moveForward(-moveSpeed);
  }
}
    
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

</script>

```

