---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/twentysixFile.vue'
// import exampleSource from '../docs/components/twentysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const textureLoader = new THREE.TextureLoader()
// 创建精灵材质对象SpriteMaterial
const spriteMaterial = new THREE.SpriteMaterial({
  // color: 0x699fab,// 设置颜色 黑色完全不显示，白色完全显示 有点像蒙版
  map: textureLoader.load(new URL(`/components/assets/bw.jpg`, import.meta.url).href)
});
// 创建精灵模型对象，不需要几何体geometry参数
const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(10, 10, 1)
scene.add(sprite)

scene.background = new THREE.Color('#6b5151')

// 效果差
const yd = textureLoader.load(new URL(`/components/assets/yd.png`, import.meta.url).href)
const spriteMaterial2 = new THREE.SpriteMaterial({
  map: yd,
  transparent: true // png图片要加透明
})

const group = new THREE.Group()
for (let i = 0; i < 10000; i++) {
  const ydsprite = new THREE.Sprite(spriteMaterial2)
  group.add(ydsprite)
  ydsprite.scale.set(1, 1, 1);
  // 设置精灵模型位置，在长方体空间上上随机分布
  const x = 1000 * (Math.random() - 0.5);
  const y = 600 * Math.random();
  const z = 1000 * (Math.random() - 0.5);
  ydsprite.position.set(x, y, z)
}
scene.add(group)
const clock = new THREE.Clock();
function loop() {
  // loop()两次执行时间间隔
  const t = clock.getDelta();
  group.children.forEach(sprite => {
    // 雨滴的y坐标每次减t*60
    sprite.position.y -= t * 60;
    if (sprite.position.y < 0) {
      sprite.position.y = 600;
    }
  });
  requestAnimationFrame(loop);
}
</script>

```

