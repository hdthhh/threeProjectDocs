import{S as L,C as O,aX as H,P as W,W as R,j as u,m as C,h as d,e as J,p as X,D as q,a as Y,y as $,o as I,aY as K,n as Q}from"./chunks/three.module.vz7QN0_z.js";import{O as Z}from"./chunks/OrbitControls.CfJ5KulZ.js";import{p as ss,s as is,o as z,c as G,y as as,I as ts,j as ns,J as U,w as es,av as hs}from"./chunks/framework.BB2QZFaM.js";const V=`
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ls=`
  varying vec3 vPos;
  varying vec3 vNormal;
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  void main(){
    float n = noise(vPos.xz*2.0)*0.5 + noise(vPos.xy*3.0)*0.3;
    vec3 stone = mix(vec3(0.10,0.08,0.07), vec3(0.20,0.16,0.13), n);
    float diff = clamp(dot(vNormal, normalize(vec3(-0.5,1.0,0.3))), 0.0,1.0)*0.25 + 0.08;
    gl_FragColor = vec4(stone * diff, 1.0);
  }
`,os=`
  uniform float uTime;
  varying vec2 vUv;
  float hash(float n){ return fract(sin(n)*43758.5); }
  void main(){
    float flicker = (0.7 + 0.3*sin(uTime*7.3)*sin(uTime*13.1+1.2))
                  * (0.85 + 0.15*hash(floor(uTime*9.0)));
    vec2 uv = vUv - 0.5;
    float v = 1.0 - smoothstep(0.15, 0.5, length(uv));
    gl_FragColor = vec4(vec3(1.0,0.5,0.08)*flicker*v, v);
  }
`,rs="varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",ks=`
  uniform float uTime;
  uniform float uIdx;
  varying vec2 vUv;
  varying float vA;
  void main(){
    vUv = uv;
    vec3 p = position;
    p.y += sin(uTime*1.1 + uIdx)*0.35;
    p.x += sin(uTime*0.8 + uIdx*2.0)*0.2;
    vA = 0.5 + 0.3*sin(uTime*1.8 + uIdx);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,ps=`
  varying vec2 vUv;
  varying float vA;
  void main(){
    vec2 uv = vUv - 0.5;
    float d = length(uv * vec2(1.0,1.3));
    float shape = smoothstep(0.5, 0.18, d);
    float wave = sin(vUv.x*10.0)*0.04*(1.0-vUv.y);
    shape *= smoothstep(0.0, 0.12, vUv.y + wave);
    gl_FragColor = vec4(0.75, 0.92, 1.0, shape * vA * 0.75);
  }
`,ds=`
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormal;
  float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }
  void main(){
    float n = noise(vPos.xz*0.6)*0.5 + noise(vPos.xz*2.5)*0.3;
    vec3 col = mix(vec3(0.04,0.07,0.03), vec3(0.09,0.11,0.06), n);
    float mist = noise(vPos.xz*0.3 + uTime*0.04) * 0.4;
    col = mix(col, vec3(0.10,0.14,0.18), mist);
    gl_FragColor = vec4(col, 1.0);
  }
`,cs={__name:"hauntedHouse",setup(N){const E=as(null),s=new L;s.background=new O(330255),s.fog=new H(330255,.035);const o=new W(60,1,.1,200);o.position.set(10,6,16),o.lookAt(0,4,0);const c=new R({antialias:!0}),f=new Z(o,c.domElement);f.enableDamping=!0,f.target.set(0,4,0);const k=[],r=[],y=new u({vertexShader:V,fragmentShader:ls});k.push(y);const x=new u({uniforms:{uTime:{value:0}},vertexShader:rs,fragmentShader:os,transparent:!0,depthWrite:!1});k.push(x);const w=new u({uniforms:{uTime:{value:0}},vertexShader:V,fragmentShader:ds});k.push(w);function p(a,n,i,t,l,e,v=y){const T=new I(a,n,i);r.push(T);const S=new d(T,v);S.position.set(t,l,e),s.add(S)}function A(a,n,i,t,l){const e=new K(a,n,4);r.push(e);const v=new d(e,y);v.position.set(i,t,l),v.rotation.y=Math.PI/4,s.add(v)}function g(a,n,i,t=0){const l=new C(1,1.4);r.push(l);const e=new d(l,x);e.position.set(a,n,i),e.rotation.y=t,s.add(e)}const F=new C(80,80);F.rotateX(-Math.PI/2),r.push(F),s.add(new d(F,w)),p(6,8,5,0,4,0),p(2.5,11,2.5,2.5,5.5,-1),A(4.5,3,0,9.5,0),A(2,4,2.5,13,-1),g(-1.2,4.5,2.51),g(1.2,4.5,2.51),g(0,6.8,2.51),g(-1.2,4.5,-2.51,Math.PI),g(3.01,5.5,0,Math.PI/2),g(3.01,8.5,-1,Math.PI/2),p(1.2,2.2,.1,0,1.1,2.56);function h(a,n){p(.18,4,.18,a,2,n);for(let i=0;i<3;i++){const t=i%2===0?1:-1,l=new I(.1,.1,1.4-i*.3);r.push(l);const e=new d(l,y);e.position.set(a+t*.4,2.4+i*.6,n),e.rotation.z=t*.45,s.add(e)}}h(-5.5,4),h(7,5),h(-7,-1),h(8,-2),h(-4,7),h(6,-5),h(-9,3),h(10,1),h(-6,-4),h(9,6),h(-3,-7),h(5,8);function j(a,n,i=0){p(.9,1.6,.2,a,.8,n),p(.9,.3,.2,a,1.75,n),p(.5,.15,.22,a,1.4,n),s.children[s.children.length-3].rotation.y=i,s.children[s.children.length-2].rotation.y=i,s.children[s.children.length-1].rotation.y=i}[[-4,6,.1],[4,7,-.15],[-6,3,.05],[6,4,.2],[-3,-5,-.1],[5,-4,.12],[-7,5,.08],[8,3,-.2],[-5,-2,.15],[3,9,-.05],[-8,-3,.1],[7,-6,.18]].forEach(([a,n,i])=>{s.children.length,j(a,n);for(let t=1;t<=3;t++)s.children[s.children.length-t].rotation.z=i});const D=new J(1.8,16,16);r.push(D);const _=new X({color:16775376});k.push(_);const B=new d(D,_);B.position.set(-18,22,-35),s.add(B);const P=new C(1.5,2);r.push(P),[[-3,5,3],[4,6,-2],[-1,7,-4],[5,4,2]].forEach(([a,n,i],t)=>{const l=new u({uniforms:{uTime:{value:0},uIdx:{value:t}},vertexShader:ks,fragmentShader:ps,transparent:!0,depthWrite:!1,side:q});k.push(l);const e=new d(P,l);e.position.set(a,n,i),s.add(e)}),s.add(new Y(1118498,.6));const b=new $(7833770,.4);b.position.set(-18,22,-35),s.add(b);let M,m;return ss(()=>{E.value.appendChild(c.domElement),m=()=>{const i=E.value.offsetWidth,t=E.value.offsetHeight;c.setSize(i,t),c.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),o.aspect=i/t,o.updateProjectionMatrix()},m(),window.addEventListener("resize",m);const a=new Q;function n(){M=requestAnimationFrame(n);const i=a.getElapsedTime();k.forEach(t=>{t.uniforms?.uTime&&(t.uniforms.uTime.value=i)}),s.children.forEach(t=>{t.material?.uniforms?.uIdx!==void 0&&t.lookAt(o.position)}),f.update(),c.render(s,o)}n()}),is(()=>{cancelAnimationFrame(M),window.removeEventListener("resize",m),r.forEach(a=>a.dispose()),k.forEach(a=>a.dispose()),c.forceContextLoss()}),(a,n)=>(z(),G("div",{ref_key:"container",ref:E,style:{height:"100%",width:"100%"}},null,512))}},gs={style:{height:"500px",width:"100%"}},us=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"hauntedHouse.md","filePath":"hauntedHouse.md"}'),Es={name:"hauntedHouse.md"},fs=Object.assign(Es,{setup(N){return(E,s)=>{const o=ts("ClientOnly");return z(),G("div",null,[ns("div",gs,[U(o,null,{default:es(()=>[U(cs)]),_:1})]),s[0]||(s[0]=hs("",5))])}}});export{us as __pageData,fs as default};
