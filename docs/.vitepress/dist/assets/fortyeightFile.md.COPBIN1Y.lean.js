import{_ as w,p as _,s as P,o as u,c as v,j as g,G as M,y as m,u as z,I as S,J as C,w as R,av as T}from"./chunks/framework.BB2QZFaM.js";import{S as H,P as L,W as j,A as O,G as V,N as G,n as I,g as N,m as W,C as J,V as q,h as U,v as $}from"./chunks/three.module.D5qQolFO.js";import{O as K}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as Q}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as X}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as Y}from"./chunks/lil-gui.module.min.DqZR5HPe.js";var Z=`uniform mat4 modelMatrix;

uniform mat4 viewMatrix;

uniform mat4 projectionMatrix;\r

attribute vec3 position;

attribute float aMyrandom;

varying float vMyrandom;

uniform float my1;\r
uniform vec2 my2;\r
uniform float utime;

attribute vec2 uv;\r
varying vec2 uuv;

varying float uyinying;

float fn(float a){\r
  float b=2.0;\r
  return a+b;\r
}

#define PI 3.141592653589793

void main(){\r
  

  
  float a=1.0;\r
  float b=2.0;\r
  
  float c=a+b;

  
  int d=1;\r
  int e=2;\r
  int f=d+e;

  
  float g=a+float(d);\r
  \r
  bool tf=true;

  
  vec2 h=vec2(1.0,2.0);\r
  h.x=2.0;\r
  h.y=3.0;\r
  h*=2.0;

  vec3 i=vec3(0,0,0);\r
  vec3 j=vec3(1.0,2.0,3.0);

  vec3 k=vec3(h,4.0);\r
  vec3 k2=vec3(h.x,h.y,5.0);\r
  vec2 l=k.xy;\r
  vec2 l2=k.xz;\r
  

  vec3 rgbcolor=vec3(1.0,1.0,1.0);\r
  rgbcolor.r=2.0;\r
  rgbcolor.g=2.0;\r
  rgbcolor.b=2.0;

  vec4 m=vec4(1.0,2.0,3.0,4.0);

  float res=fn(1.0);\r

  
  vec4 modelPosition = modelMatrix * vec4(position,1.0);\r
  \r
  
  
  

  
  

  
  
  
  
  float yinying=sin( my1 * modelPosition.x-utime) * 0.4;\r
  yinying+=sin( my2.x * modelPosition.y-utime) * 0.4;\r
  modelPosition.z=yinying;\r
  \r
  vec4 viewPosition = viewMatrix * modelPosition;\r
  vec4 projectionPosition = projectionMatrix * viewPosition;\r
  
  gl_Position = projectionPosition;\r
  
  

  vMyrandom=aMyrandom;

  uuv=uv;

  uyinying=yinying;\r
}`,ss=`precision mediump float;

varying float vMyrandom;

uniform vec3 ucolor;

uniform sampler2D mytexture;

varying vec2 uuv;

varying float uyinying;

void main(){\r
  
  

  
  

  

  
  vec4 texturecolor=texture2D(mytexture,uuv);\r
  texturecolor.rgb*=uyinying;\r
  gl_FragColor=texturecolor;\r
}`;const is={__name:"fortyeightFile",setup(f){const a=m(null),r=m(null),n=new H,l=new L(75,window.innerWidth/window.innerHeight,.1,1e3),i=new j({antialias:!0});i.setSize(window.innerWidth,window.innerHeight),i.shadowMap.enabled=!0;const k=new O(100);n.add(k);const h=new V(100,100);h.material.opacity=.2,h.material.transparent=!0,n.add(h);const E=new K(l,i.domElement);E.enableDamping=!0,E.dampingFactor=.01,l.position.set(10,10,10);let t=null,p;_(()=>{p=new Y({container:r.value}),a.value.appendChild(i.domElement),y(),p.add(e.uniforms.my1,"value").min(0).max(100).step(.01),p.add(e.uniforms.my2.value,"x").min(0).max(100).step(.01),t=()=>{i.setSize(a.value.offsetWidth,a.value.offsetHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),l.aspect=a.value.offsetWidth/a.value.offsetHeight,l.updateProjectionMatrix()},t(),window.addEventListener("resize",t)}),P(()=>{p.destroy(),cancelAnimationFrame(animationId),n.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(D=>D.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),n.clear(),i.forceContextLoss(),window.removeEventListener("resize",t)});const B=new I;function y(){e.uniforms.utime.value=B.getElapsedTime(),E.update(),requestAnimationFrame(y),i.render(n,l)}const x=new N,b=new Q,o=new X;o.setDecoderPath("/draco/"),b.setDRACOLoader(o);const d=new W(5,5,32,32),e=new G({vertexShader:Z,fragmentShader:ss,transparent:!0,uniforms:{my1:{value:10},my2:{value:new q(10,5)},utime:{value:0},ucolor:{value:new J("green")},mytexture:{value:x.load("/threeProjectDocs/200115103917-1.jpg")}}}),c=new U(d,e);c.position.set(5,5,5),n.add(c);const F=d.attributes.position.count,A=new Float32Array(F);for(let s=0;s<F;s++)A[s]=Math.random();return d.setAttribute("aMyrandom",new $(A,1)),(s,D)=>(u(),v(M,null,[g("div",{ref_key:"ddd",ref:a,style:{width:"100%",height:"100%"}},null,512),g("div",{id:"aaa",ref_key:"a",ref:r},null,512)],64))}},as=w(is,[["__scopeId","data-v-0a1b1d3d"]]),ns={style:{height:"500px",width:"100%",position:"relative"}},Es=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fortyeightFile.md","filePath":"fortyeightFile.md"}'),ls={name:"fortyeightFile.md"},ds=Object.assign(ls,{setup(f){const{site:a,theme:r,page:n,frontmatter:l}=z();return(i,k)=>{const h=S("ClientOnly");return u(),v("div",null,[g("div",ns,[C(h,null,{default:R(()=>[C(as)]),_:1})]),k[0]||(k[0]=T("",4))])}}});export{Es as __pageData,ds as default};
