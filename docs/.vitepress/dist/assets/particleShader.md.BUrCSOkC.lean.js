import{S as b,C as d,P as x,W as S,B as D,v as p,j as B,x as P,d as M,n as T}from"./chunks/three.module.vz7QN0_z.js";import{O}from"./chunks/OrbitControls.CfJ5KulZ.js";import{p as z,s as N,o as A,c as _,y as V,I as j,j as I,J as v,w as R,av as W}from"./chunks/framework.BB2QZFaM.js";const h=8e3,L=`
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aSize;
  attribute vec3  aColor;

  uniform float uTime;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float t = mod(uTime * aSpeed + aOffset, 1.0);
    vec3 pos = position;
    pos.y += t * 20.0 - 10.0;
    // 螺旋扰动
    float angle = t * 6.2832 * 2.0 + aOffset * 6.2832;
    pos.x += sin(angle) * 0.4;
    pos.z += cos(angle) * 0.4;

    vColor = aColor;
    // 生命周期淡入淡出
    vAlpha = sin(t * 3.14159);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`,G=`
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // 核心：全亮；中环：半透；边缘：消隐
    float core  = 1.0 - smoothstep(0.0, 0.3, d);
    float mid   = 1.0 - smoothstep(0.3, 0.7, d);
    float edge  = 1.0 - smoothstep(0.7, 1.0, d);
    float shape = core * 1.0 + mid * 0.5 + edge * 0.15;
    float alpha = clamp(shape, 0.0, 1.0) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`,H={__name:"particleShader",setup(w){const r=V(null),t=new b;t.background=new d(328976);const i=new x(60,1,.1,200);i.position.set(0,8,20);const e=new S({antialias:!0}),f=new O(i,e.domElement);f.enableDamping=!0;const k=new Float32Array(h*3),y=new Float32Array(h),m=new Float32Array(h),u=new Float32Array(h),c=new Float32Array(h*3),F=[new d(8956671),new d(16746700),new d(11206638),new d(16768392)];for(let s=0;s<h;s++){const n=Math.random()*22,o=Math.random()*Math.PI*2;k[s*3]=Math.cos(o)*n,k[s*3+1]=(Math.random()-.5)*20,k[s*3+2]=Math.sin(o)*n,y[s]=Math.random(),m[s]=.1+Math.random()*.3,u[s]=1.5+Math.random()*3;const l=F[Math.floor(Math.random()*F.length)];c[s*3]=l.r,c[s*3+1]=l.g,c[s*3+2]=l.b}const a=new D;a.setAttribute("position",new p(k,3)),a.setAttribute("aOffset",new p(y,1)),a.setAttribute("aSpeed",new p(m,1)),a.setAttribute("aSize",new p(u,1)),a.setAttribute("aColor",new p(c,3));const E=new B({uniforms:{uTime:{value:0}},vertexShader:L,fragmentShader:G,transparent:!0,depthWrite:!1,blending:P});t.add(new M(a,E));let C,g;return z(()=>{r.value.appendChild(e.domElement),g=()=>{const o=r.value.offsetWidth,l=r.value.offsetHeight;e.setSize(o,l),e.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),i.aspect=o/l,i.updateProjectionMatrix()},g(),window.addEventListener("resize",g);const s=new T;function n(){C=requestAnimationFrame(n),E.uniforms.uTime.value=s.getElapsedTime(),f.update(),e.render(t,i)}n()}),N(()=>{cancelAnimationFrame(C),window.removeEventListener("resize",g),a.dispose(),E.dispose(),e.forceContextLoss()}),(s,n)=>(A(),_("div",{ref_key:"container",ref:r,style:{height:"100%",width:"100%"}},null,512))}},J={style:{height:"500px",width:"100%"}},Q=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"particleShader.md","filePath":"particleShader.md"}'),U={name:"particleShader.md"},X=Object.assign(U,{setup(w){return(r,t)=>{const i=j("ClientOnly");return A(),_("div",null,[I("div",J,[v(i,null,{default:R(()=>[v(H)]),_:1})]),t[0]||(t[0]=W("",5))])}}});export{Q as __pageData,X as default};
