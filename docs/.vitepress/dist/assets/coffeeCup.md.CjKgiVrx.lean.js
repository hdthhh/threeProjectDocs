import{S as L,C as N,P as V,W as G,j as w,k as T,T as x,l as U,h as g,m as H,D as O,U as _,a as R,b as W,g as A,R as b,n as B}from"./chunks/three.module.vz7QN0_z.js";import{O as q}from"./chunks/OrbitControls.CfJ5KulZ.js";import{p as J,s as $,o as E,c as D,y as K,I as Q,j as X,J as z,w as Y}from"./chunks/framework.BB2QZFaM.js";const Z=`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ee=`
  varying vec3 vNormal;
  void main() {
    float diff = clamp(dot(vNormal, normalize(vec3(1.0, 2.0, 1.5))), 0.0, 1.0);
    vec3 col = vec3(0.92, 0.88, 0.82) * (0.18 + diff * 0.82);
    float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0) * 0.25;
    gl_FragColor = vec4(col + rim, 1.0);
  }
`,oe=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,te=`
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  void main() {
    vec2 uv = vUv + vec2(uTime*0.02, 0.0);
    float n = noise(uv*4.0)*0.5 + noise(uv*8.0+0.5)*0.25;
    vec3 col = mix(vec3(0.07,0.03,0.01), vec3(0.18,0.09,0.03), n);
    gl_FragColor = vec4(col, 1.0);
  }
`,ne=`
  uniform sampler2D uPerlin;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  varying float vH;
  vec2 rotate2D(vec2 v,float a){float s=sin(a),c=cos(a);return mat2(c,s,-s,c)*v;}
  void main(){
    vec3 pos = position;
    float h = uv.y;
    // twist driven by noise, grows with height
    float twist = texture(uPerlin, vec2(uSeed, h*0.22 - uTime*0.009)).r;
    pos.xz = rotate2D(pos.xz, (twist - 0.5) * 14.0 * h);
    // wind drift
    float wx = texture(uPerlin, vec2(uSeed+0.3, uTime*0.006)).r - 0.5;
    float wz = texture(uPerlin, vec2(uSeed+0.6, uTime*0.006)).r - 0.5;
    pos.xz += vec2(wx, wz) * pow(h, 1.8) * 4.5;
    // S-curve sway unique per ribbon
    pos.x += sin(uTime*0.55 + uSeed*6.28 + h*3.14) * h * 0.28;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv; vH = h;
  }
`,ae=`
  uniform sampler2D uPerlin;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  varying float vH;
  void main(){
    vec2 uv = vec2(vUv.x*0.5 + uSeed*0.25, vUv.y*0.3 - uTime*0.028);
    // 多层次噪声叠加 fbm
    float n1 = texture(uPerlin, uv).r;
    float n2 = texture(uPerlin, uv*2.3 + 0.5).r;
    float n3 = texture(uPerlin, uv*4.7 + 1.2).r;
    float smoke = n1*0.5 + n2*0.3 + n3*0.2;
    // 柔和过渡，保留深浅层次
    smoke = smoothstep(0.25, 0.85, smoke);
    // 边缘自然淡出
    smoke *= smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    smoke *= smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.35, vUv.y);
    // 底部浓、顶部淡
    smoke *= mix(0.75, 0.25, pow(vH, 1.5));
    vec3 col = mix(vec3(0.92,0.88,0.85), vec3(0.82,0.84,0.88), vH*0.6);
    gl_FragColor = vec4(col, smoke * 0.5);
  }
`,ie={__name:"coffeeCup",setup(F){const l=K(null),n=new L;n.background=new N(1182984);const a=new V(45,1,.1,100);a.position.set(0,5,10),a.lookAt(0,2,0);const s=new G({antialias:!0}),p=new q(a,s.domElement);p.enableDamping=!0,p.target.set(0,2,0);const v=[],m=[],r=new w({vertexShader:Z,fragmentShader:ee});v.push(r);const P=new w({uniforms:{uTime:{value:0}},vertexShader:oe,fragmentShader:te});v.push(P);function c(t,i,e=0,o=0,f=0,I=0){m.push(t);const d=new g(t,i);return d.position.set(e,o,f),d.rotation.x=I,n.add(d),d}c(new T(2.2,2,.18,48),r),c(new x(2.1,.06,8,48),r,0,.09,0,Math.PI/2),c(new T(1.3,1.05,2.8,48),r,0,1.5),c(new U(1.05,48),r,0,.11,0,-Math.PI/2),c(new x(1.3,.07,8,48),r,0,2.9,0,Math.PI/2),c(new U(1.22,48),P,0,2.85,0,-Math.PI/2);const y=new x(.52,.1,10,24,Math.PI);m.push(y);const h=new g(y,r);h.rotation.z=-Math.PI/2,h.position.set(1.3,1.5,0),n.add(h);const M=[],j=[.08,.38,.68],S=[[-.12,.05],[0,0],[.1,-.04]];j.forEach((t,i)=>{const e=new H(1,1,4,48);e.translate(0,.5,0),e.scale(.38,5.2,1),m.push(e);const o=new w({uniforms:{uPerlin:new _(null),uTime:new _(0),uSeed:new _(t)},vertexShader:ne,fragmentShader:ae,transparent:!0,depthWrite:!1,side:O});v.push(o),M.push(o);const f=new g(e,o);f.position.set(S[i][0],2.88,S[i][1]),n.add(f)}),n.add(new R(3351057,.9));const C=new W(16773341,1.8,30);C.position.set(4,8,5),n.add(C);let k,u;return J(()=>{l.value.appendChild(s.domElement),u=()=>{const e=l.value.offsetWidth,o=l.value.offsetHeight;s.setSize(e,o),s.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),a.aspect=e/o,a.updateProjectionMatrix()},u(),window.addEventListener("resize",u),new A().load("/threeProjectDocs/noiseTexture.png",e=>{e.wrapS=b,e.wrapT=b,M.forEach(o=>o.uniforms.uPerlin.value=e)});const t=new B;function i(){k=requestAnimationFrame(i);const e=t.getElapsedTime();v.forEach(o=>{o.uniforms?.uTime&&(o.uniforms.uTime.value=e)}),p.update(),s.render(n,a)}i()}),$(()=>{cancelAnimationFrame(k),window.removeEventListener("resize",u),m.forEach(t=>t.dispose()),v.forEach(t=>t.dispose()),s.forceContextLoss()}),(t,i)=>(E(),D("div",{ref_key:"container",ref:l,style:{height:"100%",width:"100%"}},null,512))}},re={style:{height:"500px",width:"100%"}},me=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"coffeeCup.md","filePath":"coffeeCup.md"}'),se={name:"coffeeCup.md"},ue=Object.assign(se,{setup(F){return(l,n)=>{const a=Q("ClientOnly");return E(),D("div",null,[X("div",re,[z(a,null,{default:Y(()=>[z(ie)]),_:1})])])}}});export{me as __pageData,ue as default};
