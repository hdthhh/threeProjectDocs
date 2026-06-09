import{_ as R,p as H,s as L,o as M,c as S,j as u,G as U,y as x,u as j,I as N,J as w,w as O,av as G}from"./chunks/framework.BB2QZFaM.js";import{S as I,P as V,W as Y,A as Z,G as X,n as $,U as l,g as J,L as K,I as Q,C as _,al as ss,bf as is,bg as as,h as P,m as ns,z as hs,y as ks}from"./chunks/three.module.D5qQolFO.js";import{O as ls}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as ps,m as ts}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as es}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as Es}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{R as rs,C as T}from"./chunks/vanilla-307d3a93.esm.BWZLLCvU.js";import{s as ds}from"./chunks/simplexNoise4d.CPIm_TBs.js";import"./chunks/commonjsHelpers.CqkleIqs.js";const gs={__name:"sixtytwoFile",setup(W){const e=x(null),C=x(null),a=new I,E=new V(75,window.innerWidth/window.innerHeight,.1,1e3),h=new Y({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});h.setSize(window.innerWidth,window.innerHeight),h.shadowMap.enabled=!0,h.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const F=new Z(100);a.add(F);const d=new X(100,100);d.material.opacity=.2,d.material.transparent=!0,a.add(d);const B=new ls(E,h.domElement);B.enableDamping=!0,B.dampingFactor=.01,E.position.set(13,-3,-5);let o=null,i=null;H(()=>{e.value.appendChild(h.domElement),A(),i=new Es({container:C.value}),z(),o=()=>{h.setSize(e.value.offsetWidth,e.value.offsetHeight),h.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),E.aspect=e.value.offsetWidth/e.value.offsetHeight,E.updateProjectionMatrix()},o(),window.addEventListener("resize",o)}),L(()=>{i.destroy(),cancelAnimationFrame(m),a.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(k=>k.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),a.clear(),h.forceContextLoss(),window.removeEventListener("resize",o)});let m;const q=new $;function A(){const s=q.getElapsedTime();n.uTime.value=s,B.update(),m=requestAnimationFrame(A),h.render(a,E)}new J;const D=new ps,v=new es;v.setDecoderPath("/threeProjectDocs/draco/"),D.setDRACOLoader(v),new rs().load("/threeProjectDocs/urban_alley_01_1k.hdr",s=>{s.mapping=K,a.background=s,a.environment=s});let g=new Q(2.5,50);g=ts(g),g.computeTangents(),console.log(g.attributes);let p={};p.colorA="#0000ff",p.colorB="#ff0000";const n={uTime:new l(0),uPositionFrequency:new l(.5),uTimeFrequency:new l(.4),uStrength:new l(.3),uWrapPositionFrequency:new l(.38),uWrapTimeFrequency:new l(.12),uWrapStrength:new l(1.7),uColorA:new l(new _(p.colorA)),uColorB:new l(new _(p.colorB))},f=`
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

 ${ds}

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
}`,t=new T({baseMaterial:ss,vertexShader:f,fragmentShader:`
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
  }`,uniforms:n,silent:!0,metalness:0,roughness:.5,color:"#ffffff",transmission:0,ior:1.5,thickness:1.5,transparent:!0,wireframe:!1}),b=new T({baseMaterial:as,vertexShader:f,uniforms:n,silent:!0,depthPacking:is}),c=new P(g,t);c.customDepthMaterial=b,c.receiveShadow=!0,c.castShadow=!0,a.add(c),D.load("/threeProjectDocs/suzanne2.glb",s=>{const k=s.scene.children[0];k.receiveShadow=!0,k.castShadow=!0,k.material=t,k.customDepthMaterial=b,k.position.x=5,a.add(k)});const y=new P(new ns(15,15,15),new hs);y.receiveShadow=!0,y.rotation.y=Math.PI,y.position.y=-5,y.position.z=5,a.add(y);const r=new ks("#ffffff",3);r.castShadow=!0,r.shadow.mapSize.set(1024,1024),r.shadow.camera.far=15,r.shadow.normalBias=.05,r.position.set(.25,2,-2.25),a.add(r);function z(){i.add(n.uPositionFrequency,"value",0,2,.001).name("uPositionFrequency"),i.add(n.uTimeFrequency,"value",0,2,.001).name("uTimeFrequency"),i.add(n.uStrength,"value",0,2,.001).name("uStrength"),i.add(n.uWrapPositionFrequency,"value",0,2,.001).name("uWrapPositionFrequency"),i.add(n.uWrapTimeFrequency,"value",0,2,.001).name("uWrapTimeFrequency"),i.add(n.uWrapStrength,"value",0,2,.001).name("uWrapStrength"),i.addColor(p,"colorA").onChange(()=>{n.uColorA.value.set(p.colorA)}),i.addColor(p,"colorB").onChange(()=>{n.uColorB.value.set(p.colorB)}),i.add(t,"metalness",0,1,.001),i.add(t,"roughness",0,1,.001),i.add(t,"transmission",0,1,.001),i.add(t,"ior",0,10,.001),i.add(t,"thickness",0,10,.001),i.addColor(t,"color")}return(s,k)=>(M(),S(U,null,[u("div",{ref_key:"ddd",ref:e,style:{width:"100%",height:"100%"}},null,512),u("div",{id:"aaa",ref_key:"a",ref:C},null,512)],64))}},ys=R(gs,[["__scopeId","data-v-0c9d9993"]]),Fs={style:{height:"500px",width:"100%"}},xs=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"sixtytwoFile.md","filePath":"sixtytwoFile.md"}'),os={name:"sixtytwoFile.md"},ws=Object.assign(os,{setup(W){const{site:e,theme:C,page:a,frontmatter:E}=j();return(h,F)=>{const d=N("ClientOnly");return M(),S("div",null,[u("div",Fs,[w(d,null,{default:O(()=>[w(ys)]),_:1})]),F[0]||(F[0]=G("",3))])}}});export{xs as __pageData,ws as default};
