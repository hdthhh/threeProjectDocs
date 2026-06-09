import{_ as R,p as T,s as H,o as S,c as _,j as o,G as I,y as A,u as z,I as G,J as D,w as O,av as V}from"./chunks/framework.BB2QZFaM.js";import{S as W,P as N,W as U,be as q,X as J,A as j,G as X,U as v,n as $,g as K,L as Q,z as F,D as Y,bf as Z,bg as ss,h as is,m as as,r as ns,y as ls}from"./chunks/three.module.D5qQolFO.js";import{O as hs}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as ts}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as es}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as ps}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{R as ks,C as w}from"./chunks/vanilla-307d3a93.esm.BWZLLCvU.js";import"./chunks/commonjsHelpers.CqkleIqs.js";const rs={__name:"sixtythreeFile",setup(M){const h=A(null),c=A(null),a=new W,t=new N(35,window.innerWidth/window.innerHeight,.1,1e3),i=new U({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});i.setSize(window.innerWidth,window.innerHeight),i.shadowMap.enabled=!0,i.shadowMap.type=q,i.toneMapping=J,i.toneMappingExposure=1,i.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const r=new j(100);a.add(r);const p=new X(100,100);p.material.opacity=.2,p.material.transparent=!0,a.add(p);const y=new hs(t,i.domElement);y.enableDamping=!0,y.dampingFactor=.01,t.position.set(-5,5,12);let E=null,d=null;T(()=>{h.value.appendChild(i.domElement),m(),d=new ps({container:c.value}),d.add(g.uSliceStart,"value",-Math.PI,Math.PI,.001).name("usliceStart"),d.add(g.uSliceArc,"value",0,Math.PI*2,.001).name("uSliceArc"),E=()=>{i.setSize(h.value.offsetWidth,h.value.offsetHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),t.aspect=h.value.offsetWidth/h.value.offsetHeight,t.updateProjectionMatrix()},E(),window.addEventListener("resize",E)}),H(()=>{d.destroy(),cancelAnimationFrame(C),a.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(l=>l.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),a.clear(),i.forceContextLoss(),window.removeEventListener("resize",E)});let C;const P=new $;function m(){const s=P.getElapsedTime();k&&(k.rotation.y=s*.1),y.update(),C=requestAnimationFrame(m),i.render(a,t)}new K;const B=new ts,u=new es;u.setDecoderPath("/threeProjectDocs/draco/"),B.setDRACOLoader(u),new ks().load("/threeProjectDocs/aerodynamics_workshop.hdr",s=>{s.mapping=Q,a.background=s,a.backgroundBlurriness=.5,a.environment=s});const g={uSliceStart:new v(1.75),uSliceArc:new v(1.25)},f={csm_Slice:{"#include <colorspace_fragment>":`
        #include <colorspace_fragment>
          
        if(!gl_FrontFacing)gl_FragColor=vec4(0.75,0.15,0.3,1.0);
      `}},x=new F({metalness:.5,roughness:.25,envMapIntensity:.5,color:"#858080"}),b=new w({baseMaterial:F,silent:!0,vertexShader:`
  varying vec3 vPosition;
  void main(){
    vPosition=csm_Position.xyz;
  }`,fragmentShader:`
  varying vec3 vPosition;
  uniform float uSliceStart;
  uniform float uSliceArc;
  void main(){

    float angle = atan(vPosition.y,vPosition.x);
    angle-=uSliceStart;
    angle=mod(angle,PI2);
    if(angle >0.0 && angle < uSliceArc)discard;

    // csm_FragColor=vec4(vec3(angle),1.0);
    // if(!gl_FrontFacing)csm_FragColor=vec4(0.75,0.15,0.3,1.0);
    float csm_Slice; //写属性名就可以激活
  }`,uniforms:g,patchMap:f,metalness:.5,roughness:.25,envMapIntensity:.5,color:"#858080",side:Y}),L=new w({baseMaterial:ss,silent:!0,vertexShader:`
  varying vec3 vPosition;
  void main(){
    vPosition=csm_Position.xyz;
  }`,fragmentShader:`
  varying vec3 vPosition;
  uniform float uSliceStart;
  uniform float uSliceArc;
  void main(){

    float angle = atan(vPosition.y,vPosition.x);
    angle-=uSliceStart;
    angle=mod(angle,PI2);
    if(angle >0.0 && angle < uSliceArc)discard;

    // csm_FragColor=vec4(vec3(angle),1.0);
    // if(!gl_FrontFacing)csm_FragColor=vec4(0.75,0.15,0.3,1.0);
    float csm_Slice; //写属性名就可以激活
  }`,uniforms:g,patchMap:f,depthPacking:Z});let k;B.load("/threeProjectDocs/gears.glb",s=>{k=s.scene,k.traverse(l=>{l.isMesh&&(l.name=="outerHull"?(l.material=b,l.customDepthMaterial=L):l.material=x,l.castShadow=!0,l.receiveShadow=!0)}),a.add(k)});const e=new is(new as(10,10,10),new F({color:"#aaaaaa"}));e.receiveShadow=!0,e.position.x=-4,e.position.y=-3,e.position.z=-4,e.lookAt(new ns(0,0,0)),a.add(e);const n=new ls("#ffffff",4);return n.position.set(6.25,3,4),n.castShadow=!0,n.shadow.mapSize.set(1024,1024),n.shadow.camera.near=.1,n.shadow.camera.far=30,n.shadow.normalBias=.05,n.shadow.camera.top=8,n.shadow.camera.right=8,n.shadow.camera.bottom=-8,n.shadow.camera.left=-8,a.add(n),(s,l)=>(S(),_(I,null,[o("div",{ref_key:"ddd",ref:h,style:{width:"100%",height:"100%"}},null,512),o("div",{id:"aaa",ref_key:"a",ref:c},null,512)],64))}},Es=R(rs,[["__scopeId","data-v-aed224c0"]]),ds={style:{height:"500px",width:"100%"}},As=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"sixtythreeFile.md","filePath":"sixtythreeFile.md"}'),gs={name:"sixtythreeFile.md"},Ds=Object.assign(gs,{setup(M){const{site:h,theme:c,page:a,frontmatter:t}=z();return(i,r)=>{const p=G("ClientOnly");return S(),_("div",null,[o("div",ds,[D(p,null,{default:O(()=>[D(Es)]),_:1})]),r[0]||(r[0]=V("",2))])}}});export{As as __pageData,Ds as default};
