---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtyfiveFile.vue'
// import exampleSource from '../docs/components/sixtyfiveFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotscreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBshiftShader.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
    
onMounted(() => {
  resizefn = () => {
    effectComposer.setSize(ddd.value.offsetWidth, ddd.value.offsetHeight)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  }
  resizefn()
  // 根据页面大小变化而适应变化
  window.addEventListener('resize', resizefn)

})
function animate() {
  const elapsedTime = clock.getElapsedTime()

  DisplacementPass.material.uniforms.uTime.value = elapsedTime

  // 使用效果合成器去渲染，替换render渲染
  effectComposer.render()
}
    
    
const environmentMap = cubeTextureLoader.load([
  '/threeProjectDocs/environmentMaps/0/px.jpg',
  '/threeProjectDocs/environmentMaps/0/nx.jpg',
  '/threeProjectDocs/environmentMaps/0/py.jpg',
  '/threeProjectDocs/environmentMaps/0/ny.jpg',
  '/threeProjectDocs/environmentMaps/0/pz.jpg',
  '/threeProjectDocs/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

loader.load('/threeProjectDocs/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(2, 2, 2)
  gltf.scene.rotation.y = Math.PI * 0.5
  scene.add(gltf.scene)

  updateAllMaterials()
})
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = 2.5
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)


const renderTarget = new THREE.WebGLRenderTarget(
  800,
  600,
  { samples: render.getPixelRatio() == 1 ? 2 : 0 }
)

// 效果合成器
const effectComposer = new EffectComposer(render, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
effectComposer.setSize(window.innerWidth, window.innerHeight)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// 将黑点图层应用于屏幕的原始图片上,黑白像素点风格
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)

// 小故障效果,随机在屏幕上显示电脉冲
const glitchPass = new GlitchPass()
glitchPass.goWild = false
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

// 自定义着色器通道，可以传入自定义着色器作为参数，以生成一个高级、自定义的后期处理通道
const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.enabled = false
effectComposer.addPass(rgbShiftPass)
// 添加伽马校正，使色彩颜色变暗的变回正常亮度
const gammacorrectionPass = new ShaderPass(GammaCorrectionShader)
effectComposer.addPass(gammacorrectionPass)

// 亚像素形态抗锯齿（SMAA）	全屏反锯齿效果
if (render.getPixelRatio() == 1 && !render.capabilities.isWebGL2) {
  const smaaPass = new SMAAPass()
  effectComposer.addPass(smaaPass)
}

// 虚幻引擎风格的发光效果 该通道与 Bloom 类似，但是它实现的效果更接近于Unreal3D引擎的Bloom效果
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6
effectComposer.addPass(unrealBloomPass)

// 自定义 色调
const TintShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTine: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;

    void main(){
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);

      vUv=uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTine;
    varying vec2 vUv;

    void main(){
      // tDiffuse设置成null，ShaderPass会自动填充纹理进去
      vec4 color=texture2D(tDiffuse,vUv);
      color.rgb+=uTine;
      gl_FragColor=color;
    }
  `,
}
const tintPass = new ShaderPass(TintShader)
tintPass.material.uniforms.uTine.value = new THREE.Vector3()
effectComposer.addPass(tintPass)


// 位移置换
const DisplacementShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: null },
    uNormalMap: { value: null}
  },
  vertexShader: `
    varying vec2 vUv;

    void main(){
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);

      vUv=uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform sampler2D uNormalMap;
    varying vec2 vUv;

    void main(){
      // 添加时间后有种波浪眩晕效果
      // vec2 newUv =vec2(
      //   vUv.x,
      //   vUv.y+sin(vUv.x*10.0+uTime)*0.1
      // );

      vec3 normalColor =texture2D(uNormalMap,vUv).xyz*2.0-1.0;

      // vec2 newUv=vUv;
      vec2 newUv=vUv+normalColor.xy*0.1;

      vec4 color=texture2D(tDiffuse,newUv);

      vec3 lightDirection=normalize(vec3(-1.0,1.0,0.0));
      float lightness =clamp(dot(normalColor, lightDirection),0.0, 1.0);
      color.rgb += lightness *2.0;

      gl_FragColor=color;
    }
  `,
}
const DisplacementPass = new ShaderPass(DisplacementShader)
DisplacementPass.material.uniforms.uTime.value = 0
DisplacementPass.material.uniforms.uNormalMap.value=textureLoader.load('/threeProjectDocs/interfaceNormalMap.png')
effectComposer.addPass(DisplacementPass)
    
gui.add(tintPass.material.uniforms.uTine.value, 'x', -1, 1, 0.01).name('r')
gui.add(tintPass.material.uniforms.uTine.value, 'y', -1, 1, 0.01).name('g')
gui.add(tintPass.material.uniforms.uTine.value, 'z', -1, 1, 0.01).name('b')
</script>

```

