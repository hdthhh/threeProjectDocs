import{_ as T,p as x,s as S,o as D,c as w,j as y,G as z,y as u,u as N,I as M,J as v,w as b,av as R}from"./chunks/framework.BB2QZFaM.js";import{S as H,P as G,W as L,A as j,G as O,j as W,n as I,h as B,g as V,x as q,D as J,C as K,e as U,w as $}from"./chunks/three.module.Bw-VuLTn.js";import{O as Q}from"./chunks/OrbitControls.DnynEjGF.js";import{G as X}from"./chunks/GLTFLoader.CDa-noHW.js";import{D as Y}from"./chunks/DRACOLoader.BqtDfez1.js";import{g as Z}from"./chunks/lil-gui.module.min.DqZR5HPe.js";const ss={__name:"fiftytwoFile",setup(A){const n=u(null),o=u(null),a=new H,l=new G(75,window.innerWidth/window.innerHeight,.1,1e3),i=new L({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});i.setSize(window.innerWidth,window.innerHeight),i.shadowMap.enabled=!0,i.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const p=new j(100);a.add(p);const t=new O(100,100);t.material.opacity=.2,t.material.transparent=!0,a.add(t);const d=new Q(l,i.domElement);d.enableDamping=!0,d.dampingFactor=.01,l.position.set(10,10,10);let k=null,g=null;x(()=>{n.value.appendChild(i.domElement),m(),g=new Z({container:o.value}),g.addColor(F,"color").onChange(()=>{h.uniforms.uColor.value.set(F.color)}),k=()=>{i.setSize(n.value.offsetWidth,n.value.offsetHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),l.aspect=n.value.offsetWidth/n.value.offsetHeight,l.updateProjectionMatrix()},k(),window.addEventListener("resize",k)}),S(()=>{g.destroy(),cancelAnimationFrame(c),a.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(e=>e.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),a.clear(),i.forceContextLoss(),window.removeEventListener("resize",k)});let c;function m(){const s=_.getElapsedTime();r.rotation.x=-s*.5,r.rotation.y=s*.5,E&&(E.rotation.x=-s*.5,E.rotation.y=s*.5),h.uniforms.uTime.value=s,d.update(),c=requestAnimationFrame(m),i.render(a,l)}const _=new I;new V;const C=new X,f=new Y;f.setDecoderPath("/draco/"),C.setDRACOLoader(f);const h=new W({vertexShader:`
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  float random2D(vec2 value){
    // 随机数
    return fract(sin(dot(value.xy,vec2(12.9898,78.233)))*43758.5453123);
  }
  void main(){
    vec4 modelPosition=modelMatrix * vec4(position,1.0);
    float gltchTime=uTime-modelPosition.y;
    float gltchStrength=sin(gltchTime)+sin(gltchTime*3.45)+sin(gltchTime*8.76);
    gltchStrength/=3.0;
    gltchStrength=smoothstep(0.3,1.0,gltchStrength);
    gltchStrength*=0.5;
    modelPosition.x+=(random2D(modelPosition.xz+uTime)-0.5)*gltchStrength;
    modelPosition.z+=(random2D(modelPosition.zx+uTime)-0.5)*gltchStrength;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vPosition= modelPosition.xyz;
    // 当为0.0时，非齐次向量，希望法线向量不随平移旋转缩放变化而变化
    vec4 modelNormal =modelMatrix*vec4(normal, 0.0);
    vNormal=modelNormal.xyz;
  }`,fragmentShader:`
  varying vec3 vPosition;
  uniform float uTime;
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main(){
    // mod 模运算，当超过第二个参数，变0，
    float stripes =mod((vPosition.y-uTime*0.02)*20.0,1.0);// 条纹
    stripes=pow(stripes,3.0);
    // gl_FragColor=vec4(1.0,1.0,1.0,stripes);
    // 顶点位置 视图位置
    vec3 viewDirection=normalize(vPosition-cameraPosition);
    // 法线向量和视图向量   菲涅尔
    // float fresnel=dot(viewDirection,vNormal);// 点积函数dot
    // float fresnel=dot(viewDirection,vNormal)+1.0;
    vec3 normal = normalize(vNormal);//当到这里，和vertexShader发送过来的vNormal和vNormal不一致，要重新归一化
    if(!gl_FrontFacing){normal*=-1.0;}
    float fresnel=dot(viewDirection,normal)+1.0;
    fresnel=pow(fresnel,2.0);//把渐变向外推
    float falloff=smoothstep(0.8,0.0,fresnel);
    float holographic=stripes*fresnel;// 菲涅尔+条纹
    holographic+=fresnel*1.25; 
    holographic*=falloff;//边缘过渡
    // gl_FragColor=vec4(1.0,1.0,1.0,fresnel);
    gl_FragColor=vec4(uColor,holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{uTime:{value:0},uColor:{value:new K("#70c1ff")}},transparent:!0,side:J,depthWrite:!1,blending:q}),P=new B(new U(2,64,32),h),r=new B(new $(1,.4,100,20),h);r.position.set(5,0,0),a.add(P,r);let E=null;C.load("/threeProjectDocs/suzanne.glb",s=>{console.log(s),s.scene.children.forEach(e=>{!e.isMesh||!e.material||(e.material=h)}),s.scene.position.set(-5,0,0),s.scene.scale.set(2,2,2),E=s.scene,a.add(s.scene)});const F={};return F.color="#70c1ff",(s,e)=>(D(),w(z,null,[y("div",{ref_key:"ddd",ref:n,style:{width:"100%",height:"100%"}},null,512),y("div",{id:"aaa",ref_key:"a",ref:o},null,512)],64))}},is=T(ss,[["__scopeId","data-v-4e4061be"]]),as={style:{height:"500px",width:"100%"}},rs=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftytwoFile.md","filePath":"fiftytwoFile.md"}'),ns={name:"fiftytwoFile.md"},Es=Object.assign(ns,{setup(A){const{site:n,theme:o,page:a,frontmatter:l}=N();return(i,p)=>{const t=M("ClientOnly");return D(),w("div",null,[y("div",as,[v(t,null,{default:b(()=>[v(is)]),_:1})]),p[0]||(p[0]=R("",2))])}}});export{rs as __pageData,Es as default};
