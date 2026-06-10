import{S as u,C as h,P as D,W as f,j as C,aP as w,e as A,h as _,A as x,n as B}from"./chunks/three.module.vz7QN0_z.js";import{O as P}from"./chunks/OrbitControls.CfJ5KulZ.js";import{p as b,s as V,o as y,c,y as S,I as M,j as N,J as g,w as T,av as z}from"./chunks/framework.BB2QZFaM.js";const G={__name:"shaderFile",setup(F){const n=S(null),s=new u;s.background=new h(1118481);const i=new D(75,1,.1,1e3);i.position.z=3;const a=new f({antialias:!0}),k=new P(i,a.domElement);k.enableDamping=!0;const l=new C({uniforms:{uTime:{value:0},uColor:{value:new h(43775)},uGlowColor:{value:new h(17663)}},vertexShader:`
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-worldPos.xyz);
      gl_Position = projectionMatrix * worldPos;
    }
  `,fragmentShader:`
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      // 菲涅尔发光：视线与法线夹角越大越亮
      float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
      // 脉冲动画
      float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
      vec3 color = mix(uColor, uGlowColor, fresnel * pulse);
      float alpha = 0.4 + fresnel * 0.6;
      gl_FragColor = vec4(color, alpha);
    }
  `,transparent:!0,side:w}),p=new A(1,64,64),m=new _(p,l);s.add(m);const v=new x(2);s.add(v);let r,e;return b(()=>{n.value.appendChild(a.domElement),e=()=>{const d=n.value.offsetWidth,E=n.value.offsetHeight;a.setSize(d,E),a.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),i.aspect=d/E,i.updateProjectionMatrix()},e(),window.addEventListener("resize",e);const o=new B;function t(){r=requestAnimationFrame(t),l.uniforms.uTime.value=o.getElapsedTime(),k.update(),a.render(s,i)}t()}),V(()=>{cancelAnimationFrame(r),window.removeEventListener("resize",e),p.dispose(),l.dispose(),a.forceContextLoss()}),(o,t)=>(y(),c("div",{ref_key:"container",ref:n,style:{height:"100%",width:"100%"}},null,512))}},j={style:{height:"500px",width:"100%"}},W=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"shaderFile.md","filePath":"shaderFile.md"}'),O={name:"shaderFile.md"},H=Object.assign(O,{setup(F){return(n,s)=>{const i=M("ClientOnly");return y(),c("div",null,[N("div",j,[g(i,null,{default:T(()=>[g(G)]),_:1})]),s[0]||(s[0]=z("",4))])}}});export{W as __pageData,H as default};
