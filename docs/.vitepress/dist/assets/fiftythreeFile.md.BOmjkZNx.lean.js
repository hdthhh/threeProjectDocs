import{_ as Y,p as q,s as K,o as L,c as V,j as M,G as $,y as b,u as Q,I as X,J as H,w as Z,av as ss}from"./chunks/framework.BB2QZFaM.js";import{S as is,P as as,W as ns,A as hs,G as ls,g as ts,V as ks,r as v,C as ps,i as G,K as es,B as rs,F as z,j as Es,x as ds,d as gs}from"./chunks/three.module.vz7QN0_z.js";import{O as os}from"./chunks/OrbitControls.CfJ5KulZ.js";import{G as ys}from"./chunks/GLTFLoader.BzGVvzOG.js";import{D as Fs}from"./chunks/DRACOLoader.BCJ1FlpS.js";import{g as cs}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{g as Cs}from"./chunks/index.DDlvirwQ.js";import{S as us}from"./chunks/Sky.B8PZ-qa4.js";const Bs={__name:"fiftythreeFile",setup(O){const l=b(null),B=b(null),t=new is,p=new as(75,window.innerWidth/window.innerHeight,.1,1e3),n=new ns({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});n.setSize(window.innerWidth,window.innerHeight),n.shadowMap.enabled=!0,n.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const o=new hs(100);t.add(o);const y=new ls(100,100);y.material.opacity=.2,y.material.transparent=!0;const f=new os(p,n.domElement);f.enableDamping=!0,f.dampingFactor=.01,p.position.set(2,2,5);let F=null,h=null;q(()=>{l.value.appendChild(n.domElement),S(),h=new cs({container:B.value}),U(),F=()=>{i.width=l.value.offsetWidth,i.height=l.value.offsetHeight,i.pixelRadio=Math.min(window.devicePixelRatio,2),i.resolution.set(i.width*i.pixelRadio,i.height*i.pixelRadio),n.setPixelRatio(i.pixelRadio),n.setSize(l.value.offsetWidth,l.value.offsetHeight),p.aspect=l.value.offsetWidth/l.value.offsetHeight,p.updateProjectionMatrix()},F(),window.addEventListener("resize",F)}),K(()=>{h.destroy(),cancelAnimationFrame(_),t.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&(Array.isArray(s.material)?s.material.forEach(r=>r.dispose()):s.material.dispose()),s.texture&&s.texture.dispose()}),t.clear(),n.forceContextLoss(),window.removeEventListener("resize",F)});let _;function S(){f.update(),_=requestAnimationFrame(S),n.render(t,p)}const W=new ts,I=new ys,R=new Fs;R.setDecoderPath("/draco/"),I.setDRACOLoader(R);const i={width:window.innerWidth,height:window.innerHeight,pixelRadio:Math.min(window.devicePixelRatio,2)};i.resolution=new ks(i.width*i.pixelRadio,i.height*i.pixelRadio);const N=(s,r,m,c,D,w)=>{c.flipY=!1;const E=new Float32Array(s*3),C=new Float32Array(s),d=new Float32Array(s);for(let e=0;e<s;e++){const J=new es(D*(.72+.25*Math.random()),Math.random()*Math.PI,Math.random()*Math.PI*2),u=new v;u.setFromSpherical(J),E[e*3]=u.x,E[e*3+1]=u.y,E[e*3+2]=u.z,C[e]=Math.random(),d[e]=1+Math.random()}const g=new rs;g.setAttribute("position",new z(E,3)),g.setAttribute("aSize",new z(C,1)),g.setAttribute("aTimeMultiplier",new z(d,1));const P=new Es({vertexShader:`
    uniform float uSize;
    uniform vec2 uResolution;
    attribute float aSize;
    uniform float uProgress;
    attribute float aTimeMultiplier;

    // x最小，x最大，y最小，y最大，开始结束区间，取值范围区间
    float remap(float value,float originMin,float originMax,float destinationMin,float destinationMax){
      return destinationMin+(value-originMin)*(destinationMax-destinationMin)/(originMax-originMin);
    }

    void main(){
      float progress=uProgress*aTimeMultiplier;
      vec3 newPosition=position;

      // 爆炸效果__/——
      float explodingProgress=remap(progress,0.0,0.1,0.0,1.0);
      explodingProgress=clamp(explodingProgress,0.0,1.0);//限制他0到1，不然一直向外延伸
      explodingProgress=1.0-pow(1.0-explodingProgress,3.0);//速度 幂函数 从快到慢1-（1-x）3次方
      newPosition*=explodingProgress;

      // 爆炸后下落效果_/
      float fallingProgress=remap(progress,0.1,1.0,0.0,1.0);
      fallingProgress=clamp(fallingProgress,0.0,1.0);
      fallingProgress=1.0-pow(1.0-fallingProgress,3.0);
      newPosition.y-=fallingProgress*0.2;

      // 缩放效果,爆炸变大，慢慢变小，直到消失 //     //\\     //
      float sizeOpeningProgress=remap(progress,0.0,0.125,0.0,1.0);
      float sizeClosingProgress=remap(progress,0.125,1.0,1.0,0.0);
      float sizeProgress=min(sizeOpeningProgress,sizeClosingProgress);
      sizeProgress=clamp(sizeProgress,0.0,1.0);

      // 闪烁效果__/——
      float twinklingProgress=remap(progress,0.2,0.8,0.0,1.0);
      twinklingProgress=clamp(twinklingProgress,0.0,1.0);
      float sizeTwinkling=sin(progress*30.0)*0.5+0.5;
      sizeTwinkling=1.0-sizeTwinkling*twinklingProgress;

      vec4 modelPosition = modelMatrix * vec4(newPosition,1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      gl_Position = projectionMatrix * viewPosition;

      // 粒子大小 
      // gl_PointSize=uSize*uResolution.y;
      // gl_PointSize=uSize*uResolution.y*aSize;
      gl_PointSize=uSize*uResolution.y*aSize*sizeProgress*sizeTwinkling;
      gl_PointSize*=1.0/-viewPosition.z;

      // 粒子大小小于1是还在，但是windows要求粒子大小不能小于1，把他放在远处，不去渲染
      if(gl_PointSize<1.0){gl_Position=vec4(9999.9);}
    }`,fragmentShader:`
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    void main(){
      //用于表示当前片元在其所属点图元（如点精灵）内的相对坐标 gl_PointCoord
      // vec4 textureColor=texture(uTexture,gl_PointCoord);
      // gl_FragColor=textureColor;
      float textureAlpha=texture(uTexture,gl_PointCoord).r;// 取通道的某一个值
      // gl_FragColor=vec4(1.0,1.0,1.0,textureAlpha);
      gl_FragColor=vec4(uColor,textureAlpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,uniforms:{uSize:{value:m},uResolution:{value:i.resolution},uTexture:{value:c},uColor:{value:w},uProgress:{value:0}},transparent:!0,depthWrite:!1,blending:ds}),x=new gs(g,P);x.position.copy(r),t.add(x);const j=()=>{t.remove(x),g.dispose(),P.dispose()};Cs.to(P.uniforms.uProgress,{value:1,duration:3,ease:"none",onComplete:j})},A=new us;A.scale.setScalar(45e3),t.add(A);const T=new v,a={turbidity:10,rayleigh:3,mieCoefficient:.005,mieDirectionalG:.95,elevation:-2.2,azimuth:180,exposure:n.toneMappingExposure};function k(){h.add({create:()=>{const c=Math.round(1400+Math.random()*1e3),D=new v((Math.random()-.5)*2,Math.random(),(Math.random()-.5)*2),w=.1+Math.random()*.1,E=W.load("/threeProjectDocs/xingxing.png"),C=.5+Math.random()+2,d=new ps;d.setHSL(Math.random(),1,.7),N(c,D,w,E,C,d)}},"create").name("烟花宜落日，丝管醉春风");const s=A.material.uniforms;s.turbidity.value=a.turbidity,s.rayleigh.value=a.rayleigh,s.mieCoefficient.value=a.mieCoefficient,s.mieDirectionalG.value=a.mieDirectionalG;const r=G.degToRad(90-a.elevation),m=G.degToRad(a.azimuth);T.setFromSphericalCoords(1,r,m),s.sunPosition.value.copy(T),n.toneMappingExposure=a.exposure,n.render(t,p)}function U(){h.add(a,"turbidity",0,20,.1).onChange(k),h.add(a,"rayleigh",0,4,.001).onChange(k),h.add(a,"mieCoefficient",0,.1,.001).onChange(k),h.add(a,"mieDirectionalG",0,1,.001).onChange(k),h.add(a,"elevation",-3,90,.01).onChange(k),h.add(a,"azimuth",-180,180,.1).onChange(k),h.add(a,"exposure",0,1,1e-4).onChange(k),k()}return(s,r)=>(L(),V($,null,[M("div",{ref_key:"ddd",ref:l,style:{width:"100%",height:"100%"}},null,512),M("div",{id:"aaa",ref_key:"a",ref:B},null,512)],64))}},fs=Y(Bs,[["__scopeId","data-v-c45b0a3a"]]),As={style:{height:"500px",width:"100%"}},Ss=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fiftythreeFile.md","filePath":"fiftythreeFile.md"}'),ms={name:"fiftythreeFile.md"},Rs=Object.assign(ms,{setup(O){const{site:l,theme:B,page:t,frontmatter:p}=Q();return(n,o)=>{const y=X("ClientOnly");return L(),V("div",null,[M("div",As,[H(y,null,{default:Z(()=>[H(fs)]),_:1})]),o[0]||(o[0]=ss("",2))])}}});export{Ss as __pageData,Rs as default};
