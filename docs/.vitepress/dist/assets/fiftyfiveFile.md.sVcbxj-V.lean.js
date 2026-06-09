import{_ as D,p as S,s as w,o as B,c as f,j as y,G as W,y as C,u as _,I as b,J as u,w as T,av as q}from"./chunks/framework.BB2QZFaM.js";import{S as I,P as O,W as M,A as N,G as R,n as L,j,g as H,m as G,C as m,V,h as $}from"./chunks/three.module.D5qQolFO.js";import{O as J}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as U}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as K}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as Q}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{l as X}from"./chunks/light.D0Mks8HV.js";const Y={__name:"fiftyfiveFile",setup(x){const h=C(null),r=C(null),t=new I,e=new O(75,window.innerWidth/window.innerHeight,.1,1e3),n=new M({antialias:!0});n.setSize(window.innerWidth,window.innerHeight),n.shadowMap.enabled=!0;const p=new N(100);t.add(p);const k=new R(100,100);k.material.opacity=.2,k.material.transparent=!0,t.add(k);const g=new J(e,n.domElement);g.enableDamping=!0,g.dampingFactor=.01,e.position.set(3,3,3);let E=null,s;S(()=>{s=new Q({container:r.value}),h.value.appendChild(n.domElement),o(),A(),E=()=>{n.setSize(h.value.offsetWidth,h.value.offsetHeight),n.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),e.aspect=h.value.offsetWidth/h.value.offsetHeight,e.updateProjectionMatrix()},E(),window.addEventListener("resize",E)}),w(()=>{s.destroy(),cancelAnimationFrame(animationId),t.traverse(a=>{a.geometry&&a.geometry.dispose(),a.material&&(Array.isArray(a.material)?a.material.forEach(v=>v.dispose()):a.material.dispose()),a.texture&&a.texture.dispose()}),t.clear(),n.forceContextLoss(),window.removeEventListener("resize",E)});const P=new L;function o(){const a=P.getElapsedTime();i.uniforms.uTime.value=a,g.update(),requestAnimationFrame(o),n.render(t,e)}new H;const z=new U,c=new K;c.setDecoderPath("/draco/"),z.setDRACOLoader(c);let l={};l.depthColor="#ff4000",l.sufaceColor="#151c37";const d=new G(2,2,512,512);d.deleteAttribute("noraml"),d.deleteAttribute("uv");const i=new j({vertexShader:`
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;
  uniform float uTime;
  uniform float uBigWavesSpeed;

  uniform float uSmallWavesElevation;
  uniform float uSmallWavesFrequency;
  uniform float uSmallWavesSpeed;
  uniform float uSmallWavesIterations;

  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;


  //	Classic Perlin 3D Noise 经典柏林噪音
  //	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
  //  https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  float waveElevation(vec3 position){
    float elevation=sin(position.x*uBigWavesFrequency.x+uTime*uBigWavesSpeed)
                    *sin(position.z*uBigWavesFrequency.y+uTime*uBigWavesSpeed)*uBigWavesElevation;
    // elevation-=abs(cnoise(vec3(position.xz*3.0,uTime*0.2))*0.15);
    // for(float i=1.0;i<=4.0;i++){
    //   elevation-=abs(cnoise(vec3(position.xz*3.0*i,uTime*0.2))*0.15/i);
    // }
    for(float i=1.0;i<=uSmallWavesIterations;i++){
      elevation-=abs(cnoise(vec3(position.xz*uSmallWavesFrequency*i,uTime*uSmallWavesSpeed))*uSmallWavesElevation/i);
    }
    return elevation;
  }

  void main(){
    float shift=0.01;// 相邻点
    vec4 modelPosition = modelMatrix * vec4(position ,1.0);
    vec3 modelPositionA=modelPosition.xyz;
    modelPositionA.x+=shift;
    vec3 modelPositionB=modelPosition.xyz;
    modelPositionB.z-=shift;
    float elevation=waveElevation(modelPosition.xyz);
    modelPosition.y+=elevation;
    modelPositionA.y+=waveElevation(modelPositionA);
    modelPositionB.y+=waveElevation(modelPositionB);
    vec3 toA=normalize(modelPositionA-modelPosition.xyz);
    vec3 toB=normalize(modelPositionB-modelPosition.xyz);
    vec3 computeNormal=cross(toA,toB);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * viewPosition;
    gl_Position = projectPosition;

    vElevation=elevation;
    // vNormal=(modelMatrix*vec4(normal, 0.0)).xyz;
    vNormal=computeNormal;
    vPosition=modelPosition.xyz;
  }`,fragmentShader:`
  uniform vec3 uDepthColor;
  uniform vec3 uSufaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;

  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // light glsl
  ${X}

  void main(){
    vec3 normal=normalize(vNormal);
    vec3 viewDirection=normalize(vPosition-cameraPosition);

    vec3 light=vec3(0.0);
    light+=PointLight(vec3(1.0),1.0,normal,vec3(0.0,0.25,0.0),viewDirection,30.0,vPosition,0.95);

    float mixStrength=(vElevation+uColorOffset)*uColorMultiplier;
    mixStrength=smoothstep(0.0,1.0,mixStrength);// 混合效果增强
    vec3 color =mix(uDepthColor,uSufaceColor,mixStrength);
    color*=light;
    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{uBigWavesElevation:{value:.2},uBigWavesFrequency:{value:new V(4,1.5)},uTime:{value:1},uBigWavesSpeed:{value:.75},uDepthColor:{value:new m(l.depthColor)},uSufaceColor:{value:new m(l.sufaceColor)},uColorOffset:{value:.925},uColorMultiplier:{value:1},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uSmallWavesIterations:{value:4}}}),F=new $(d,i);F.position.set(0,0,0),F.rotation.x=-Math.PI*.5,t.add(F);function A(){s.add(i.uniforms.uBigWavesElevation,"value").min(0).max(1).step(.01).name("uBigWavesElevation"),s.add(i.uniforms.uBigWavesFrequency.value,"x").min(0).max(10).step(.01).name("uBigWavesFrequency-x"),s.add(i.uniforms.uBigWavesFrequency.value,"y").min(0).max(10).step(.01).name("uBigWavesFrequency-y"),s.add(i.uniforms.uBigWavesSpeed,"value").min(0).max(5).step(.01).name("uBigWavesSpeed-y"),s.addColor(l,"depthColor").name("depthColor").onChange(()=>{i.uniforms.uDepthColor.value.set(l.depthColor)}),s.addColor(l,"sufaceColor").name("sufaceColor").onChange(()=>{i.uniforms.uSufaceColor.value.set(l.sufaceColor)}),s.add(i.uniforms.uColorOffset,"value").min(0).max(1).step(.01).name("uColorOffset"),s.add(i.uniforms.uColorMultiplier,"value").min(0).max(10).step(.01).name("uColorMultiplier"),s.add(i.uniforms.uSmallWavesElevation,"value").min(0).max(1).step(.01).name("uSmallWavesElevation"),s.add(i.uniforms.uSmallWavesFrequency,"value").min(0).max(10).step(.01).name("uSmallWavesFrequency"),s.add(i.uniforms.uSmallWavesSpeed,"value").min(0).max(5).step(.01).name("uSmallWavesSpeed"),s.add(i.uniforms.uSmallWavesIterations,"value").min(0).max(10).step(1).name("uSmallWavesIterations")}return(a,v)=>(B(),f(W,null,[y("div",{ref_key:"ddd",ref:h,style:{width:"100%",height:"100%"}},null,512),y("div",{id:"aaa",ref_key:"a",ref:r},null,512)],64))}},Z=D(Y,[["__scopeId","data-v-5731f0fb"]]),ss={style:{height:"500px",width:"100%"}},ps=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftyfiveFile.md","filePath":"fiftyfiveFile.md"}'),is={name:"fiftyfiveFile.md"},Es=Object.assign(is,{setup(x){const{site:h,theme:r,page:t,frontmatter:e}=_();return(n,p)=>{const k=b("ClientOnly");return B(),f("div",null,[y("div",ss,[u(k,null,{default:T(()=>[u(Z)]),_:1})]),p[0]||(p[0]=q("",3))])}}});export{ps as __pageData,Es as default};
