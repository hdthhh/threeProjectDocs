const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/index.BeDOEDqp.js","assets/chunks/three.module.Bw-VuLTn.js"])))=>i.map(i=>d[i]);
import{_ as $,p as V,Z as X,s as J,o as N,c as z,j as D,G as Z,y as b,u as K,I as Q,J as M,w as Y,av as ss}from"./chunks/framework.BB2QZFaM.js";import{S as is,P as as,W as ns,b9 as ls,X as hs,A as ts,G as ks,n as ps,U as t,g as es,L as rs,y as Es,C as E,m as W,z as T,ba as os,bb as ds,h as _,al as gs,o as R}from"./chunks/three.module.Bw-VuLTn.js";import{O as Fs}from"./chunks/OrbitControls.DnynEjGF.js";import{G as ys}from"./chunks/GLTFLoader.CDa-noHW.js";import{D as cs}from"./chunks/DRACOLoader.BqtDfez1.js";import{g as Cs}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{R as us,C as q}from"./chunks/vanilla-307d3a93.esm.BVs5_9H4.js";import"./chunks/commonjsHelpers.CqkleIqs.js";var A=`vec3 permute(vec3 x) { return mod(((x*44.0)+1.0)*x, 299.0); }

float simplexNoise2d(vec2 v)
{
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 299.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}`;const Bs={__name:"sixtyfourFile",setup(O){const p=b(null),C=b(null),a=new is,r=new as(35,window.innerWidth/window.innerHeight,.1,1e3),n=new ns({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});n.setSize(window.innerWidth,window.innerHeight),n.shadowMap.enabled=!0,n.shadowMap.type=ls,n.toneMapping=hs,n.toneMappingExposure=1,n.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const g=new ts(100);a.add(g);const o=new ks(100,100);o.material.opacity=.2,o.material.transparent=!0,a.add(o);const u=new Fs(r,n.domElement);u.enableDamping=!0,u.dampingFactor=.01,r.position.set(-10,6,-2);let F=null,h=null;V(async()=>{p.value.appendChild(n.domElement),x(),h=new Cs({container:C.value}),L(),F=()=>{n.setSize(p.value.offsetWidth,p.value.offsetHeight),n.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),r.aspect=p.value.offsetWidth/p.value.offsetHeight,r.updateProjectionMatrix()},F(),window.addEventListener("resize",F);const{SUBTRACTION:i,Brush:e,Evaluator:m}=await X(async()=>{const{SUBTRACTION:v,Brush:f,Evaluator:P}=await import("./chunks/index.BeDOEDqp.js");return{SUBTRACTION:v,Brush:f,Evaluator:P}},__vite__mapDeps([0,1]));I(i,e,m)}),J(()=>{h.destroy(),cancelAnimationFrame(w),a.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&(Array.isArray(i.material)?i.material.forEach(e=>e.dispose()):i.material.dispose()),i.texture&&i.texture.dispose()}),a.clear(),n.forceContextLoss(),window.removeEventListener("resize",F)});let w;const H=new ps;function x(){const i=H.getElapsedTime();l.uTime.value=i,u.update(),w=requestAnimationFrame(x),n.render(a,r)}new es;const G=new ys,S=new cs;S.setDecoderPath("/threeProjectDocs/draco/"),G.setDRACOLoader(S),new us().load("/threeProjectDocs/spruit_sunrise.hdr",i=>{i.mapping=rs,a.background=i,a.backgroundBlurriness=.5,a.environment=i});const k=new Es("#ffffff",2);k.position.set(6.25,3,4),k.castShadow=!0,k.shadow.mapSize.set(1024,1024),k.shadow.camera.near=.1,k.shadow.camera.far=30,k.shadow.camera.top=8,k.shadow.camera.right=8,k.shadow.camera.bottom=-8,k.shadow.camera.left=-8,a.add(k);const s={};s.colorWaterDeep="#002b3d",s.colorWaterSurface="#66a8ff",s.colorSand="#ffe894",s.colorGrass="#85d534",s.colorSnow="#ffffff",s.colorRock="#bfbd8d";const l={uPositionFrequency:new t(.2),uStrength:new t(2),uWarpFrequency:new t(5),uWarpStrength:new t(.5),uTime:new t(0),uColorWaterDeep:new t(new E(s.colorWaterDeep)),uColorWaterSurface:new t(new E(s.colorWaterSurface)),uColorSand:new t(new E(s.colorSand)),uColorGrass:new t(new E(s.colorGrass)),uColorSnow:new t(new E(s.colorSnow)),uColorRock:new t(new E(s.colorRock))};function L(){h.add(l.uPositionFrequency,"value",0,1,.001).name("uPositionFrequency"),h.add(l.uStrength,"value",0,10,.001).name("uStrength"),h.add(l.uWarpFrequency,"value",0,10,.001).name("uWarpFrequency"),h.add(l.uWarpStrength,"value",0,1,.001).name("uWarpStrength"),h.addColor(s,"colorWaterDeep").onChange(()=>l.uColorWaterDeep.value.set(s.colorWaterDeep)),h.addColor(s,"colorWaterSurface").onChange(()=>l.uColorWaterSurface.value.set(s.colorWaterSurface)),h.addColor(s,"colorSand").onChange(()=>l.uColorSand.value.set(s.colorSand)),h.addColor(s,"colorGrass").onChange(()=>l.uColorGrass.value.set(s.colorGrass)),h.addColor(s,"colorSnow").onChange(()=>l.uColorSnow.value.set(s.colorSnow)),h.addColor(s,"colorRock").onChange(()=>l.uColorRock.value.set(s.colorRock))}const y=new W(10,10,500,500);y.deleteAttribute("uv"),y.deleteAttribute("normal"),y.rotateX(-Math.PI*.5);const U=new q({baseMaterial:T,vertexShader:`
  uniform float uPositionFrequency;
  uniform float uStrength;
  uniform float uWarpFrequency;
  uniform float uWarpStrength;
  uniform float uTime;

  varying vec3 vPosition;
  varying float vUpDot;

  ${A}

  float getElevation(vec2 position){
    // float uPositionFrequency = 0.2;
    // float uStrength = 2.0;
    // float uWarpFrequency =5.0;
    // float uWarpStrength =0.5;

    vec2 warpedPosition= position;
    warpedPosition+=uTime*0.2;
    warpedPosition+=simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency)* uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;
    float elevationSign = sign(elevation);
    // elevation = pow(elevation,2.0);
    // elevation = pow(elevation,2.0)*elevationSign;
    elevation = pow(abs(elevation),2.0)*elevationSign;
    elevation*=uStrength;
    
    return elevation;
  }

  void main(){
    // Neighbours positions
    float shift =0.01;
    vec3 positionA = position + vec3(shift,0.0,0.0);
    vec3 positionB = position + vec3(0.0,0.0,-shift);

    // Elevation
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y+=elevation;
    positionA.y= getElevation(positionA.xz);
    positionB.y= getElevation(positionB.xz);

    // Compute normal
    vec3 toA =normalize(positionA-csm_Position);
    vec3 toB =normalize(positionB-csm_Position);
    csm_Normal = cross(toA,toB);

    vPosition=csm_Position;
    vPosition.xz+=uTime*0.2;
    vUpDot = dot(csm_Normal,vec3(0.0,1.0,0.0));
  }`,fragmentShader:`
  uniform vec3 uColorWaterDeep;
  uniform vec3 uColorWaterSurface;
  uniform vec3 uColorSand;
  uniform vec3 uColorGrass;
  uniform vec3 uColorSnow;
  uniform vec3 uColorRock;

  varying vec3 vPosition;
  varying float vUpDot;

  ${A}

  void main(){
    // Color
    vec3 color = vec3(1.0);

    // Water
    float surfaceWaterMix = smoothstep(-1.0,-0.1, vPosition.y);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // Sand
    float sandMix=step(-0.1,vPosition.y);
    color=mix(color, uColorSand,sandMix);

    // Grass
    float grassMix=step(-0.06,vPosition.y);
    color=mix(color, uColorGrass,grassMix);

    // Rock
    float  rockMix= vUpDot;
    rockMix=1.0-step(0.8,rockMix);
    rockMix*=step(-0.06,vPosition.y);
    color =mix(color, uColorRock,rockMix);

    // Snow
    float snowThreshold = 0.45;
    snowThreshold +=simplexNoise2d(vPosition.xz*15.0)* 0.1;
    float snowMix=step(snowThreshold, vPosition.y);
    color =mix(color, uColorSnow,snowMix);

    // Final color
    csm_DiffuseColor=vec4(color,1.0);
  }`,uniforms:l,silent:!0,metalness:0,roughness:.5,color:"#85d534"}),j=new q({baseMaterial:ds,vertexShader:`
  uniform float uPositionFrequency;
  uniform float uStrength;
  uniform float uWarpFrequency;
  uniform float uWarpStrength;
  uniform float uTime;

  ${A}

  float getElevation(vec2 position){
    // float uPositionFrequency = 0.2;
    // float uStrength = 2.0;
    // float uWarpFrequency =5.0;
    // float uWarpStrength =0.5;

    vec2 warpedPosition= position;
    warpedPosition+=uTime*0.2;
    warpedPosition+=simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency)* uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;
    float elevationSign = sign(elevation);
    // elevation = pow(elevation,2.0);
    // elevation = pow(elevation,2.0)*elevationSign;
    elevation = pow(abs(elevation),2.0)*elevationSign;
    elevation*=uStrength;
    
    return elevation;
  }

  void main(){
    // Neighbours positions
    float shift =0.01;
    vec3 positionA = position + vec3(shift,0.0,0.0);
    vec3 positionB = position + vec3(0.0,0.0,-shift);

    // Elevation
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y+=elevation;
    positionA.y= getElevation(positionA.xz);
    positionB.y= getElevation(positionB.xz);

    // Compute normal
    vec3 toA =normalize(positionA-csm_Position);
    vec3 toB =normalize(positionB-csm_Position);
    csm_Normal = cross(toA,toB);
  }`,uniforms:l,silent:!0,depthPacking:os}),c=new _(y,U);c.customDepthMaterial=j,c.castShadow=!0,c.receiveShadow=!0,a.add(c);const B=new _(new W(10,10,1,1),new gs({transmission:1,roughness:.3}));B.rotation.x=-Math.PI*.5,B.position.y=-.1,a.add(B);function I(i,e,m){const v=new e(new R(11,2,11)),f=new e(new R(10,2.1,10)),d=new m().evaluate(v,f,i);d.geometry.clearGroups(),d.material=new T({color:"#ffffff",metalness:0,roughness:.3}),d.castShadow=!0,d.receiveShadow=!0,a.add(d)}return(i,e)=>(N(),z(Z,null,[D("div",{ref_key:"ddd",ref:p,style:{width:"100%",height:"100%"}},null,512),D("div",{id:"aaa",ref_key:"a",ref:C},null,512)],64))}},ms=$(Bs,[["__scopeId","data-v-cb693922"]]),vs={style:{height:"500px",width:"100%"}},Ts=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"sixtyfourFile.md","filePath":"sixtyfourFile.md"}'),fs={name:"sixtyfourFile.md"},_s=Object.assign(fs,{setup(O){const{site:p,theme:C,page:a,frontmatter:r}=K();return(n,g)=>{const o=Q("ClientOnly");return N(),z("div",null,[D("div",vs,[M(o,null,{default:Y(()=>[M(ms)]),_:1})]),g[0]||(g[0]=ss("",3))])}}});export{Ts as __pageData,_s as default};
