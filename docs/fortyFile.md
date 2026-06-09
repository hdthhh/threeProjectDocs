---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortyFile.vue'
// import exampleSource from '../docs/components/fortyFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { planetList } from './comp/solarsystem.js'
import planetDesc from './comp/planetDesc.vue'
    
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = clock.getElapsedTime() - lastTime
  lastTime = elapsedTime;

  gongzhuan()
  zizhuan()
}

    
// let bg = textureLoader.load(universeImg); // 设置背景为宇宙图片
let bg = textureLoader.load(new URL(`/components/assets/img/universe.jpg`, import.meta.url).href);
bg.mapping = THREE.EquirectangularReflectionMapping // 球形映射，必填，跟随视角旋转
scene.background = bg
scene.environment = bg


const currentPlanet = ref(null)

const group = new THREE.Group()
function createPlant(obj) {
  let duoge = obj.name == '地球' ? new THREE.Group() : null

  const geometry = new THREE.SphereGeometry(obj.size, 100, 100)
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(obj.mapImg),
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(...obj.position)
  if (duoge) {
    duoge.name = obj.name
  } else {
    cube.name = obj.name
  }

  if (obj.name != '太阳') {
    const gd = new THREE.Mesh(
      new THREE.TorusGeometry(obj.position[0], 1,),//圆环缓冲几何体
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    gd.position.set(0, 0, 0)
    gd.rotateX(Math.PI / 2); // 将环形网格旋转90度
    gd.name = obj.name + '环'
    group.add(gd);

    cube.isPlanet = true // 标记为行星
  }
  if (obj.name == '地球') {
    let moonMesh = new THREE.Mesh(new THREE.SphereGeometry(obj.position[0] / 49, 100, 100), new THREE.MeshBasicMaterial({
      map: textureLoader.load(new URL(`/components/assets/img/moon.jpg`, import.meta.url).href),
      normalScale: new THREE.Vector2(10, 10), //凹凸深度
    }));
    moonMesh.position.set(obj.size + 40, 0, 0);
    moonMesh.name = '月球'
    moonMesh.isPlanet = true // 标记为行星
    duoge.add(cube, moonMesh)

    let moongd = new THREE.Mesh(
      new THREE.TorusGeometry(obj.size + 40, 1,),//圆环缓冲几何体
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    // moongd.position.set(...obj.position);
    moongd.name = '月球环'
    moongd.rotateX(Math.PI / 2);
    duoge.add(moongd)

    const cloud = new THREE.Mesh(
      new THREE.SphereGeometry(obj.size + 5, 100, 100),
      new THREE.MeshBasicMaterial({
        map: textureLoader.load(new URL(`/components/assets/img/earthClouds.jpg`, import.meta.url).href),
        color: new THREE.Color(0xffffff),
        transparent: true,
        opacity: 0.4,
      })
    )
    cloud.name = '地球云层'
    duoge.add(cloud)

    duoge.isPlanet = true // 标记为行星
    // duoge.name = '地球'

    cube.position.set(0, 0, 0);
    duoge.position.set(...obj.position);
    console.log(duoge)
  }
  group.add(duoge ? duoge : cube)
}

function gongzhuan() {
  for (const e of group.children) {
    if (e.isPlanet) {
      if (!e.angle) {
        e.angle = 0; // 初始化角度
      }
      let planetData = planetList.filter((d) => d.name == e.name)[0]; //获取球体数据
      // console.log(planetData,e.name)
      e.angle =
        e.angle + planetData.revolution >= 2 * Math.PI
          ? 0
          : e.angle + planetData.revolution;
      e.position.set(
        planetData.position[0] * Math.sin(e.angle),
        0,
        planetData.position[0] * Math.cos(e.angle)
      );
      // if (e.name == '月球') {
      //   e.position.set((e.position[0] + 75) * Math.sin(e.angle), 0, (e.position[0] + 75) * Math.cos(e.angle))
      // }
    }
  }
}
function zizhuan() {
  for (const e of group.children) {
    let planetData = planetList.filter((d) => d.name == e.name)[0]; //获取球体数据
    if (e.isPlanet && e.name !== '地球') {
      e.rotation.y -= planetData.rotation;
    }
    if (e.name == '地球') {
      for (const ee of e.children) {
        if (ee.isPlanet) {
          ee.rotation.y -= planetData.rotation
        }
      }
    }
    if (e.name == '太阳') {
      e.rotation.y -= planetData.rotation;
    }
  }
}

const raycaster = new THREE.Raycaster() // 光线投射
const vers = new THREE.Vector2() // 点
window.addEventListener('click', e => {
  // 转换坐标为three的类型坐标
  vers.x = (e.clientX / ddd.value.offsetWidth ) * 2 - 1
  vers.y = -((e.clientY / ddd.value.offsetHeight) * 2 - 1)
  console.log(vers.x, vers.y);


  // 设置光线投射,更新位置
  raycaster.setFromCamera(vers, camera)
  // 设置需要获取点击的物体，可以使用scene。child，但是哪里面有坐标系，所以也可以直接写数组
  const getclickThings = raycaster.intersectObjects(group.children,false)
  console.log(getclickThings); // 获得数组，当里面有两个以上物体，可根据distance判断最近的物体，或者就是第一个，里面的object就是点击的这个物体 {object：Mesh,distance:number,...}

  if (getclickThings.length > 0) {
    let near = getclickThings[0]
    if (near.object.isPlanet||near.object.name == '太阳') {
      let planetData = planetList.findIndex((d) => d.name == near.object.name); //获取球体数据
      console.log(planetData)
      currentPlanet.value = planetData
      // OrbitControl.target.set(...near.object.position); // 设置目标点
      // OrbitControl.update(); // 更新控制器
    }
  } else {
    currentPlanet.value = null
  }
})
</script>

```

