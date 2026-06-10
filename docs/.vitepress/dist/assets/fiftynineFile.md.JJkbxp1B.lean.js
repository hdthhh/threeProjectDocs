import{_ as H,p as M,s as N,o as b,c as T,j as u,G as I,y as z,u as O,I as j,J as P,w as W,av as G}from"./chunks/framework.BB2QZFaM.js";import{S as L,P as U,W as V,A as q,G as J,g as $,F as K,B as Q,v as X,j as Y,x as Z,U as o,C as _,V as ss,d as is}from"./chunks/three.module.vz7QN0_z.js";import{O as as}from"./chunks/OrbitControls.CfJ5KulZ.js";import{G as ns}from"./chunks/GLTFLoader.BzGVvzOG.js";import{D as ls}from"./chunks/DRACOLoader.BCJ1FlpS.js";import{g as ts}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{g as ps}from"./chunks/index.DDlvirwQ.js";const hs={__name:"fiftynineFile",setup(S){const l=z(null),c=z(null),h=new L,r=new U(35,window.innerWidth/window.innerHeight,.1,1e3),a=new V({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});a.setSize(window.innerWidth,window.innerHeight),a.shadowMap.enabled=!0,a.setPixelRatio(Math.min(window.devicePixelRatio,2));const g=new q(100);h.add(g);const d=new J(100,100);d.material.opacity=.2,d.material.transparent=!0,h.add(d);const C=new as(r,a.domElement);C.enableDamping=!0,C.dampingFactor=.01,r.position.set(10,10,10);let y=null,t=null,v=!0;M(()=>{l.value.appendChild(a.domElement),f(),t=new ts({container:c.value}),t.addColor(F,"clearColor").onChange(()=>{a.setClearColor(F.clearColor)}),y=()=>{s.material&&s.material.uniforms.uResolution.value.set(l.value.offsetWidth*window.devicePixelRatio,l.value.offsetHeight*window.devicePixelRatio),a.setSize(l.value.offsetWidth,l.value.offsetHeight),a.setPixelRatio(Math.min(window.devicePixelRatio,2)),r.aspect=l.value.offsetWidth/l.value.offsetHeight,r.updateProjectionMatrix()},y(),window.addEventListener("resize",y)}),N(()=>{t.destroy(),cancelAnimationFrame(x),h.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(E=>E.dispose()):n.material.dispose()),n.texture&&n.texture.dispose()}),h.clear(),a.forceContextLoss(),window.removeEventListener("resize",y)});let x;function f(){C.update(),x=requestAnimationFrame(f),a.render(h,r),v&&s?.material?.uniforms?.uProgress&&(v=!1,R())}const F={};F.clearColor="#160920",a.setClearColor(F.clearColor),new $;const A=new ns,D=new ls;D.setDecoderPath("/threeProjectDocs/draco/"),A.setDRACOLoader(D);let s={};A.load("/threeProjectDocs/models.glb",n=>{console.log(n),s.index=0;const E=n.scene.children.map(i=>i.geometry.attributes.position);console.log(E),s.maxCount=0;for(const i of E)i.count>s.maxCount&&(s.maxCount=i.count);s.positions=[];for(const i of E){const e=i.array,k=new Float32Array(s.maxCount*3);for(let m=0;m<s.maxCount;m++){const p=m*3;if(p<e.length)k[p+0]=e[p+0],k[p+1]=e[p+1],k[p+2]=e[p+2];else{const B=Math.floor(i.count*Math.random())*3;k[p+0]=e[B+0],k[p+1]=e[B+1],k[p+2]=e[B+2]}}s.positions.push(new K(k,3))}const w=new Float32Array(s.maxCount);for(let i=0;i<s.maxCount;i++)w[i]=Math.random();s.geometry=new Q,s.geometry.setAttribute("position",s.positions[s.index]),s.geometry.setAttribute("aPositionTarget",s.positions[3]),s.geometry.setAttribute("aSize",new X(w,1)),s.geometry.setIndex(null),s.colorA="#ff7300",s.colorB="#0091ff",s.material=new Y({vertexShader:`
    uniform vec2 uResolution;
    uniform float uSize;
    uniform float uProgress;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    attribute vec3 aPositionTarget;
    attribute float aSize;

    varying vec3 vColor;


    //	Simplex 3D Noise
    //	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
    //
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //  x0 = x0 - 0. + 0.0 * C
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }


    void main(){
      // float noise= snoise(position);
      float noiseOrigin = snoise(position *0.2);
      float noiseTarget = snoise(aPositionTarget * 0.2);
      float noise =mix(noiseOrigin, noiseTarget, uProgress);
      noise=smoothstep(-1.0,1.0,noise);

      // 混合位置
      float duration =0.4;
      float delay =(1.0-duration)* noise;
      float end =delay + duration;
      float progress=smoothstep(delay, end, uProgress);
      vec3 mixedPosition = mix(position, aPositionTarget, progress);

      vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;

      // Point size
      gl_PointSize = aSize * uSize * uResolution.y;
      gl_PointSize *= (1.0 / - viewPosition.z);

      // vColor=vec3(noise);
      vColor = mix(uColorA, uColorB, noise);
    }`,fragmentShader:`
    varying vec3 vColor;

    void main(){
      vec2 uv = gl_PointCoord;
      float distanceToCenter = length(uv - 0.5);
      float alpha = 0.05 / distanceToCenter - 0.1;

      gl_FragColor=vec4(vColor,alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,uniforms:{uSize:new o(.4),uResolution:new o(new ss(l.value.offsetWidth*window.devicePixelRatio,l.value.offsetHeight*window.devicePixelRatio)),uProgress:new o(0),uColorA:new o(new _(s.colorA)),uColorB:new o(new _(s.colorB))},blending:Z,depthWrite:!1}),s.points=new is(s.geometry,s.material),s.points.frustumCulled=!1,h.add(s.points),s.morph=i=>{s.geometry.attributes.position=s.positions[s.index],s.geometry.attributes.aPositionTarget=s.positions[i],ps.fromTo(s.material.uniforms.uProgress,{value:0},{value:1,duration:3,ease:"linear"}),s.index=i},s.morph0=()=>s.morph(0),s.morph1=()=>s.morph(1),s.morph2=()=>s.morph(2),s.morph3=()=>s.morph(3)});function R(){t.add(s,"morph0"),t.add(s,"morph1"),t.add(s,"morph2"),t.add(s,"morph3"),t.add(s.material.uniforms.uProgress,"value").min(0).max(1).step(.01).name("progress").listen(),t.addColor(s,"colorA").onChange(()=>{s.material.uniforms.uColorA.value.set(s.colorA)}),t.addColor(s,"colorB").onChange(()=>{s.material.uniforms.uColorB.value.set(s.colorB)})}return(n,E)=>(b(),T(I,null,[u("div",{ref_key:"ddd",ref:l,style:{width:"100%",height:"100%"}},null,512),u("div",{id:"aaa",ref_key:"a",ref:c},null,512)],64))}},es=H(hs,[["__scopeId","data-v-34981899"]]),ks={style:{height:"500px",width:"100%",position:"relative"}},Cs=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftynineFile.md","filePath":"fiftynineFile.md"}'),rs={name:"fiftynineFile.md"},ms=Object.assign(rs,{setup(S){const{site:l,theme:c,page:h,frontmatter:r}=O();return(a,g)=>{const d=j("ClientOnly");return b(),T("div",null,[u("div",ks,[P(d,null,{default:W(()=>[P(es)]),_:1})]),g[0]||(g[0]=G("",2))])}}});export{Cs as __pageData,ms as default};
