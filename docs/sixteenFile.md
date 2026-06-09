---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixteenFile.vue'
// import exampleSource from '../docs/components/sixteenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'

const FlyControl = new FlyControls(camera, render.domElement)
FlyControl.rollSpeed = 0.1 //default 0.005
FlyControl.autoForward = false
// 移动控制：
//    前进和后退：通常可以通过W键和S键（或鼠标的左键和右键）来控制。
//    左右移动：A键和D键可以实现。
// 旋转控制：
//    绕Z轴旋转：Q键和E键可以实现顺时针和逆时针旋转。
//    绕Y轴旋转：左箭头键和右箭头键可以控制。
//    绕X轴旋转：上箭头键和下箭头键可以控制。
// 其他功能：
//    翻滚（Roll）：FlyControls还允许相机进行翻滚操作，这通常是通过特定的配置和输入来实现的，比如可能需要额外的按键或鼠标移动。
// 不知道r和f是什么功能,有点像视角向上向下，y变高变低
// 鼠标的方位能控制视角，会使视角向该方向倾斜

function animate() {
  FlyControl.update(clock.getDelta())// 加了这个可能操作之后渲染更快，时间更准确？   为了平滑动画和移动。
}

</script>

```


