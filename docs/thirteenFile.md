---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/thirteenFile.vue'
// import exampleSource from '../docs/components/thirteenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;position:relative;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<template>
  <div ref="ddd" style="width: 100%;height: 100%;"></div>
  <div ref="blocker" id="blocker">
    <div ref="instructions" id="instructions" @click="PointerLockControl.lock()">
      <p style="font-size:36px">
        Click to play
      </p>
      <p>
        Move: WASD<br />
        Jump: SPACE<br />
        Look: MOUSE
      </p>
    </div>
  </div>
</template>

<script setup>
const PointerLockControl = new PointerLockControls(camera, render.domElement)
PointerLockControl.addEventListener('lock', function () {
  instructions.value.style.display = 'none';
  blocker.value.style.display = 'none';
});

PointerLockControl.addEventListener('unlock', function () {
  blocker.value.style.display = 'block';
  instructions.value.style.display = '';
});
scene.add(PointerLockControl.getObject());
camera.position.set(10, 10, 10)
</script>

<style scoped>
#blocker {
  width: 100%;
  height: 100%;
  background-color: rgba(87, 87, 87, 0.5);
  position: absolute;
  top: 0;
  left: 0;
}

#instructions {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  font-size: 14px;
  cursor: pointer;
}
</style>

```
