---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/sixtytwoFile.vue'
// import exampleSource from '../docs/components/sixtytwoFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import customShaderMaterial from 'three-custom-shader-material/vanilla'
import simplexNoise4dFile from '../components/assets/glsl/simplexNoise4d.glsl'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
    
function animate() {
  const elapsedTime = clock.getElapsedTime()

  uniforms.uTime.value = elapsedTime
}
    
const rgbeLoader = new RGBELoader()

rgbeLoader.load('/threeProjectDocs/urban_alley_01_1k.hdr', (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

let geometry = new THREE.IcosahedronGeometry(2.5, 50)
geometry = mergeVertices(geometry)
geometry.computeTangents()
console.log(geometry.attributes)

let debugObject={}
debugObject.colorA = '#0000ff'
debugObject.colorB = '#ff0000'

const uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.5),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),

  uWrapPositionFrequency: new THREE.Uniform(0.38),
  uWrapTimeFrequency: new THREE.Uniform(0.12),
  uWrapStrength: new THREE.Uniform(1.7),

  uColorA: new THREE.Uniform(new THREE.Color(debugObject.colorA)),uColorB: new THREE.Uniform(new THREE.Color(debugObject.colorB))
}

const vertexShader = `
 varying vec2 vUv;
 attribute vec4 tangent;
 varying float vWobble;

 uniform float uTime;
 uniform float uPositionFrequency;
 uniform float uTimeFrequency;
 uniform float uStrength;

 uniform float uWrapPositionFrequency;
 uniform float uWrapTimeFrequency;
 uniform float uWrapStrength;

 ${simplexNoise4dFile}

 float getWobble(vec3 position){
  vec3 warpedPosition =position;
  warpedPosition += simplexNoise4d(vec4(
    // position,
    position*uWrapPositionFrequency,
    // uTime
    uTime*uWrapTimeFrequency
  ))*uWrapStrength;
   return simplexNoise4d(vec4(
    //  position,
    //  position*uPositionFrequency,
    warpedPosition*uPositionFrequency,
    //  0.0
    uTime*uTimeFrequency
   ))*uStrength;
 }

 void main(){
   // csm_Position.y+=sin(csm_Position.x*3.0)*0.5;

   vec3 biTangent = cross(normal,tangent.xyz);
   float shift = 0.01;
   vec3 positionA = csm_Position + tangent.xyz * shift;
   vec3 positionB = csm_Position + biTangent * shift;

   // float wobble =simplexNoise4d(vec4(
   //   csm_Position,
   //   0.0
   // ));
   float wobble = getWobble(csm_Position);
   csm_Position += wobble * normal;
   positionA+= getWobble(positionA)* normal;
   positionB+= getWobble(positionB)* normal;

   vec3 toA=normalize(positionA-csm_Position);
   vec3 toB=normalize(positionB-csm_Position);
   csm_Normal = cross(toA, toB);

   vUv=uv;
  //  vWobble=wobble;
   vWobble=wobble/uStrength;
}`
const material = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshPhysicalMaterial,
  vertexShader: vertexShader,
  fragmentShader: `
  varying vec2 vUv;
  varying float vWobble;

  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main(){
    // csm_FragColor.rgb=vec3(1.0,0.5,0.5);//使用这个属性csm_FragColor会失去阴影
    // csm_DiffuseColor.rgb=vec3(1.0,0.5,0.5);//csm_DiffuseColor不会

    // csm_Metalness=sin(vUv.x*100.0);
    // csm_Metalness=step(0.0,sin(vUv.x*100.0));
    // csm_Metalness=step(0.0,sin(vUv.x*100.0+0.5));
    // csm_Roughness=0.0;
    // csm_Roughness=1.0-csm_Metalness;

    // csm_FragColor.rgb=vec3(vWobble);

    float colorMix=smoothstep(-1.0,1.0,vWobble);
    csm_DiffuseColor.rgb =mix(uColorA,uColorB, colorMix);

    // csm_Metalness =step(0.25, vWobble);
    // csm_Roughness=1.0-csm_Metalness;
    csm_Roughness =1.0- colorMix;
  }`,
  uniforms: uniforms,
  silent: true,//去掉报错Function copy already exists on CSM, renaming to base_copy
  // MeshPhysicalMaterial
  metalness: 0,
  roughness: 0.5,
  color: '#ffffff',
  transmission: 0,
  ior: 1.5,
  thickness: 1.5,
  transparent: true,
  wireframe: false
})
const depthMaterial = new customShaderMaterial({
  //csm
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader: vertexShader,
  uniforms: uniforms,
  silent: true,

  // MeshDepthMaterial
  depthPacking: THREE.RGBADepthPacking
})


const cube = new THREE.Mesh(geometry, material)
cube.customDepthMaterial = depthMaterial
cube.receiveShadow = true
cube.castShadow = true
// cube.position.set(0, 0, 0)
scene.add(cube)

loader.load('/threeProjectDocs/suzanne2.glb', (gltf) => {
  // console
  const wobble = gltf.scene.children[0]
  wobble.receiveShadow = true
  wobble.castShadow = true
  wobble.material = material
  wobble.customDepthMaterial = depthMaterial
  wobble.position.x=5
  scene.add(wobble)
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15, 15),
  new THREE.MeshStandardMaterial()
)
plane.receiveShadow = true
plane.rotation.y = Math.PI
plane.position.y = - 5
plane.position.z = 5
scene.add(plane)

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
scene.add(directionalLight)


gui.add(uniforms.uPositionFrequency, 'value', 0, 2, 0.001).name('uPositionFrequency')
gui.add(uniforms.uTimeFrequency, 'value', 0, 2, 0.001).name('uTimeFrequency')
gui.add(uniforms.uStrength, 'value', 0, 2, 0.001).name("uStrength")

gui.add(uniforms.uWrapPositionFrequency, 'value', 0, 2, 0.001).name('uWrapPositionFrequency')
gui.add(uniforms.uWrapTimeFrequency, 'value', 0, 2, 0.001).name('uWrapTimeFrequency')
gui.add(uniforms.uWrapStrength, 'value', 0, 2, 0.001).name("uWrapStrength")

gui.addColor(debugObject, 'colorA').onChange(() => { 
  uniforms.uColorA.value.set(debugObject.colorA)
})
gui.addColor(debugObject, 'colorB').onChange(() => {
  uniforms.uColorB.value.set(debugObject.colorB)
})

gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(material, 'roughness', 0, 1, 0.001)
gui.add(material, 'transmission', 0, 1, 0.001)
gui.add(material, 'ior', 0, 10, 0.001)
gui.add(material, 'thickness', 0, 10, 0.001)
gui.addColor(material, 'color')
</script>

```

```glsl
//  simplexNoise4d.glsl
//	Simplex 4D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float simplexNoise4d(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

// Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}
```