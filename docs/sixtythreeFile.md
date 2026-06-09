---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtythreeFile.vue'
// import exampleSource from '../docs/components/sixtythreeFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import customShaderMaterial from 'three-custom-shader-material/vanilla'

function animate() {
  const elapsedTime = clock.getElapsedTime()

  if (model) model.rotation.y = elapsedTime * 0.1
}

const rgbeLoader = new RGBELoader()

rgbeLoader.load('/threeProjectDocs/aerodynamics_workshop.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.backgroundBlurriness = 0.5
  scene.environment = environmentMap
})


const uniforms = {
  uSliceStart: new THREE.Uniform(1.75),
  uSliceArc: new THREE.Uniform(1.25)
}


const patchMap = {
  csm_Slice: {
    '#include <colorspace_fragment>': `
        #include <colorspace_fragment>
          
        if(!gl_FrontFacing)gl_FragColor=vec4(0.75,0.15,0.3,1.0);
      `
  }
}

// const geometry = new THREE.IcosahedronGeometry(2.5, 5)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: '#858080'
})
// const cube = new THREE.Mesh(geometry, material)
// cube.position.set(0, 0, 0)
// scene.add(cube)
const slicedMaterial = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshStandardMaterial,
  silent: true,
  vertexShader: `
  varying vec3 vPosition;
  void main(){
    vPosition=csm_Position.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  uniform float uSliceStart;
  uniform float uSliceArc;
  void main(){

    float angle = atan(vPosition.y,vPosition.x);
    angle-=uSliceStart;
    angle=mod(angle,PI2);
    if(angle >0.0 && angle < uSliceArc)discard;

    // csm_FragColor=vec4(vec3(angle),1.0);
    // if(!gl_FrontFacing)csm_FragColor=vec4(0.75,0.15,0.3,1.0);
    float csm_Slice; //写属性名就可以激活
  }`,
  uniforms: uniforms,
  patchMap: patchMap,
  //MeshStandardMaterial
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: '#858080',
  side:THREE.DoubleSide
})
const slicedDepthMaterial = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshDepthMaterial,
  silent: true,
  vertexShader: `
  varying vec3 vPosition;
  void main(){
    vPosition=csm_Position.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  uniform float uSliceStart;
  uniform float uSliceArc;
  void main(){

    float angle = atan(vPosition.y,vPosition.x);
    angle-=uSliceStart;
    angle=mod(angle,PI2);
    if(angle >0.0 && angle < uSliceArc)discard;

    // csm_FragColor=vec4(vec3(angle),1.0);
    // if(!gl_FrontFacing)csm_FragColor=vec4(0.75,0.15,0.3,1.0);
    float csm_Slice; //写属性名就可以激活
  }`,
  uniforms: uniforms,
  patchMap: patchMap,

  //MeshDepthMaterial
  depthPacking: THREE.RGBADepthPacking
})

let model
loader.load('/threeProjectDocs/gears.glb', (gltf) => {
  model = gltf.scene

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name == 'outerHull') {
        child.material = slicedMaterial
        child.customDepthMaterial = slicedDepthMaterial
      } else {
        child.material = material
      }
      
      child.castShadow=true
      child.receiveShadow = true
    }
  })

  scene.add(model)
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({ color: '#aaaaaa' })
)
plane.receiveShadow = true
plane.position.x = - 4
plane.position.y = - 3
plane.position.z = - 4
plane.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(plane)

const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
directionalLight.position.set(6.25, 3, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 30
directionalLight.shadow.normalBias = 0.05
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
scene.add(directionalLight)

    
gui.add(uniforms.uSliceStart, 'value', -Math.PI, Math.PI, 0.001).name('usliceStart')
gui.add(uniforms.uSliceArc, 'value', 0, Math.PI * 2, 0.001).name('uSliceArc')
</script>

```

