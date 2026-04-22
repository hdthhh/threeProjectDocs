---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/eightFile.vue'
// import exampleSource from '../docs/components/eightFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const ddd = ref(null)

const raycaster = new THREE.Raycaster() // 光线投射
const vers = new THREE.Vector2() // 点

ddd.value.addEventListener('click', e => {
  // 转换坐标为three的类型坐标
  vers.x = ((e.clientX-ddd.value.getBoundingClientRect().left) / ddd.value.offsetWidth) * 2 - 1
  vers.y = -(((e.clientY - ddd.value.getBoundingClientRect().top) / ddd.value.offsetHeight) * 2 - 1)
  console.log(vers.x, vers.y);


  // 设置光线投射,更新位置
  raycaster.setFromCamera(vers, camera)
  // 设置需要获取点击的物体，可以使用scene。child，但是哪里面有坐标系，所以也可以直接写数组
  const getclickThings = raycaster.intersectObjects([cube, cube2, cube3])
  console.log(getclickThings); // 获得数组，当里面有两个以上物体，可根据distance判断最近的物体，或者就是第一个，里面的object就是点击的这个物体 {object：Mesh,distance:number,...}

  if (getclickThings.length > 0) {
    let near = getclickThings[0]
    if (near.object.choose) {
      near.object.material.color.set(near.object.material.originColor)
      near.object.choose = false
      return
    }
    near.object.material.originColor = near.object.material.color.getHex()
    near.object.material.color.set('yellow')
    near.object.choose = true
  }

})
</script>

```


