import{_ as L,p as T,s as H,o as A,c as P,j as C,G as M,y as f,u as z,I as N,J as D,w as I,av as S}from"./chunks/framework.BB2QZFaM.js";import{S as b,P as G,W as j,A as O,G as W,j as V,n as q,h as d,g as J,C as K,e as U,w as $,m as Q,p as w,D as X,I as Y}from"./chunks/three.module.D5qQolFO.js";import{O as Z}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as ss}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as is}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as as}from"./chunks/lil-gui.module.min.DqZR5HPe.js";const ns={__name:"fiftyfourFile",setup(x){const n=f(null),o=f(null),i=new b,l=new G(75,window.innerWidth/window.innerHeight,.1,1e3),a=new j({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});a.setSize(window.innerWidth,window.innerHeight),a.shadowMap.enabled=!0,a.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const h=new O(100);i.add(h);const e=new W(100,100);e.material.opacity=.2,e.material.transparent=!0,i.add(e);const g=new Z(l,a.domElement);g.enableDamping=!0,g.dampingFactor=.01,l.position.set(10,10,10);let p=null,c=null;T(()=>{n.value.appendChild(a.domElement),m(),c=new as({container:o.value}),c.addColor(k.uniforms.uColor,"value"),p=()=>{a.setSize(n.value.offsetWidth,n.value.offsetHeight),a.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),l.aspect=n.value.offsetWidth/n.value.offsetHeight,l.updateProjectionMatrix()},p(),window.addEventListener("resize",p)}),H(()=>{c.destroy(),cancelAnimationFrame(u),i.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(t=>t.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),i.clear(),a.forceContextLoss(),window.removeEventListener("resize",p)});const _=new q;let u;function m(){const s=_.getElapsedTime();r.rotation.x=-s*.5,r.rotation.y=s*.5,E&&(E.rotation.x=-s*.5,E.rotation.y=s*.5),g.update(),u=requestAnimationFrame(m),a.render(i,l)}new J;const B=new ss,v=new is;v.setDecoderPath("/draco/"),B.setDRACOLoader(v);const k=new V({vertexShader:`
  varying vec3 uNormal;
  varying vec3 uPosition;
  void main(){
    vec4  modelPosition = modelMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // 当顶点移动时，不希望法线跟着变化，阻止平移等应用到法线上
    vec4 modelNormal = modelMatrix*vec4(normal,0.0);// 后面是非齐次向量

    // uNormal = normal;
    uNormal = modelNormal.xyz;
    uPosition = modelPosition.xyz;
  }`,fragmentShader:`
  uniform vec3 uColor;
  varying vec3 uNormal;
  varying vec3 uPosition;
  vec3 AmbientLight(vec3 lightColor,float lightIntensity){
    return lightColor*lightIntensity;
  }
  vec3 DirectionalLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower){
    vec3 lightDirection=normalize(lightPosition);
    vec3 lightRlflection=reflect(-lightDirection,normal);//反射函数
    float shading=dot(normal,lightDirection);
    // 法线和光线点积后，结果从1（方向相反）到0（90度）到-1（方向相同），-1和环境光乘积后光线会很小，所以要控制他至少是0
    shading=max(0.0,shading);
    float specular = -dot(lightRlflection,viewDirection);// 高光
    specular=max(0.0,specular);
    specular=pow(specular,specularPower);
    return lightColor*lightIntensity*(shading+specular);
    // return vec3(shading);
    // return vec3(specular);
  }
  vec3 PointLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower,vec3 position,float lightdecay){
    vec3 lightDelta=lightPosition-position;
    float lightDistance=length(lightDelta);
    vec3 lightDirection=normalize(lightDelta);
    vec3 lightRlflection=reflect(-lightDirection,normal);//反射函数
    float shading=dot(normal,lightDirection);
    // 法线和光线点积后，结果从1（方向相反）到0（90度）到-1（方向相同），-1和环境光乘积后光线会很小，所以要控制他至少是0
    shading=max(0.0,shading);
    float specular = -dot(lightRlflection,viewDirection);// 高光
    specular=max(0.0,specular);
    specular=pow(specular,specularPower);
    float decay=1.0-lightDistance*lightdecay;
    decay=max(0.0,decay);
    return lightColor*lightIntensity*decay*(shading+specular);
    // return vec3(shading);
    // return vec3(specular);
    // return vec3(decay);
  }
  void main(){
    vec3 viewDirection=normalize(uPosition-cameraPosition);// 视图方向

    vec3 color=uColor;

    vec3 light=vec3(0.0);
    light+=AmbientLight(vec3(1.0),0.03);
    light+=DirectionalLight(vec3(0.1,0.1,1.0),1.0,normalize(uNormal),vec3(0.0,0.0,3.0),viewDirection,10.0);
    light+=PointLight(vec3(1.0,0.1,0.1),1.0,normalize(uNormal),vec3(0.0,2.5,0.0),viewDirection,20.0,uPosition,0.05);
    color*=light;//光和颜色作用，照在物体上

    gl_FragColor=vec4(color,1.0);
  }`,uniforms:{uColor:{value:new K(.1,.1,1)}}}),R=new d(new U(1,64,32),k),r=new d(new $(.5,.4,100,20),k);r.position.set(2,0,0),i.add(R,r);let E=null;B.load("/threeProjectDocs/suzanne.glb",s=>{console.log(s),s.scene.children.forEach(t=>{!t.isMesh||!t.material||(t.material=k)}),s.scene.position.set(-2,0,0),E=s.scene,i.add(s.scene)});const F=new d(new Q(1,1),new w({side:X}));F.position.set(0,0,3),F.material.color.setRGB(.1,.1,1),i.add(F);const y=new d(new Y(.1,2),new w);return y.position.set(0,2.5,0),y.material.color.setRGB(1,.1,.1),i.add(y),(s,t)=>(A(),P(M,null,[C("div",{ref_key:"ddd",ref:n,style:{width:"100%",height:"100%"}},null,512),C("div",{id:"aaa",ref_key:"a",ref:o},null,512)],64))}},ls=L(ns,[["__scopeId","data-v-703f8134"]]),ts={style:{height:"500px",width:"100%"}},os=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftyfourFile.md","filePath":"fiftyfourFile.md"}'),es={name:"fiftyfourFile.md"},gs=Object.assign(es,{setup(x){const{site:n,theme:o,page:i,frontmatter:l}=z();return(a,h)=>{const e=N("ClientOnly");return A(),P("div",null,[C("div",ts,[D(e,null,{default:I(()=>[D(ls)]),_:1})]),h[0]||(h[0]=S("",2))])}}});export{os as __pageData,gs as default};
