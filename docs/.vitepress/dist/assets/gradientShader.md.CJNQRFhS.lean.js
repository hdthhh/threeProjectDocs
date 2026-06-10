import{S as c,C,P as m,W as v,j as u,m as B,h as A,n as D}from"./chunks/three.module.Bw-VuLTn.js";import{O as f}from"./chunks/OrbitControls.DnynEjGF.js";import{p as _,s as b,o as y,c as o,y as w,I as x,j as S,J as g,w as P,av as T}from"./chunks/framework.BB2QZFaM.js";const U={__name:"gradientShader",setup(F){const t=w(null),i=new c;i.background=new C(1118481);const s=new m(60,1,.1,100);s.position.set(0,0,3);const a=new v({antialias:!0}),l=new f(s,a.domElement);l.enableDamping=!0;const n=new u({uniforms:{uTime:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform float uTime;
    varying vec2 vUv;

    vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0,4,2), 6.0)-3.0)-1.0, 0.0, 1.0);
      return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0*c.z - 1.0));
    }

    void main() {
      // 角度渐变 + 时间驱动色相旋转
      float angle = atan(vUv.y - 0.5, vUv.x - 0.5) / (2.0 * 3.14159) + 0.5;
      float hue = mod(angle + uTime * 0.1, 1.0);
      float dist = length(vUv - 0.5);
      // 中心白，边缘饱和色
      float sat = smoothstep(0.0, 0.5, dist) * 0.9;
      float light = 1.0 - dist * 0.6;
      gl_FragColor = vec4(hsl2rgb(vec3(hue, sat, light)), 1.0);
    }
  `}),e=new B(2,2);i.add(new A(e,n));let p,h;return _(()=>{t.value.appendChild(a.domElement),h=()=>{const d=t.value.offsetWidth,E=t.value.offsetHeight;a.setSize(d,E),a.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),s.aspect=d/E,s.updateProjectionMatrix()},h(),window.addEventListener("resize",h);const r=new D;function k(){p=requestAnimationFrame(k),n.uniforms.uTime.value=r.getElapsedTime(),l.update(),a.render(i,s)}k()}),b(()=>{cancelAnimationFrame(p),window.removeEventListener("resize",h),e.dispose(),n.dispose(),a.forceContextLoss()}),(r,k)=>(y(),o("div",{ref_key:"container",ref:t,style:{height:"100%",width:"100%"}},null,512))}},z={style:{height:"500px",width:"100%"}},N=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"gradientShader.md","filePath":"gradientShader.md"}'),M={name:"gradientShader.md"},I=Object.assign(M,{setup(F){return(t,i)=>{const s=x("ClientOnly");return y(),o("div",null,[S("div",z,[g(s,null,{default:P(()=>[g(U)]),_:1})]),i[0]||(i[0]=T("",5))])}}});export{N as __pageData,I as default};
