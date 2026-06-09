---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftysixFile.vue'
// import exampleSource from '../docs/components/fiftysixFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
import lightglsl from '../components/assets/glsl/light.glsl';
    
function animate() {
  const elapsedTime = clock.getElapsedTime()

  juan.rotation.x = -elapsedTime * 0.5
  juan.rotation.y = elapsedTime * 0.5
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.5
    suzanne.rotation.y = elapsedTime * 0.5
  }

  material.uniforms.uResolution.value.set(ddd.value.offsetWidth / PixelRatio, ddd.value.offsetHeight  / PixelRatio)
}
    
const materialParams = {}
materialParams.color = '#ff794d'
materialParams.shadeColor='#8e19b8'
materialParams.shadowColor = '#8e19b8'
materialParams.lightColor = '#e5ffe0'

const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main(){
    vec4 modelPosition=modelMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vPosition= modelPosition.xyz;
    vec4 modelNormal =modelMatrix*vec4(normal, 0.0);
    vNormal=modelNormal.xyz;
  }`,
  fragmentShader: `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform vec3 uShadowColor;
  uniform float uShadowRepectitions;
  uniform vec3 uLightColor;
  uniform float uLightRepectitions;

  // light glsl
  ${lightglsl}

  vec3 halftone(vec3 color,float repetitions,vec3 direction,float low,float high,vec3 pointColor,vec3 normal){
    float intensity=dot(normal,direction);
    intensity=smoothstep(low,high,intensity);

    vec2 uv=gl_FragCoord.xy/uResolution.y;
    uv*=repetitions;
    uv=mod(uv,1.0);

    float point=distance(uv,vec2(0.5));
    point=1.0-step(0.5*intensity,point);

    return mix(color,pointColor,point);
  }

  void main(){
    vec3 viewDirection=normalize(vPosition-cameraPosition);
    vec3 normal=normalize(vNormal);
    vec3 color=uColor;

    vec3 light=vec3(0.0);
    light+=AmbientLight(vec3(1.0),1.0);    
    light+=DirectionalLight(vec3(1.0,1.0,1.0),1.0,normal,vec3(1.0,1.0,0.0),viewDirection,1.0);
    color*=light;

    // float repetitions=50.0;
    // vec3 direction= vec3(0.0,-1.0,0.0);
    // float low=-0.8;
    // float high=1.5;
    // vec3 pointColor=vec3(1.0,0.0,0.0);

    // 底部紫光
    color = halftone(color,uShadowRepectitions,vec3(0.0,-1.0,0.0),-0.8,1.5,uShadowColor,normal);
    // 顶部黄光
    color = halftone(color,uLightRepectitions,vec3(1.0,1.0,0.0),0.5,1.5,uLightColor,normal);

    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    uColor: { value: new THREE.Color(materialParams.color) },
    uShadeColor: { value: new THREE.Color(materialParams.shadeColor) },
    uResolution: { value: new THREE.Vector2(window.innerWidth  / PixelRatio, window.innerHeight / PixelRatio) },
    uShadowColor: { value: new THREE.Color(materialParams.shadowColor) },
    uShadowRepectitions: new THREE.Uniform(100),
    uLightColor: { value: new THREE.Color(materialParams.lightColor) },
    uLightRepectitions: new THREE.Uniform(100),
  },
})

const qiu = new THREE.Mesh(new THREE.SphereGeometry(4, 64, 32), material)
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(2, 0.8, 100, 20), material)
juan.position.set(10, 0, 0)
scene.add(qiu, juan)

let suzanne = null
loader.load('/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material = material
  })
  gltf.scene.position.set(-10, 0, 0)
  gltf.scene.scale.set(4, 4, 4)
  suzanne = gltf.scene
  scene.add(gltf.scene)
})

const colors = {
  bgcolor: new THREE.Color('rgb(33, 20, 41)'),
  // boxcolor: new THREE.Color('rgb(254, 110, 66)'),
}
scene.environment = colors.bgcolor
scene.background = colors.bgcolor
    
gui.addColor(colors, 'bgcolor').onChange(() => { scene.environment = colors.bgcolor; scene.background = colors.bgcolor })
gui.addColor(materialParams, 'color').onChange(() => { material.uniforms.uColor.value.set(materialParams.color) })
gui.addColor(materialParams, 'shadowColor').onChange(() => { material.uniforms.uShadowColor.value.set(materialParams.shadowColor) })
gui.add(material.uniforms.uShadowRepectitions, 'value').min(1).max(300).step(1).name('ShadowRepectitions')
gui.addColor(materialParams, 'lightColor').onChange(() => { material.uniforms.uLightColor.value.set(materialParams.lightColor) })
gui.add(material.uniforms.uLightRepectitions, 'value').min(1).max(300).step(1).name('LightRepectitions')
</script>

```

```glsl
// light.glsl
vec3 AmbientLight(vec3 lightColor,float lightIntensity){
  return lightColor*lightIntensity;
}
vec3 DirectionalLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower){
  vec3 lightDirection=normalize(lightPosition);
  vec3 lightRlflection=reflect(-lightDirection,normal);//反射函数
  float shading=dot(normal,lightDirection);
  // 法线和光线点积后，结果从1（方向相反）到0（90度）到-1（方向相同），-1和环境光乘积后光线会很小，所以要控制他至少是0
  shading=max(0.0,shading);
  float specular = -dot(lightRlflection,viewDirection);// 高光
  specular=max(0.0,specular);
  specular=pow(specular,specularPower);
  return lightColor*lightIntensity*(shading+specular);
  // return vec3(shading);
  // return vec3(specular);
}
vec3 PointLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower,vec3 position,float lightdecay){
  vec3 lightDelta=lightPosition-position;
  float lightDistance=length(lightDelta);
  vec3 lightDirection=normalize(lightDelta);
  vec3 lightRlflection=reflect(-lightDirection,normal);//反射函数
  float shading=dot(normal,lightDirection);
  // 法线和光线点积后，结果从1（方向相反）到0（90度）到-1（方向相同），-1和环境光乘积后光线会很小，所以要控制他至少是0
  shading=max(0.0,shading);
  float specular = -dot(lightRlflection,viewDirection);// 高光
  specular=max(0.0,specular);
  specular=pow(specular,specularPower);
  float decay=1.0-lightDistance*lightdecay;
  decay=max(0.0,decay);
  return lightColor*lightIntensity*decay*(shading+specular);
  // return vec3(shading);
  // return vec3(specular);
  // return vec3(decay);
}
```