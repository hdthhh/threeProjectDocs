---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/fiftyeightFile.vue'
// import exampleSource from '../docs/components/fiftyeightFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
// float distanceToCenter = distance(uv,vec2(0.5));
    float distanceToCenter = length(uv-vec2(0.5));
    if(distanceToCenter > 0.5) discard;

    gl_FragColor=vec4(vec3(vColor),1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  ,
  uniforms: {
    uResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth * Math.min(window.devicePixelRatio, 2), window.innerHeight * Math.min(window.devicePixelRatio, 2))),
    uPictureTexture: new THREE.Uniform(textureLoader.load(picture)),
    uDisplacementTexture: new THREE.Uniform(displacement.texture),
  },


const geometry = new THREE.PlaneGeometry(10, 10, 128, 128)
geometry.setIndex(null)
geometry.deleteAttribute('normal')
const particles = new THREE.Points(geometry, material)
scene.add(particles)

const intensitiesArray =new Float32Array(geometry.attributes.position.count)
const angleArray = new Float32Array(geometry.attributes.position.count)
for (let i = 0; i < geometry.attributes.position.count; i++){
  intensitiesArray[i] = Math.random()
  angleArray[i]= Math.random()*Math.PI*2
}
geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitiesArray, 1))
geometry.setAttribute('aAngle', new THREE.BufferAttribute(angleArray,1))
</script>

```


