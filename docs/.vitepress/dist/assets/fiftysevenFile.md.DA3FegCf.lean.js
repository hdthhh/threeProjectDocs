import{_ as V,p as W,s as q,o as O,c as L,j as f,G as J,y as H,u as Q,I as K,J as U,w as $,av as X}from"./chunks/framework.BB2QZFaM.js";import{S as Y,P as Z,W as ss,A as is,G as as,n as ns,h as B,g as ls,H as N,j as z,U as r,r as D,C as g,e as es,J as hs,I as ts,p as ps,K as ks}from"./chunks/three.module.D5qQolFO.js";import{O as rs}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as os}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as Es}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as ds}from"./chunks/lil-gui.module.min.DqZR5HPe.js";const gs={__name:"fiftysevenFile",setup(b){const l=H(null),F=H(null),n=new Y,e=new Z(75,window.innerWidth/window.innerHeight,.1,1e3),a=new ss({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});a.setSize(window.innerWidth,window.innerHeight),a.shadowMap.enabled=!0,a.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const o=new is(100);n.add(o);const t=new as(100,100);t.material.opacity=.2,t.material.transparent=!0,n.add(t);const y=new rs(e,a.domElement);y.enableDamping=!0,y.dampingFactor=.01,e.position.set(5,5,5);let E=null,h=null;W(()=>{l.value.appendChild(a.domElement),x(),h=new ds({container:F.value}),j(),E=()=>{a.setSize(l.value.offsetWidth,l.value.offsetHeight),a.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),e.aspect=l.value.offsetWidth/l.value.offsetHeight,e.updateProjectionMatrix()},E(),window.addEventListener("resize",E)}),q(()=>{h.destroy(),cancelAnimationFrame(A),n.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&(Array.isArray(i.material)?i.material.forEach(R=>R.dispose()):i.material.dispose()),i.texture&&i.texture.dispose()}),n.clear(),a.forceContextLoss(),window.removeEventListener("resize",E)});const I=new ns;let A;function x(){const i=I.getElapsedTime();M.rotation.y=i*.5,y.update(),A=requestAnimationFrame(x),a.render(n,e)}const c=new ls,G=new os,w=new Es;w.setDecoderPath("/draco/"),G.setDRACOLoader(w);const C=c.load(new URL("/threeProjectDocs/assets/day.DkcerPt2.jpg",import.meta.url).href);C.colorSpace=N,C.anisotropy=8;const m=c.load(new URL("/threeProjectDocs/assets/night.BR_DbmEQ.jpg",import.meta.url).href);m.colorSpace=N,m.anisotropy=8;const T=c.load(new URL("/threeProjectDocs/assets/specularClouds.DpLQ1-js.jpg",import.meta.url).href);T.anisotropy=8;const s={};s.atmosphereDayColor="#00aaff",s.atmosphereTwilightColor="#ff6600";const p=new z({vertexShader:`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
  }`,fragmentShader:`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform sampler2D udayTexture;
  uniform sampler2D unightTexture;
  uniform sampler2D uspecularCloudsTexture;
  uniform vec3 usunDirection;
  uniform vec3 uAtmosphereTwilightColor;
  uniform vec3 uAtmosphereDayColor;

  void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = vec3(0.0);

    float sunOrientation=dot(usunDirection,normal);// 根据太阳的方位，定义一半的白天和一半的黑天

    // 日夜
    vec3 day=texture(udayTexture,vUv).xyz;
    vec3 night=texture(unightTexture,vUv).rgb;
    // color=vec3(sunOrientation);
    // color=day;
    float daymix=smoothstep(-0.25,0.5,sunOrientation);
    color=mix(night,day,daymix);

    // 云
    vec2 specularCloudsColor=texture(uspecularCloudsTexture,vUv).rg;
    // float cloudsMix = specularCloudsColor.g;
    // 0.3-1.0 范围 ，减少云的数量
    float cloudsMix = smoothstep(0.3,1.0,specularCloudsColor.g);
    cloudsMix*=daymix; // 把云在黑夜移除
    color=mix(color,vec3(1.0),cloudsMix);

    // 菲涅尔
    float fresnel=dot(viewDirection,normal)+1.0;
    fresnel= pow(fresnel,2.0);

    // 大气层
    float atmosphereDayMix=smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    // color= atmosphereColor;
    // color=mix(color,atmosphereColor,fresnel);
    color=mix(color,atmosphereColor,fresnel*atmosphereDayMix);

    // 镜面反射，太阳光照在地球上反光
    vec3 reflection = reflect(-usunDirection, normal);
    float specular = -dot(reflection, viewDirection);
    specular = max(specular,0.0);
    specular = pow(specular,32.0);
    specular*=specularCloudsColor.r;// 陆地上，不反射太阳光
    // color += vec3(specular);
    // 我们希望边缘呈现大气层的颜色
    vec3 specularColor = mix(vec3(1.0),atmosphereColor, fresnel);
    color += specular * specularColor;

    gl_FragColor = vec4(color, 1.0); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{udayTexture:new r(C),unightTexture:{value:m},uspecularCloudsTexture:{value:T},usunDirection:{value:new D(0,0,1)},uAtmosphereTwilightColor:new r(new g(s.atmosphereTwilightColor)),uAtmosphereDayColor:new r(new g(s.atmosphereDayColor))}}),P=new es(2,64,64),M=new B(P,p);n.add(M);const k=new z({side:hs,transparent:!0,vertexShader:`
  // varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
  }`,fragmentShader:`
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 usunDirection;
  uniform vec3 uAtmosphereTwilightColor;
  uniform vec3 uAtmosphereDayColor;

  void main(){
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 color = vec3(0.0);

    float sunOrientation=dot(usunDirection,normal);// 根据太阳的方位，定义一半的白天和一半的黑天

    // 大气层
    float atmosphereDayMix=smoothstep(-0.5,1.0,sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color+=atmosphereColor;

    // 透明度
    float edgeAlpha=dot(viewDirection, normal);
    edgeAlpha =smoothstep(0.0,0.5,edgeAlpha);
   
    float dayAlpha =smoothstep(-0.5,0.0,sunOrientation);
    float alpha = edgeAlpha * dayAlpha;

    gl_FragColor = vec4(color, alpha); 
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{usunDirection:{value:new D(0,0,1)},uAtmosphereTwilightColor:new r(new g(s.atmosphereTwilightColor)),uAtmosphereDayColor:new r(new g(s.atmosphereDayColor))}}),_=new B(P,k);_.scale.set(1.04,1.04,1.04),n.add(_);const u=new ks(1,Math.PI*.5,.5),d=new D,S=new B(new ts(.1,2),new ps);n.add(S);const v=()=>{d.setFromSpherical(u),S.position.copy(d).multiplyScalar(5),p&&p.uniforms.usunDirection.value.copy(d),k&&k.uniforms.usunDirection.value.copy(d)};v();function j(){h.addColor(s,"atmosphereDayColor").onChange(()=>{p.uniforms.uAtmosphereDayColor.value.set(s.atmosphereDayColor),k.uniforms.uAtmosphereDayColor.value.set(s.atmosphereDayColor)}),h.addColor(s,"atmosphereTwilightColor").onChange(()=>{p.uniforms.uAtmosphereTwilightColor.value.set(s.atmosphereTwilightColor),k.uniforms.uAtmosphereTwilightColor.value.set(s.atmosphereTwilightColor)}),h.add(u,"phi").min(0).max(Math.PI).onChange(v),h.add(u,"theta").min(-Math.PI).max(Math.PI).onChange(v)}return(i,R)=>(O(),L(J,null,[f("div",{ref_key:"ddd",ref:l,style:{width:"100%",height:"100%"}},null,512),f("div",{id:"aaa",ref_key:"a",ref:F},null,512)],64))}},Fs=V(gs,[["__scopeId","data-v-9a8b7513"]]),ys={style:{height:"500px",width:"100%"}},fs=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftysevenFile.md","filePath":"fiftysevenFile.md"}'),cs={name:"fiftysevenFile.md"},As=Object.assign(cs,{setup(b){const{site:l,theme:F,page:n,frontmatter:e}=Q();return(a,o)=>{const t=K("ClientOnly");return O(),L("div",null,[f("div",ys,[U(t,null,{default:$(()=>[U(Fs)]),_:1})]),o[0]||(o[0]=X("",2))])}}});export{fs as __pageData,As as default};
