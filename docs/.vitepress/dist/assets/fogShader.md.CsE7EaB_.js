import{C as f,S as b,P as w,W as A,m as P,h as v,o as B,j as M,n as S}from"./chunks/three.module.Bw-VuLTn.js";import{O as T}from"./chunks/OrbitControls.DnynEjGF.js";import{p as W,s as z,o as x,c as _,y as O,I as G,j as V,J as C,w as j,av as I}from"./chunks/framework.BB2QZFaM.js";const L=`
  varying vec3 vWorldPos;
  varying float vFogDepth;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vFogDepth = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }
`,N=`
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uFogColor;
  varying vec3 vWorldPos;
  varying float vFogDepth;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(
      mix(hash(i), hash(i+vec2(1,0)), u.x),
      mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
  }

  void main() {
    // 高度雾：贴地浓，向上稀
    float heightFog = exp(-max(vWorldPos.y, 0.0) * 0.5);
    // 距离雾：指数衰减
    float distFog = 1.0 - exp(-vFogDepth * 0.06);
    // 噪声扰动让雾边界自然流动
    float n = noise(vWorldPos.xz * 0.25 + uTime * 0.08);
    float fogFactor = clamp(distFog * (heightFog + 0.15 * n), 0.0, 1.0);
    gl_FragColor = vec4(mix(uColor, uFogColor, fogFactor), 1.0);
  }
`,R={__name:"fogShader",setup(D){const h=O(null),l=new f(13162728),e=new b;e.background=l;const o=new w(60,1,.1,200);o.position.set(0,4,18);const n=new A({antialias:!0}),c=new T(o,n.domElement);c.enableDamping=!0;function E(s){return new M({uniforms:{uTime:{value:0},uColor:{value:new f(s)},uFogColor:{value:l.clone()}},vertexShader:L,fragmentShader:N})}const r=[],p=[],d=new P(60,60);d.rotateX(-Math.PI/2);const F=E(4876097);e.add(new v(d,F)),p.push(d),r.push(F);const y=new B(1,1,1);p.push(y);const m=[9139029,7048811,8022926,9337451];for(let s=-4;s<=4;s+=2)for(let i=-22;i<=2;i+=3){const a=2+Math.random()*4,t=E(m[Math.floor(Math.random()*m.length)]);r.push(t);const g=new v(y,t);g.scale.set(1,a,1),g.position.set(s+(Math.random()-.5),a/2,i+(Math.random()-.5)),e.add(g)}let u,k;return W(()=>{h.value.appendChild(n.domElement),k=()=>{const a=h.value.offsetWidth,t=h.value.offsetHeight;n.setSize(a,t),n.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),o.aspect=a/t,o.updateProjectionMatrix()},k(),window.addEventListener("resize",k);const s=new S;function i(){u=requestAnimationFrame(i);const a=s.getElapsedTime();r.forEach(t=>{t.uniforms.uTime.value=a}),c.update(),n.render(e,o)}i()}),z(()=>{cancelAnimationFrame(u),window.removeEventListener("resize",k),p.forEach(s=>s.dispose()),r.forEach(s=>s.dispose()),n.forceContextLoss()}),(s,i)=>(x(),_("div",{ref_key:"container",ref:h,style:{height:"100%",width:"100%"}},null,512))}},J={style:{height:"500px",width:"100%"}},$=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fogShader.md","filePath":"fogShader.md"}'),q={name:"fogShader.md"},K=Object.assign(q,{setup(D){return(h,l)=>{const e=G("ClientOnly");return x(),_("div",null,[V("div",J,[C(e,null,{default:j(()=>[C(R)]),_:1})]),l[0]||(l[0]=I(`<h2 id="雾着色器" tabindex="-1">雾着色器 <a class="header-anchor" href="#雾着色器" aria-label="Permalink to “雾着色器”">​</a></h2><p>在片元着色器中手动计算雾效，结合<strong>高度雾</strong>和<strong>距离雾</strong>，并用噪声扰动雾的边界，使其自然流动。</p><table tabindex="0"><thead><tr><th>效果</th><th>实现方式</th></tr></thead><tbody><tr><td>高度雾</td><td><code>exp(-y * k)</code>，贴地浓、向上稀</td></tr><tr><td>距离雾</td><td><code>1 - exp(-depth * k)</code>，指数衰减</td></tr><tr><td>流动感</td><td>噪声扰动 fogFactor，随 uTime 移动</td></tr></tbody></table><h2 id="code" tabindex="-1">code <a class="header-anchor" href="#code" aria-label="Permalink to “code”">​</a></h2><div class="language-glsl"><button title="Copy Code" class="copy"></button><span class="lang">glsl</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> heightFog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> exp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">max</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(vWorldPos.y, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> distFog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1.0</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> exp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vFogDepth </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.06</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> noise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(vWorldPos.xz </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.25</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uTime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.08</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fogFactor </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> clamp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(distFog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (heightFog </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.15</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">gl_FragColor</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> vec4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mix</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(uColor, uFogColor, fogFactor), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div>`,5))])}}});export{$ as __pageData,K as default};
