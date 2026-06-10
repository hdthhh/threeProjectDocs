import{p as H,s as S,aw as z,ax as q,o as f,c as x,j as P,y as L,u as O,I as W,J as A,w as V,av as G}from"./chunks/framework.BB2QZFaM.js";import{S as U,P as j,W as N,A as J,G as X,g as Y,h as $,m as D,p as K,D as Q,q as Z,V as d,u as ss,j as is,U as y,d as as,v as w}from"./chunks/three.module.Bw-VuLTn.js";import{O as ns}from"./chunks/OrbitControls.DnynEjGF.js";import{G as ts}from"./chunks/GLTFLoader.CDa-noHW.js";import{D as ls}from"./chunks/DRACOLoader.BqtDfez1.js";const es={id:"top",style:{width:"100%",height:"100%"}},hs={__name:"fiftyeightFile",setup(_){const n=L(null),t=new U,e=new j(35,window.innerWidth/window.innerHeight,.1,1e3),a=new N({antialias:!0});a.setSize(window.innerWidth,window.innerHeight),a.shadowMap.enabled=!0,a.setPixelRatio(Math.min(window.devicePixelRatio,2));const c=new J(100);t.add(c);const h=new X(100,100);h.material.opacity=.2,h.material.transparent=!0,t.add(h);const p=new ns(e,a.domElement);p.enableDamping=!0,p.dampingFactor=.01,e.position.set(0,0,20);let k=null;H(()=>{n.value.appendChild(a.domElement),R(),o(),k=()=>{a.setSize(n.value.offsetWidth,n.value.offsetHeight),e.aspect=n.value.offsetWidth/n.value.offsetHeight,a.setPixelRatio(Math.min(window.devicePixelRatio,2)),u.uniforms.uResolution.value.set(n.value.offsetWidth*Math.min(window.devicePixelRatio,2),n.value.offsetHeight*Math.min(window.devicePixelRatio,2)),e.updateProjectionMatrix()},k(),window.addEventListener("resize",k)}),S(()=>{cancelAnimationFrame(F),t.traverse(i=>{i.geometry&&i.geometry.dispose(),i.material&&(Array.isArray(i.material)?i.material.forEach(E=>E.dispose()):i.material.dispose()),i.texture&&i.texture.dispose()}),t.clear(),a.forceContextLoss(),window.removeEventListener("resize",k),document.querySelector("#top").remove(s.canvas),window.removeEventListener("pointermove",g)});let F;function o(){s.raycaster.setFromCamera(s.screenCursor,e);const i=s.raycaster.intersectObject(s.interactivePlane);if(i.length){const B=i[0].uv;s.canvasCursor.x=B.x*s.canvas.width,s.canvasCursor.y=(1-B.y)*s.canvas.height}s.context.globalCompositeOperation="source-over",s.context.globalAlpha=.02,s.context.fillRect(0,0,s.canvas.width,s.canvas.height);const E=s.canvasCursorPrevious.distanceTo(s.canvasCursor);s.canvasCursorPrevious.copy(s.canvasCursor);const M=Math.min(E*.1,1),r=s.canvas.width*.25;s.context.globalCompositeOperation="lighten",s.context.globalAlpha=M,s.context.drawImage(s.glowImage,s.canvasCursor.x-r*.5,s.canvasCursor.y-r*.5,r,r),s.texture.needsUpdate=!0,p.update(),F=requestAnimationFrame(o),a.render(t,e)}const T=new Y,b=new ts,C=new ls;C.setDecoderPath("/draco/"),b.setDRACOLoader(C);const s={};s.canvas=document.createElement("canvas"),s.canvas.width=128,s.canvas.height=128,s.canvas.style.position="absolute",s.canvas.style.width="256px",s.canvas.style.height="256px",s.canvas.style.top=0,s.canvas.style.left=0,s.canvas.style.zIndex=10,s.glowImage=new Image,s.glowImage.src=z,s.interactivePlane=new $(new D(10,10),new K({color:"red",side:Q})),s.interactivePlane.visible=!1,t.add(s.interactivePlane),s.raycaster=new Z,s.screenCursor=new d(9999,9999),s.canvasCursor=new d(9999,9999),s.canvasCursorPrevious=new d(9999,9999);let g;function R(){document.querySelector("#top").append(s.canvas),s.context=s.canvas.getContext("2d"),s.context.fillRect(0,0,s.canvas.width,s.canvas.height),g=i=>{s.screenCursor.x=i.clientX/window.innerWidth*2-1,s.screenCursor.y=-(i.clientY/window.innerHeight)*2+1},window.addEventListener("pointermove",g)}s.texture=new ss(s.canvas);const u=new is({vertexShader:`
  uniform vec2 uResolution;
  uniform sampler2D uPictureTexture;
  uniform sampler2D uDisplacementTexture;

  attribute float aIntensity;
  attribute float aAngle;

  varying vec3 vColor;

  void main(){
    vec3 newPosition = position;
    float displacementIntensity=texture(uDisplacementTexture, uv).r;
    displacementIntensity=smoothstep(0.1,0.3,displacementIntensity);//粒子不能回到最初位置，平滑一下

    // 位移
    vec3 displacement = vec3(
      cos(aAngle)*0.2,
      sin(aAngle)*0.2,
      1.0
    );
    displacement=normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    newPosition += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float pictureIntensity=texture(uPictureTexture,uv).r;

    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor=vec3(pow(pictureIntensity,2.0));
  }`,fragmentShader:`
  varying vec3 vColor;

  void main(){
    vec2 uv=gl_PointCoord;
    // 相同效果，不同写法
    // float distanceToCenter = distance(uv,vec2(0.5));
    float distanceToCenter = length(uv-vec2(0.5));
    if(distanceToCenter > 0.5) discard;

    gl_FragColor=vec4(vec3(vColor),1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{uResolution:new y(new d(window.innerWidth*Math.min(window.devicePixelRatio,2),window.innerHeight*Math.min(window.devicePixelRatio,2))),uPictureTexture:new y(T.load(q)),uDisplacementTexture:new y(s.texture)}}),l=new D(10,10,128,128);l.setIndex(null),l.deleteAttribute("normal");const I=new as(l,u);t.add(I);const m=new Float32Array(l.attributes.position.count),v=new Float32Array(l.attributes.position.count);for(let i=0;i<l.attributes.position.count;i++)m[i]=Math.random(),v[i]=Math.random()*Math.PI*2;return l.setAttribute("aIntensity",new w(m,1)),l.setAttribute("aAngle",new w(v,1)),(i,E)=>(f(),x("div",es,[P("div",{ref_key:"ddd",ref:n,style:{width:"100%",height:"100%"}},null,512)]))}},ps={style:{height:"500px",width:"100%"}},cs=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftyeightFile.md","filePath":"fiftyeightFile.md"}'),ks={name:"fiftyeightFile.md"},Fs=Object.assign(ks,{setup(_){const{site:n,theme:t,page:e,frontmatter:a}=O();return(c,h)=>{const p=W("ClientOnly");return f(),x("div",null,[P("div",ps,[A(p,null,{default:V(()=>[A(hs)]),_:1})]),h[0]||(h[0]=G("",2))])}}});export{cs as __pageData,Fs as default};
