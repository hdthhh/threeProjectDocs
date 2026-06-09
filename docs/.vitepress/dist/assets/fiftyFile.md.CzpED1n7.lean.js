import{_ as w,p as _,s as b,o as B,c as f,j as F,G as D,y as v,u as q,I as T,J as u,w as A,av as I}from"./chunks/framework.BB2QZFaM.js";import{S as M,P as O,W as H,A as R,G as j,n as G,j as L,g as V,m as N,C as m,V as J,h as U}from"./chunks/three.module.D5qQolFO.js";import{O as $}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as K}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as Q}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as X}from"./chunks/lil-gui.module.min.DqZR5HPe.js";const Y={__name:"fiftyFile",setup(x){const e=v(null),E=v(null),t=new M,h=new O(75,window.innerWidth/window.innerHeight,.1,1e3),n=new H({antialias:!0});n.setSize(window.innerWidth,window.innerHeight),n.shadowMap.enabled=!0;const k=new R(100);t.add(k);const p=new j(100,100);p.material.opacity=.2,p.material.transparent=!0,t.add(p);const g=new $(h,n.domElement);g.enableDamping=!0,g.dampingFactor=.01,h.position.set(3,3,3);let r=null,s,y;_(()=>{s=new X({container:E.value}),e.value.appendChild(n.domElement),o(),W(),r=()=>{n.setSize(e.value.offsetWidth,e.value.offsetHeight),n.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),h.aspect=e.value.offsetWidth/e.value.offsetHeight,h.updateProjectionMatrix()},r(),window.addEventListener("resize",r)}),b(()=>{s.destroy(),cancelAnimationFrame(y),t.traverse(a=>{a.geometry&&a.geometry.dispose(),a.material&&(Array.isArray(a.material)?a.material.forEach(C=>C.dispose()):a.material.dispose()),a.texture&&a.texture.dispose()}),t.clear(),n.forceContextLoss(),window.removeEventListener("resize",r)});const z=new G;function o(){const a=z.getElapsedTime();i.uniforms.uTime.value=a,g.update(),y=requestAnimationFrame(o),n.render(t,h)}new V;const P=new K,c=new Q;c.setDecoderPath("/draco/"),P.setDRACOLoader(c);let l={};l.depthColor="#3290c3",l.sufaceColor="#9bd8ff";const S=new N(2,2,512,512),i=new L({vertexShader:`
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;
  uniform float uTime;
  uniform float uBigWavesSpeed;

  uniform float uSmallWavesElevation;
  uniform float uSmallWavesFrequency;
  uniform float uSmallWavesSpeed;
  uniform float uSmallWavesIterations;

  varying float vElevation;


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

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position ,1.0);
    float elevation=sin(modelPosition.x*uBigWavesFrequency.x+uTime*uBigWavesSpeed)*sin(modelPosition.z*uBigWavesFrequency.y+uTime*uBigWavesSpeed)*uBigWavesElevation;
    // elevation-=abs(cnoise(vec3(modelPosition.xz*3.0,uTime*0.2))*0.15);
    // for(float i=1.0;i<=4.0;i++){
    //   elevation-=abs(cnoise(vec3(modelPosition.xz*3.0*i,uTime*0.2))*0.15/i);
    // }
    for(float i=1.0;i<=uSmallWavesIterations;i++){
      elevation-=abs(cnoise(vec3(modelPosition.xz*uSmallWavesFrequency*i,uTime*uSmallWavesSpeed))*uSmallWavesElevation/i);
    }
    modelPosition.y+=elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectPosition = projectionMatrix * viewPosition;
    gl_Position = projectPosition;

    vElevation=elevation;
  }`,fragmentShader:`
  uniform vec3 uDepthColor;
  uniform vec3 uSufaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;

  varying float vElevation;

  void main(){
    float mixStrength=(vElevation+uColorOffset)*uColorMultiplier;
    vec3 color =mix(uDepthColor,uSufaceColor,mixStrength);
    gl_FragColor=vec4(color,1.0);
  }`,uniforms:{uBigWavesElevation:{value:.2},uBigWavesFrequency:{value:new J(4,1.5)},uTime:{value:1},uBigWavesSpeed:{value:.75},uDepthColor:{value:new m(l.depthColor)},uSufaceColor:{value:new m(l.sufaceColor)},uColorOffset:{value:.08},uColorMultiplier:{value:5},uSmallWavesElevation:{value:.15},uSmallWavesFrequency:{value:3},uSmallWavesSpeed:{value:.2},uSmallWavesIterations:{value:4}}}),d=new U(S,i);d.position.set(0,0,0),d.rotation.x=-Math.PI*.5,t.add(d);function W(){s.add(i.uniforms.uBigWavesElevation,"value").min(0).max(1).step(.01).name("uBigWavesElevation"),s.add(i.uniforms.uBigWavesFrequency.value,"x").min(0).max(10).step(.01).name("uBigWavesFrequency-x"),s.add(i.uniforms.uBigWavesFrequency.value,"y").min(0).max(10).step(.01).name("uBigWavesFrequency-y"),s.add(i.uniforms.uBigWavesSpeed,"value").min(0).max(5).step(.01).name("uBigWavesSpeed-y"),s.addColor(l,"depthColor").name("depthColor").onChange(()=>{i.uniforms.uDepthColor.value.set(l.depthColor)}),s.addColor(l,"sufaceColor").name("sufaceColor").onChange(()=>{i.uniforms.uSufaceColor.value.set(l.sufaceColor)}),s.add(i.uniforms.uColorOffset,"value").min(0).max(1).step(.01).name("uColorOffset"),s.add(i.uniforms.uColorMultiplier,"value").min(0).max(10).step(.01).name("uColorMultiplier"),s.add(i.uniforms.uSmallWavesElevation,"value").min(0).max(1).step(.01).name("uSmallWavesElevation"),s.add(i.uniforms.uSmallWavesFrequency,"value").min(0).max(10).step(.01).name("uSmallWavesFrequency"),s.add(i.uniforms.uSmallWavesSpeed,"value").min(0).max(5).step(.01).name("uSmallWavesSpeed"),s.add(i.uniforms.uSmallWavesIterations,"value").min(0).max(10).step(1).name("uSmallWavesIterations")}return(a,C)=>(B(),f(D,null,[F("div",{ref_key:"ddd",ref:e,style:{width:"100%",height:"100%"}},null,512),F("div",{id:"aaa",ref_key:"a",ref:E},null,512)],64))}},Z=w(Y,[["__scopeId","data-v-1ea616fc"]]),ss={style:{height:"500px",width:"100%",position:"relative"}},ps=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftyFile.md","filePath":"fiftyFile.md"}'),is={name:"fiftyFile.md"},ks=Object.assign(is,{setup(x){const{site:e,theme:E,page:t,frontmatter:h}=q();return(n,k)=>{const p=T("ClientOnly");return B(),f("div",null,[F("div",ss,[u(p,null,{default:A(()=>[u(Z)]),_:1})]),k[0]||(k[0]=I("",2))])}}});export{ps as __pageData,ks as default};
