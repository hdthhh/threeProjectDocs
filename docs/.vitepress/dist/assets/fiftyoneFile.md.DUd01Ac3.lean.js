import{p as S,s as b,o as T,c as P,y as H,u as O,I as G,j as z,J as f,w as I,av as W}from"./chunks/framework.BB2QZFaM.js";import{S as j,P as N,W as V,A as J,G as X,n as q,j as $,g as K,a as Q,y as v,h as D,m as A,z as Y,R as w,U as x,D as Z}from"./chunks/three.module.Bw-VuLTn.js";import{O as ss}from"./chunks/OrbitControls.DnynEjGF.js";import{G as is}from"./chunks/GLTFLoader.CDa-noHW.js";import{D as as}from"./chunks/DRACOLoader.BqtDfez1.js";const ns={__name:"fiftyoneFile",setup(_){const e=H(null),i=new j,t=new N(75,window.innerWidth/window.innerHeight,.1,1e3),a=new V({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});a.setSize(window.innerWidth,window.innerHeight),a.shadowMap.enabled=!0,a.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const d=new J(100);i.add(d);const h=new X(100,100);h.material.opacity=.2,h.material.transparent=!0,i.add(h);const k=new ss(t,a.domElement);k.enableDamping=!0,k.dampingFactor=.01,t.position.set(10,10,10);let p=null;S(()=>{p=()=>{a.setSize(e.value.offsetWidth,e.value.offsetHeight),a.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),t.aspect=e.value.offsetWidth/e.value.offsetHeight,t.updateProjectionMatrix()},p(),window.addEventListener("resize",p),e.value.appendChild(a.domElement),F()}),b(()=>{cancelAnimationFrame(g),window.removeEventListener("resize",p),k.dispose(),a.renderLists.dispose(),a.forceContextLoss(),a.dispose(),i.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(l=>l.dispose()):s.material.dispose())}),i.clear()});let g;function F(){const s=M.getElapsedTime();u.uniforms.uTime.value=s,k.update(),g=requestAnimationFrame(F),a.render(i,t)}const M=new q,L=new K,y=new is,o=new as;o.setDecoderPath("./"),y.setDRACOLoader(o);const R=new Q(16777215,1);i.add(R);const c=new v("#ffffff",3);c.position.set(0,8,8),i.add(c);const C=new v("#ffffff",1.5);C.position.set(0,8,-8),i.add(C),y.load("/threeProjectDocs/plaions_mug/scene.gltf",s=>{i.add(s.scene),s.scene.scale.set(5,5,5),s.scene.position.y=3,U(s.scene)});function U(s){s.traverse(l=>{if(!l.isMesh||!l.material)return;(Array.isArray(l.material)?l.material:[l.material]).forEach(n=>{n.clearcoat=0,n.transmission=0,n.sheen=0,n.iridescence=0,n.thickness=0,n.metalness=Math.min(n.metalness??.5,.5),n.roughness=Math.max(n.roughness??.4,.4),n.envMapIntensity=0,n.needsUpdate=!0})})}const m=new D(new A(100,100),new Y({color:"#112c33"}));m.rotateX(-Math.PI/2),i.add(m);const r=new A(1,1,64,64);r.translate(0,.5,0),r.scale(5,20,5);const E=L.load("/threeProjectDocs/noiseTexture.png");E.wrapS=w,E.wrapT=w;const u=new $({side:Z,uniforms:{uPerlinTexture:new x(E),uTime:new x(0)},transparent:!0,depthWrite:!1,vertexShader:`
  uniform sampler2D uPerlinTexture;
  uniform float uTime;
  varying vec2 vUv;
  vec2 rotate2D(vec2 value,float angle){
    float s=sin(angle);
    float c=cos(angle);
    mat2 m=mat2(c,s,-s,c);
    return m*value;
  }
  // 说是可以导入glsl文件，导入函数，但是不知道为什么没成功
  // 要用js+import的写法
  // #include ../assets/glsl/rotate2D.glsl

  void main(){
    vec3 pos=position;
    // float angle =pos.y;
    // 根据柏林噪音创造随机效果，x在0。5从中间开始，y随高度上升上升
    // 只取rbg的r，只需要随便一个就行
    // float twistPerlin=texture(uPerlinTexture,vec2(0.5,uv.y*0.2)).r;
    // 加些时间律动
    float twistPerlin=texture(uPerlinTexture,vec2(0.5,uv.y*0.2-uTime*0.01)).r;
    float angle =twistPerlin*10.0;
    pos.xz=rotate2D(pos.xz,angle);

    // 风
    // 减0.5可以让风从0-1变成-0.5-0.5，不会只向一个方向，
    vec2 windOffset=vec2(
      texture( uPerlinTexture, vec2(0.25,(uTime*0.01)) ).r - 0.5,
      texture( uPerlinTexture, vec2(0.75,(uTime*0.01)) ).r - 0.5
    );
    // 保持烟雾底部留着杯子里
    // windOffset*=uv.y*10.0;
    // 加幂函数，让过度不生硬
    windOffset*=pow(uv.y,2.0)*10.0;
    pos.xz+=windOffset;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos,1.0);
    vUv=uv;
  }`,fragmentShader:`
  uniform sampler2D uPerlinTexture;
  uniform float uTime;
  varying vec2 vUv;
  void main(){
    vec2 smokeuv=vUv;
    smokeuv.x*=0.5;
    smokeuv.y*=0.3;
    smokeuv.y-=uTime*0.03;

    // float smoke=texture(uPerlinTexture,vUv).r;
    float smoke=texture(uPerlinTexture,smokeuv).r;
    // 让烟雾过渡平滑 smoothstep 参数1和2数值控制在0-1之间
    smoke=smoothstep(0.4,1.0,smoke);

    // 让四周过度自然
    smoke*=smoothstep(0.0,0.1,vUv.x);
    smoke*=smoothstep(1.0,0.9,vUv.x);
    smoke*=smoothstep(0.0,0.1,vUv.y);
    smoke*=smoothstep(1.0,0.4,vUv.y);

    gl_FragColor=vec4(0.6,0.3,0.2,smoke);
    // gl_FragColor=vec4(1.0,0.0,0.0,1.0);
    // 用于 色调映射（Tone Mapping） 和 色彩空间转换（Color Space Conversion） 的预处理指令
    #include <tonemapping_fragment> 
    #include <colorspace_fragment>
  }`}),B=new D(r,u);return B.position.y=5,i.add(B),(s,l)=>(T(),P("div",{ref_key:"ddd",ref:e,style:{width:"100%",height:"100%"}},null,512))}},ls={style:{height:"500px",width:"100%"}},ds=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftyoneFile.md","filePath":"fiftyoneFile.md"}'),es={name:"fiftyoneFile.md"},gs=Object.assign(es,{setup(_){const{site:e,theme:i,page:t,frontmatter:a}=O();return(d,h)=>{const k=G("ClientOnly");return T(),P("div",null,[z("div",ls,[f(k,null,{default:I(()=>[f(ns)]),_:1})]),h[0]||(h[0]=W("",2))])}}});export{ds as __pageData,gs as default};
