import{_ as T,p as H,s as z,o as P,c as R,j as m,G as M,y as D,u as N,I,J as f,w as G,av as W}from"./chunks/framework.BB2QZFaM.js";import{S as O,P as j,W as V,A as U,G as q,n as $,h as w,j as J,g as K,U as x,C as r,V as Q,e as X,w as Y}from"./chunks/three.module.Bw-VuLTn.js";import{O as Z}from"./chunks/OrbitControls.DnynEjGF.js";import{G as ss}from"./chunks/GLTFLoader.CDa-noHW.js";import{D as is}from"./chunks/DRACOLoader.BqtDfez1.js";import{g as as}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{l as ns}from"./chunks/light.D0Mks8HV.js";const ls={__name:"fiftysixFile",setup(_){const l=D(null),y=D(null),a=new O,p=new j(75,window.innerWidth/window.innerHeight,.1,1e3),n=new V({antialias:!0});n.setSize(window.innerWidth,window.innerHeight),n.shadowMap.enabled=!0;let k=Math.min(window.devicePixelRatio,1.5);n.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const F=new U(100);a.add(F);const c=new q(100,100);c.material.opacity=.2,c.material.transparent=!0,a.add(c);const C=new Z(p,n.domElement);C.enableDamping=!0,C.dampingFactor=.01,p.position.set(10,10,10);let d=null,t=null;H(()=>{l.value.appendChild(n.domElement),B(),t=new as({container:y.value}),L(),d=()=>{n.setSize(l.value.offsetWidth,l.value.offsetHeight),n.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),p.aspect=l.value.offsetWidth/l.value.offsetHeight,p.updateProjectionMatrix()},d(),window.addEventListener("resize",d)}),z(()=>{t.destroy(),cancelAnimationFrame(u),a.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(e=>e.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),a.clear(),n.forceContextLoss(),window.removeEventListener("resize",d)});const b=new $;let u;function B(){const s=b.getElapsedTime();g.rotation.x=-s*.5,g.rotation.y=s*.5,o&&(o.rotation.x=-s*.5,o.rotation.y=s*.5),h.uniforms.uResolution.value.set(l.value.offsetWidth/k,l.value.offsetHeight/k),C.update(),u=requestAnimationFrame(B),n.render(a,p)}new K;const v=new ss,A=new is;A.setDecoderPath("/draco/"),v.setDRACOLoader(A);const i={};i.color="#ff794d",i.shadeColor="#8e19b8",i.shadowColor="#8e19b8",i.lightColor="#e5ffe0";const h=new J({vertexShader:`
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main(){
    vec4 modelPosition=modelMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    vPosition= modelPosition.xyz;
    vec4 modelNormal =modelMatrix*vec4(normal, 0.0);
    vNormal=modelNormal.xyz;
  }`,fragmentShader:`
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  uniform vec3 uShadowColor;
  uniform float uShadowRepectitions;
  uniform vec3 uLightColor;
  uniform float uLightRepectitions;

  // light glsl
  ${ns}

  vec3 halftone(vec3 color,float repetitions,vec3 direction,float low,float high,vec3 pointColor,vec3 normal){
    float intensity=dot(normal,direction);
    intensity=smoothstep(low,high,intensity);

    vec2 uv=gl_FragCoord.xy/uResolution.y;
    uv*=repetitions;
    uv=mod(uv,1.0);

    float point=distance(uv,vec2(0.5));
    point=1.0-step(0.5*intensity,point);

    return mix(color,pointColor,point);
  }

  void main(){
    vec3 viewDirection=normalize(vPosition-cameraPosition);
    vec3 normal=normalize(vNormal);
    vec3 color=uColor;

    vec3 light=vec3(0.0);
    light+=AmbientLight(vec3(1.0),1.0);    
    light+=DirectionalLight(vec3(1.0,1.0,1.0),1.0,normal,vec3(1.0,1.0,0.0),viewDirection,1.0);
    color*=light;

    // float repetitions=50.0;
    // vec3 direction= vec3(0.0,-1.0,0.0);
    // float low=-0.8;
    // float high=1.5;
    // vec3 pointColor=vec3(1.0,0.0,0.0);

    // 底部紫光
    color = halftone(color,uShadowRepectitions,vec3(0.0,-1.0,0.0),-0.8,1.5,uShadowColor,normal);
    // 顶部黄光
    color = halftone(color,uLightRepectitions,vec3(1.0,1.0,0.0),0.5,1.5,uLightColor,normal);

    gl_FragColor=vec4(color,1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{uColor:{value:new r(i.color)},uShadeColor:{value:new r(i.shadeColor)},uResolution:{value:new Q(window.innerWidth/k,window.innerHeight/k)},uShadowColor:{value:new r(i.shadowColor)},uShadowRepectitions:new x(100),uLightColor:{value:new r(i.lightColor)},uLightRepectitions:new x(100)}}),S=new w(new X(4,64,32),h),g=new w(new Y(2,.8,100,20),h);g.position.set(10,0,0),a.add(S,g);let o=null;v.load("/threeProjectDocs/suzanne.glb",s=>{console.log(s),s.scene.children.forEach(e=>{!e.isMesh||!e.material||(e.material=h)}),s.scene.position.set(-10,0,0),s.scene.scale.set(4,4,4),o=s.scene,a.add(s.scene)});const E={bgcolor:new r("rgb(33, 20, 41)")};a.environment=E.bgcolor,a.background=E.bgcolor;function L(){t.addColor(E,"bgcolor").onChange(()=>{a.environment=E.bgcolor,a.background=E.bgcolor}),t.addColor(i,"color").onChange(()=>{h.uniforms.uColor.value.set(i.color)}),t.addColor(i,"shadowColor").onChange(()=>{h.uniforms.uShadowColor.value.set(i.shadowColor)}),t.add(h.uniforms.uShadowRepectitions,"value").min(1).max(300).step(1).name("ShadowRepectitions"),t.addColor(i,"lightColor").onChange(()=>{h.uniforms.uLightColor.value.set(i.lightColor)}),t.add(h.uniforms.uLightRepectitions,"value").min(1).max(300).step(1).name("LightRepectitions")}return(s,e)=>(P(),R(M,null,[m("div",{ref_key:"ddd",ref:l,style:{width:"100%",height:"100%"}},null,512),m("div",{id:"aaa",ref_key:"a",ref:y},null,512)],64))}},hs=T(ls,[["__scopeId","data-v-ed79ec0a"]]),ts={style:{height:"500px",width:"100%"}},ys=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftysixFile.md","filePath":"fiftysixFile.md"}'),ks={name:"fiftysixFile.md"},Fs=Object.assign(ks,{setup(_){const{site:l,theme:y,page:a,frontmatter:p}=N();return(n,k)=>{const F=I("ClientOnly");return P(),R("div",null,[m("div",ts,[f(F,null,{default:G(()=>[f(hs)]),_:1})]),k[0]||(k[0]=W("",3))])}}});export{ys as __pageData,Fs as default};
