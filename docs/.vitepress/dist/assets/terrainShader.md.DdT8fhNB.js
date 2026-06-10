import{S as m,C as f,P as F,W as u,j as C,m as A,h as D,n as _}from"./chunks/three.module.Bw-VuLTn.js";import{O as x}from"./chunks/OrbitControls.DnynEjGF.js";import{p as b,s as B,o as c,c as g,y as w,I as S,j as z,J as E,w as P,av as H}from"./chunks/framework.BB2QZFaM.js";const T={__name:"terrainShader",setup(y){const t=w(null),i=new m;i.background=new f(8900331);const s=new F(60,1,.1,1e3);s.position.set(0,8,12),s.lookAt(0,0,0);const a=new u({antialias:!0}),k=new x(s,a.domElement);k.enableDamping=!0;const n=new C({uniforms:{uTime:{value:0},uHeight:{value:5.5}},vertexShader:`
    uniform float uTime;
    uniform float uHeight;
    varying float vHeight;
    varying float vSlope;

    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(
        mix(dot(hash2(i+vec2(0,0)),f-vec2(0,0)), dot(hash2(i+vec2(1,0)),f-vec2(1,0)), u.x),
        mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)), dot(hash2(i+vec2(1,1)),f-vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v=0.0, a=0.5;
      for(int i=0;i<6;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
      return v;
    }
    float getH(vec2 xz) {
      return fbm(xz * 0.4 + uTime * 0.008) * uHeight;
    }

    void main() {
      vec2 xz = position.xz;
      float h = getH(xz);
      vHeight = h;

      float e = 1.2;
      float hR = getH(xz + vec2(e, 0.0));
      float hU = getH(xz + vec2(0.0, e));
      // 法线Y分量 = 坡度，在模型空间直接可用
      vec3 tx = vec3(e, hR - h, 0.0);
      vec3 tz = vec3(0.0, hU - h, e);
      vec3 n = normalize(cross(tz, tx));
      // n.y 越大越平坦（山顶），越小越陡
      vSlope = n.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(0.0, max(h, -1.5), 0.0), 1.0);
    }
  `,fragmentShader:`
    varying float vHeight;
    varying float vSlope;

    void main() {
      // 实测 fBm*8 范围: [-3.0, 2.8]
      vec3 water = vec3(0.1, 0.35, 0.75);
      vec3 sand  = vec3(0.76, 0.70, 0.50);
      vec3 grass = vec3(0.18, 0.52, 0.12);
      vec3 rock  = vec3(0.42, 0.38, 0.32);
      vec3 snow  = vec3(0.95, 0.95, 1.0);

      vec3 color = water;
      // 用坡度扰动高度，让地质边界随地形起伏自然变化
      float h = vHeight + (1.0 - vSlope) * 0.3;
      color = mix(color, sand,  smoothstep(-0.6,  0.1, h));
      color = mix(color, grass, smoothstep(-0.1,  0.8, h));
      color = mix(color, snow,  smoothstep( 0.4,  1.1, h));

      // vSlope 是模型空间法线Y分量，平坦=1，陡坡=0
      // 用它做明暗：平坦亮，陡坡暗，不依赖视图空间变换
      float light = clamp(vSlope * 0.7 + 0.3, 0.3, 1.0);
      gl_FragColor = vec4(color * light, 1.0);
    }
  `}),h=new A(20,20,256,256);h.rotateX(-Math.PI/2);const v=new D(h,n);i.add(v);let p,e;return b(()=>{t.value.appendChild(a.domElement),e=()=>{const d=t.value.offsetWidth,o=t.value.offsetHeight;a.setSize(d,o),a.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),s.aspect=d/o,s.updateProjectionMatrix()},e(),window.addEventListener("resize",e);const r=new _;function l(){p=requestAnimationFrame(l),n.uniforms.uTime.value=r.getElapsedTime()*5,k.update(),a.render(i,s)}l()}),B(()=>{cancelAnimationFrame(p),window.removeEventListener("resize",e),h.dispose(),n.dispose(),a.forceContextLoss()}),(r,l)=>(c(),g("div",{ref_key:"container",ref:t,style:{height:"100%",width:"100%"}},null,512))}},M={style:{height:"500px",width:"100%"}},j=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"terrainShader.md","filePath":"terrainShader.md"}'),N={name:"terrainShader.md"},I=Object.assign(N,{setup(y){return(t,i)=>{const s=S("ClientOnly");return c(),g("div",null,[z("div",M,[E(s,null,{default:P(()=>[E(T)]),_:1})]),i[0]||(i[0]=H(`<h2 id="地形着色器" tabindex="-1">地形着色器 <a class="header-anchor" href="#地形着色器" aria-label="Permalink to “地形着色器”">​</a></h2><p>顶点着色器用 <strong>fBm（分形布朗运动）噪声</strong> 生成地形高度，片元着色器按高度分层混合颜色，并计算简单漫反射光照。</p><table tabindex="0"><thead><tr><th>高度范围</th><th>颜色</th></tr></thead><tbody><tr><td>&lt; 0</td><td>水（蓝）</td></tr><tr><td>0 ~ 0.3</td><td>沙滩 → 草地</td></tr><tr><td>0.3 ~ 1.5</td><td>草地 → 岩石</td></tr><tr><td>1.5 ~ 2.2</td><td>岩石 → 雪</td></tr><tr><td>&gt; 2.2</td><td>雪</td></tr></tbody></table><h2 id="code" tabindex="-1">code <a class="header-anchor" href="#code" aria-label="Permalink to “code”">​</a></h2><div class="language-glsl"><button title="Copy Code" class="copy"></button><span class="lang">glsl</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// fBm 噪声叠加 5 个倍频</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fbm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(vec2 </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> v </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    v </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> noise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(p);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    p </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> v;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 顶点着色器：用 fbm 抬高 y 轴，偏移法线</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> h </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> fbm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(xz </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.5</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uTime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0.02</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> uHeight;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">vec3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pos </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> position </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> vec3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, h, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 片元着色器：按高度混色 + 漫反射</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">float</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> diff </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> clamp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(vNormal, lightDir), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">gl_FragColor</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> vec4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(color </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> diff, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div>`,5))])}}});export{j as __pageData,I as default};
