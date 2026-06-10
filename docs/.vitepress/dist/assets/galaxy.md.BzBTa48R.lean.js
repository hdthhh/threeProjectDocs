import{S as ie,C as s,P as le,W as ce,B as N,v as i,j as A,x as _,d as J,m as F,D as q,h as H,n as he}from"./chunks/three.module.Bw-VuLTn.js";import{O as de}from"./chunks/OrbitControls.DnynEjGF.js";import{p as fe,s as me,o as Z,c as ee,y as ue,I as ve,j as pe,J as $,w as we}from"./chunks/framework.BB2QZFaM.js";const K=`
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAngleOffset;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    float twinkle = 0.7 + 0.3 * sin(uTime * 3.0 + aAngleOffset * 17.3);
    vAlpha = twinkle;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`,Q=`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`,X=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Y=`
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p), u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    return noise(p)*0.5 + noise(p*2.1)*0.25 + noise(p*4.3)*0.125;
  }
  void main() {
    vec2 uv = vUv - 0.5;
    float d = length(uv);
    float n = fbm(uv * 3.0 + uTime * 0.05);
    float alpha = smoothstep(0.5, 0.0, d - n * 0.2) * n * 0.35;
    gl_FragColor = vec4(uColor, alpha);
  }
`,z=4,T=4e3,w=3e3,Me={__name:"galaxy",setup(te){const p=ue(null),l=new ie;l.background=new s(5);const c=new le(60,1,.1,500);c.position.set(0,40,80);const f=new ce({antialias:!0}),I=new de(c,f.domElement);I.enableDamping=!0;const M=z*T+2e3,h=new Float32Array(M*3),d=new Float32Array(M*3),C=new Float32Array(M),y=new Float32Array(M),ae=[new s(8956671),new s(16755302),new s(11206604),new s(16746683)];let a=0;for(let e=0;e<z;e++){const n=e/z*Math.PI*2,o=ae[e];for(let t=0;t<T;t++){const r=t/T,v=2+r*38,L=n+r*Math.PI*4+(Math.random()-.5)*.6,U=(1-r*.5)*2.5,ne=Math.cos(L)*v+(Math.random()-.5)*U,re=(Math.random()-.5)*(1.5-r),se=Math.sin(L)*v+(Math.random()-.5)*U;h[a*3]=ne,h[a*3+1]=re,h[a*3+2]=se;const S=.6+Math.random()*.4;d[a*3]=o.r*S,d[a*3+1]=o.g*S,d[a*3+2]=o.b*S,C[a]=.5+Math.random()*1.5,y[a]=Math.random()*Math.PI*2,a++}}for(let e=0;e<2e3;e++){const n=Math.pow(Math.random(),2)*6,o=Math.random()*Math.PI*2,t=(Math.random()-.5)*Math.PI;h[a*3]=Math.cos(o)*Math.cos(t)*n,h[a*3+1]=Math.sin(t)*n*.4,h[a*3+2]=Math.sin(o)*Math.cos(t)*n;const r=.7+Math.random()*.3;d[a*3]=r,d[a*3+1]=r*.85,d[a*3+2]=r*.5,C[a]=.8+Math.random()*2,y[a]=Math.random()*Math.PI*2,a++}const m=new N;m.setAttribute("position",new i(h,3)),m.setAttribute("aColor",new i(d,3)),m.setAttribute("aSize",new i(C,1)),m.setAttribute("aAngleOffset",new i(y,1));const O=new A({uniforms:{uTime:{value:0}},vertexShader:K,fragmentShader:Q,transparent:!0,depthWrite:!1,blending:_});l.add(new J(m,O));const g=new Float32Array(w*3),x=new Float32Array(w*3),E=new Float32Array(w),k=new Float32Array(w);for(let e=0;e<w;e++){const n=80+Math.random()*120,o=Math.random()*Math.PI*2,t=Math.acos(2*Math.random()-1);g[e*3]=n*Math.sin(t)*Math.cos(o),g[e*3+1]=n*Math.cos(t),g[e*3+2]=n*Math.sin(t)*Math.sin(o);const r=.6+Math.random()*.4;x[e*3]=r,x[e*3+1]=r,x[e*3+2]=r,E[e]=.3+Math.random()*.8,k[e]=Math.random()*Math.PI*2}const u=new N;u.setAttribute("position",new i(g,3)),u.setAttribute("aColor",new i(x,3)),u.setAttribute("aSize",new i(E,1)),u.setAttribute("aAngleOffset",new i(k,1));const B=new A({uniforms:{uTime:{value:0}},vertexShader:K,fragmentShader:Q,transparent:!0,depthWrite:!1,blending:_});l.add(new J(u,B));const G=[{pos:[12,1,-8],color:new s(3364351),scale:18},{pos:[-15,2,10],color:new s(16729224),scale:14},{pos:[5,-1,20],color:new s(4521898),scale:12}],P=[];G.forEach(({pos:e,color:n,scale:o})=>{const t=new F(o,o),r=new A({uniforms:{uTime:{value:0},uColor:{value:n}},vertexShader:X,fragmentShader:Y,transparent:!0,depthWrite:!1,blending:_,side:q});P.push(r);const v=new H(t,r);v.position.set(...e),v.rotation.x=-Math.PI/2+(Math.random()-.5)*.5,l.add(v)});const W=new F(12,12),j=new A({uniforms:{uTime:{value:0},uColor:{value:new s(16773324)}},vertexShader:X,fragmentShader:Y,transparent:!0,depthWrite:!1,blending:_,side:q});P.push(j);const R=new H(W,j);R.rotation.x=-Math.PI/2,l.add(R);const V=[O,B,...P],oe=[m,u,W,...G.map(()=>new F(1,1))];let D,b;return fe(()=>{p.value.appendChild(f.domElement),b=()=>{const o=p.value.offsetWidth,t=p.value.offsetHeight;f.setSize(o,t),f.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),c.aspect=o/t,c.updateProjectionMatrix()},b(),window.addEventListener("resize",b);const e=new he;function n(){D=requestAnimationFrame(n);const o=e.getElapsedTime();V.forEach(t=>{t.uniforms?.uTime&&(t.uniforms.uTime.value=o)}),I.update(),f.render(l,c)}n()}),me(()=>{cancelAnimationFrame(D),window.removeEventListener("resize",b),oe.forEach(e=>e.dispose()),V.forEach(e=>e.dispose()),f.forceContextLoss()}),(e,n)=>(Z(),ee("div",{ref_key:"container",ref:p,style:{height:"100%",width:"100%"}},null,512))}},ge={style:{height:"500px",width:"100%"}},Ce=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"galaxy.md","filePath":"galaxy.md"}'),xe={name:"galaxy.md"},ye=Object.assign(xe,{setup(te){return(p,l)=>{const c=ve("ClientOnly");return Z(),ee("div",null,[pe("div",ge,[$(c,null,{default:we(()=>[$(Me)]),_:1})])])}}});export{Ce as __pageData,ye as default};
