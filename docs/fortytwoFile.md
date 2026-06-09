---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fortytwoFile.vue'
// import exampleSource from '../docs/components/fortytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { Sky } from "three/examples/jsm/objects/Sky";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import zh from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
    
loader.load('/threeProjectDocs/modle_dangao.glb', (e, r) => {
  console.log(e, r, )
  let a = e.scene.children[0]
  a.position.set(0, 0, 0)
  a.scale.set(20, 20, 20)
  a.children.forEach(e => {
    if (e.name == "Retopo_文本002") {
      e.visible = false
      console.log(e)
    }
  })
  console.log(a)
  scene.add(a)
})
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0, 10, 0); // 设置光源位置
directionalLight.lookAt(0, 0, 0); // 设置光源朝向
scene.add(directionalLight);

// scene.background = new THREE.Color('#6bb6e5')

const sun = new THREE.Vector3(-80, 5, -100);
// water.material.uniforms["sunDirection"].value.copy(sun).normalize();
// 加了太阳之后，水面显示会有点泛白，是因为太阳的位置的向量长度太长
// 归一化 将向量的xyz等比例缩放，将整个向量的长度缩放到长度为1  调用一下normalize函数就可以将向量设置成单位向量

const sky = new Sky();
sky.scale.setScalar(10000);

sky.material.uniforms["sunPosition"].value.copy(sun);
sky.material.uniforms["turbidity"].value = 1;
sky.material.uniforms["rayleigh"].value = 1.5;
sky.material.uniforms["mieCoefficient"].value = 0.005;
sky.material.uniforms["mieDirectionalG"].value = 0.8;

scene.add(sky);

const dm = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({ color: '#038b18' }))
dm.position.set(0, 0, 0)
dm.receiveShadow = true
// dm.castShadow = true
// scene.add(dm)

// const wall1 = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 10), new THREE.MeshBasicMaterial({ color: 'green' }))
// wall1.position.set(0, 0, 0)
// wall1.receiveShadow = true
// wall1.rotateX(Math.PI / 2)
// scene.add(wall1)



// font
const floader = new FontLoader()
const f = floader.parse(zh)
if (f) {
  const textgeometry = new TextGeometry('25', {
    font: f,
    size: 1,
    depth: 0.1,
    // height: 15,
    // curveSegments: 10,
    // bevelThickness: 5,
    // bevelSize: 1.5,
    // bevelEnabled: true,
    // bevelSegments: 10,
  });

  // textgeometry.center();
  console.log(textgeometry);
  textgeometry.computeBoundingBox();
  const line = new THREE.Mesh(textgeometry, new THREE.MeshBasicMaterial({
    color: 'white',
    side: THREE.DoubleSide,//双面显示
    wireframe: false
  }))

  console.log(line);
  line.position.set(-0.6, 5.2, 2.5)
  line.scale.set(0.6,0.6,0.6)
  scene.add(line)
} else {
  console.log('err');
}
</script>

```

