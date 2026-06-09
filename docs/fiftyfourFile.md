---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftyfourFile.vue'
// import exampleSource from '../docs/components/fiftyfourFile.vue?raw'


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

  juan.rotation.x = -elapsedTime * 0.5
  juan.rotation.y = elapsedTime * 0.5
  if (suzanne) {
    suzanne.rotation.x = -elapsedTime * 0.5
    suzanne.rotation.y = elapsedTime * 0.5
  }
}
    
const material = new THREE.ShaderMaterial({
  vertexShader: `
  varying vec3 uNormal;
  varying vec3 uPosition;
  void main(){
    vec4  modelPosition = modelMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // 当顶点移动时，不希望法线跟着变化，阻止平移等应用到法线上
    vec4 modelNormal = modelMatrix*vec4(normal,0.0);// 后面是非齐次向量

    // uNormal = normal;
    uNormal = modelNormal.xyz;
    uPosition = modelPosition.xyz;
  }`,
  fragmentShader: `
  uniform vec3 uColor;
  varying vec3 uNormal;
  varying vec3 uPosition;
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
  void main(){
    vec3 viewDirection=normalize(uPosition-cameraPosition);// 视图方向

    vec3 color=uColor;

    vec3 light=vec3(0.0);
    light+=AmbientLight(vec3(1.0),0.03);
    light+=DirectionalLight(vec3(0.1,0.1,1.0),1.0,normalize(uNormal),vec3(0.0,0.0,3.0),viewDirection,10.0);
    light+=PointLight(vec3(1.0,0.1,0.1),1.0,normalize(uNormal),vec3(0.0,2.5,0.0),viewDirection,20.0,uPosition,0.05);
    color*=light;//光和颜色作用，照在物体上

    gl_FragColor=vec4(color,1.0);
  }`,
  uniforms: {
    uColor: { value: new THREE.Color(0.1, 0.1, 1.0) }
  }
})

const qiu = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material)
const juan = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.4, 100, 20), material)
juan.position.set(2, 0, 0)
scene.add(qiu, juan)

let suzanne = null
loader.load('/threeProjectDocs/suzanne.glb', (gltf) => {
  console.log(gltf)
  gltf.scene.children.forEach(obj => {
    if (!obj.isMesh || !obj.material) return
    obj.material = material
  })
  gltf.scene.position.set(-2, 0, 0)
  // gltf.scene.scale.set(2, 2, 2)
  suzanne = gltf.scene
  scene.add(gltf.scene)
})

const directionalLightHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide
  })
)
directionalLightHelper.position.set(0, 0.0, 3)
directionalLightHelper.material.color.setRGB(0.1, 0.1, 1.0)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.1, 2),
  new THREE.MeshBasicMaterial()
)
pointLightHelper.position.set(0.0, 2.5, 0.0)
pointLightHelper.material.color.setRGB(1.0, 0.1, 0.1)
scene.add(pointLightHelper)

gui.addColor(material.uniforms.uColor, 'value',)
</script>

```

