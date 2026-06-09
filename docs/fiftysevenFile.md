---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftysevenFile.vue'
// import exampleSource from '../docs/components/fiftysevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
function animate() {
  const elapsedTime = clock.getElapsedTime()

  earth.rotation.y = elapsedTime * 0.5
}
    
// anisotropy 各向异性 可以提高纹理的清晰度
// 获取该设备下的最大各向异性可设置值
// console.log(render.capabilities.getMaxAnisotropy())

// texture导入assets的图片，使用这种方式
// 或者 import a from assets/a.jpg  textureLoader.load(a)
const dayTexture = textureLoader.load(new URL(`/components/assets/earth/day.jpg`, import.meta.url).href)
dayTexture.colorSpace = THREE.SRGBColorSpace
dayTexture.anisotropy = 8
const nightTexture = textureLoader.load(new URL(`/components/assets/earth/night.jpg`, import.meta.url).href)
nightTexture.colorSpace = THREE.SRGBColorSpace
nightTexture.anisotropy = 8
const specularCloudsTexture = textureLoader.load(new URL(`/components/assets/earth/specularClouds.jpg`, import.meta.url).href)
specularCloudsTexture.anisotropy = 8

const earthParameters ={}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#ff6600'


const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
  }`,
  fragmentShader: `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform sampler2D udayTexture;
  uniform sampler2D unightTexture;
  uniform sampler2D uspecularCloudsTexture;
  uniform vec3 usunDirection;
  uniform vec3 uAtmosphereTwilightColor;
  uniform vec3 uAtmosphereDayColor;

  void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = vec3(0.0);

    float sunOrientation=dot(usunDirection,normal);// 根据太阳的方位，定义一半的白天和一半的黑天

    // 日夜
    vec3 day=texture(udayTexture,vUv).xyz;
    vec3 night=texture(unightTexture,vUv).rgb;
    // color=vec3(sunOrientation);
    // color=day;
    float daymix=smoothstep(-0.25,0.5,sunOrientation);
    color=mix(night,day,daymix);

    // 云
    vec2 specularCloudsColor=texture(uspecularCloudsTexture,vUv).rg;
    // float cloudsMix = specularCloudsColor.g;
    // 0.3-1.0 范围 ，减少云的数量
    float cloudsMix = smoothstep(0.3,1.0,specularCloudsColor.g);
    cloudsMix*=daymix; // 把云在黑夜移除
    color=mix(color,vec3(1.0),cloudsMix);

    // 菲涅尔
    float fresnel=dot(viewDirection,normal)+1.0;
    fresnel= pow(fresnel,2.0);

    // 大气层
    float atmosphereDayMix=smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    // color= atmosphereColor;
    // color=mix(color,atmosphereColor,fresnel);
    color=mix(color,atmosphereColor,fresnel*atmosphereDayMix);

    // 镜面反射，太阳光照在地球上反光
    vec3 reflection = reflect(-usunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular,0.0);
    specular = pow(specular,32.0);
    specular*=specularCloudsColor.r;// 陆地上，不反射太阳光
    // color += vec3(specular);
    // 我们希望边缘呈现大气层的颜色
    vec3 specularColor = mix(vec3(1.0),atmosphereColor, fresnel);
    color += specular * specularColor;

    gl_FragColor = vec4(color, 1.0); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    udayTexture: new THREE.Uniform(dayTexture),
    unightTexture: { value: nightTexture },
    uspecularCloudsTexture: { value: specularCloudsTexture },
    usunDirection: { value: new THREE.Vector3(0, 0, 1) },
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
  }
})

const geometry = new THREE.SphereGeometry(2, 64, 64)
const earth = new THREE.Mesh(geometry, material)
scene.add(earth)

// 大气层外层 类似雾气一样
const atmosphereMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  transparent: true,
  vertexShader: `
  // varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
  }`,
  fragmentShader: `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 usunDirection;
  uniform vec3 uAtmosphereTwilightColor;
  uniform vec3 uAtmosphereDayColor;

  void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = vec3(0.0);

    float sunOrientation=dot(usunDirection,normal);// 根据太阳的方位，定义一半的白天和一半的黑天

    // 大气层
    float atmosphereDayMix=smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color+=atmosphereColor;

    // 透明度
    float edgeAlpha=dot(viewDirection, normal);
    edgeAlpha =smoothstep(0.0,0.5,edgeAlpha);
   
    float dayAlpha =smoothstep(-0.5,0.0,sunOrientation);
    float alpha = edgeAlpha * dayAlpha;

    gl_FragColor = vec4(color, alpha); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,
  uniforms: {
    usunDirection: { value: new THREE.Vector3(0, 0, 1) },
    uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor)),
    uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
  }
})
const atmosphere = new THREE.Mesh(geometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)


const sun = new THREE.Spherical(1, Math.PI * 0.5, 0.5)
const sunDirection = new THREE.Vector3()

const debugSun = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 2), new THREE.MeshBasicMaterial())
scene.add(debugSun)

const updateSun = () => {
  sunDirection.setFromSpherical(sun)
  debugSun.position.copy(sunDirection).multiplyScalar(5)
  // 位置乘5，离的更远
  if (material) material.uniforms.usunDirection.value.copy(sunDirection)
  if (atmosphereMaterial) atmosphereMaterial.uniforms.usunDirection.value.copy(sunDirection)
}
updateSun()

gui.addColor(earthParameters, 'atmosphereDayColor').onChange(() => {
    material.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
  })
gui.addColor(earthParameters, 'atmosphereTwilightColor').onChange(() => {
    material.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
    atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
  })

gui.add(sun, "phi").min(0).max(Math.PI).onChange(updateSun);
gui.add(sun, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);
</script>

```

