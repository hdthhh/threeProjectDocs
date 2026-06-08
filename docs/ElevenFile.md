---
outline: deep
---

<script setup>
import { useData } from 'vitepress'
import example from '../docs/components/ElevenFile.vue'
// import exampleSource from '../docs/components/ElevenFile.vue?raw'


const { site, theme, page, frontmatter } = useData()

</script>

<div style="height:500px;width:100%;">
   <ClientOnly><example></example></ClientOnly>
</div>

## code
```vue
<script setup>
const EARTH_YEAR = (2 * Math.PI) / 365;
function animate() {
  sun.rotation.y += 0.001;

  planetsMap.get('mercury').rotation.y += EARTH_YEAR * 4;
  planetsMap.get('venus').rotation.y += EARTH_YEAR * 2;
  planetsMap.get('earth').rotation.y += EARTH_YEAR;
  planetsMap.get('mars').rotation.y += EARTH_YEAR / 2;
  planetsMap.get('jupiter').rotation.y += EARTH_YEAR / 4;
  planetsMap.get('saturn').rotation.y += EARTH_YEAR / 8;
  planetsMap.get('uranus').rotation.y += EARTH_YEAR / 16;
  planetsMap.get('neptune').rotation.y += EARTH_YEAR / 32;

  OrbitControl.update()
  requestAnimationFrame(animate);
  render.render(scene, camera);
}


const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
const pointLight = new THREE.PointLight(0xffffff, 1);

pointLight.position.set(0, 0, 0);

scene.add(ambientLight, pointLight);


const starsCoords = [];

for (let i = 0; i < 10000; i++) {
  const x = THREE.MathUtils.randFloatSpread(1000);
  const y = THREE.MathUtils.randFloatSpread(1000);
  const z = THREE.MathUtils.randFloatSpread(1000);

  starsCoords.push(x, y, z);
}
const starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsCoords, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);


class ObjectGroup {
  constructor(index, title, radius, extra) {
    const objectGroup = new THREE.Group();

    if (extra) {
      switch (title) {
        case 'earth':
          extra.position.x += 8 * index + 2.5;

          break;
        case 'saturn':
          extra.position.x += 8 * index;
          extra.rotation.x = 2;

          break;
      }

      objectGroup.add(extra);
    }

    const planet = ObjectGroup.createObject(title, new THREE.SphereGeometry(radius, 64, 32));

    planet.position.x += 8 * index;
    objectGroup.add(planet);

    return objectGroup;
  }

  static createObject = (title, objectGeometry) => {
    const objectTexture = new THREE.TextureLoader().load(new URL(`/components/assets/planet/${title}.jpg`, import.meta.url).href);
    const objectMaterial = new THREE.MeshPhongMaterial({ map: objectTexture });
    const objectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

    return objectMesh;
  };
}

const sun = ObjectGroup.createObject('sun', new THREE.SphereGeometry(11, 64, 32));
scene.add(sun);


const planets = [
  { title: 'mercury', radius: 1 },
  { title: 'venus', radius: 2 },
  {
    title: 'earth',
    radius: 2,
    extra: ObjectGroup.createObject('moon', new THREE.SphereGeometry(0.5, 64, 32))
  },
  { title: 'mars', radius: 1 },
  { title: 'jupiter', radius: 5 },
  {
    title: 'saturn',
    radius: 4,
    extra: ObjectGroup.createObject('saturn_rings', new THREE.TorusGeometry(6, 1, 2, 32))
  },
  { title: 'uranus', radius: 3 },
  { title: 'neptune', radius: 3 }
];

const planetsMap = new Map();
for (let [index, { title, radius, extra }] of planets.entries()) {
  const planetGroup = new ObjectGroup(index + 1, title, radius, extra);

  planetsMap.set(title, planetGroup);
  sun.add(planetGroup);
}
</script>

```


