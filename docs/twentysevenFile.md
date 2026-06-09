---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentysevenFile.vue'
// import exampleSource from '../docs/components/twentysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>

scene.background = new THREE.Color('#051f2a')

const geometry = new THREE.BoxGeometry(100, 1, 100)
const material = new THREE.MeshBasicMaterial({
  color: 'gray',
  // wireframe: true,
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
scene.add(cube)

const textureLoader = new THREE.TextureLoader()

const group = new THREE.Group()
const material2 = new THREE.SpriteMaterial({
  // color: 'white',
  map: textureLoader.load(new URL(`/components/assets/xh.png`, import.meta.url).href),
  side: THREE.DoubleSide,
  transparent: true, // png图片一部分是透明的，要加transparent
})

for (let i = 0; i < 500; i++) {
  const ydsprite = new THREE.Sprite(material2)
  ydsprite.position.set(100 * (Math.random() - 0.5), 100 * (Math.random()) / 2, 100 * (Math.random() - 0.5))
  group.add(ydsprite)
}
scene.add(group)

const clock = new THREE.Clock();
function loop() {
  // loop()两次执行时间间隔
  const t = clock.getDelta();
  group.children.forEach(sprite => {
    sprite.position.y -= t * 10;
    if (sprite.position.y < 0) {
      sprite.position.set(100 * (Math.random() - 0.5), 50, 100 * (Math.random() - 0.5));
    }
  });
  requestAnimationFrame(loop);
}
</script>

```

