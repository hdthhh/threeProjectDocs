import{_ as J,p as X,s as Y,aI as $,o as S,c as H,j as T,G as K,y as M,u as Q,I as ss,b as is,w as P,J as G,aJ as as,av as ns}from"./chunks/framework.BB2QZFaM.js";import{ax as b,j,b4 as ls,b8 as I,bj as U,b6 as hs,az as q,S as ts,P as ks,W as ps,A as es,G as rs,n as Es,g as ds,U as u,h as gs,m as ys,p as Fs,B as cs,v as N,V as os,d as us}from"./chunks/three.module.D5qQolFO.js";import{O as Cs}from"./chunks/OrbitControls.CZYzlWQ2.js";import{G as ms}from"./chunks/GLTFLoader.xlHx5I9H.js";import{D as Bs}from"./chunks/DRACOLoader.FEHMxHBB.js";import{g as As}from"./chunks/lil-gui.module.min.DqZR5HPe.js";import{s as Ds}from"./chunks/simplexNoise4d.CPIm_TBs.js";import{F as fs}from"./chunks/Pass.DE9dZ9A9.js";class xs{constructor(y,c,t){this.variables=[],this.currentTextureIndex=0;let B=I;const F={passThruTexture:{value:null}},E=A(D(),F),k=new fs(E);this.setDataType=function(i){return B=i,this},this.addVariable=function(i,s,l){const p=this.createShaderMaterial(s),n={name:i,initialValueTexture:l,material:p,dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:b,magFilter:b};return this.variables.push(n),n},this.setVariableDependencies=function(i,s){i.dependencies=s},this.init=function(){if(t.capabilities.maxVertexTextures===0)return"No support for vertex shader textures.";for(let i=0;i<this.variables.length;i++){const s=this.variables[i];s.renderTargets[0]=this.createRenderTarget(y,c,s.wrapS,s.wrapT,s.minFilter,s.magFilter),s.renderTargets[1]=this.createRenderTarget(y,c,s.wrapS,s.wrapT,s.minFilter,s.magFilter),this.renderTexture(s.initialValueTexture,s.renderTargets[0]),this.renderTexture(s.initialValueTexture,s.renderTargets[1]);const l=s.material,p=l.uniforms;if(s.dependencies!==null)for(let n=0;n<s.dependencies.length;n++){const e=s.dependencies[n];if(e.name!==s.name){let o=!1;for(let C=0;C<this.variables.length;C++)if(e.name===this.variables[C].name){o=!0;break}if(!o)return"Variable dependency not found. Variable="+s.name+", dependency="+e.name}p[e.name]={value:null},l.fragmentShader=`
uniform sampler2D `+e.name+`;
`+l.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){const i=this.currentTextureIndex,s=this.currentTextureIndex===0?1:0;for(let l=0,p=this.variables.length;l<p;l++){const n=this.variables[l];if(n.dependencies!==null){const e=n.material.uniforms;for(let o=0,C=n.dependencies.length;o<C;o++){const r=n.dependencies[o];e[r.name].value=r.renderTargets[i].texture}}this.doRenderTarget(n.material,n.renderTargets[s])}this.currentTextureIndex=s},this.getCurrentRenderTarget=function(i){return i.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(i){return i.renderTargets[this.currentTextureIndex===0?1:0]},this.dispose=function(){k.dispose();const i=this.variables;for(let s=0;s<i.length;s++){const l=i[s];l.initialValueTexture&&l.initialValueTexture.dispose();const p=l.renderTargets;for(let n=0;n<p.length;n++)p[n].dispose()}};function v(i){i.defines.resolution="vec2( "+y.toFixed(1)+", "+c.toFixed(1)+" )"}this.addResolutionDefine=v;function A(i,s){s=s||{};const l=new j({name:"GPUComputationShader",uniforms:s,vertexShader:x(),fragmentShader:i});return v(l),l}this.createShaderMaterial=A,this.createRenderTarget=function(i,s,l,p,n,e){return i=i||y,s=s||c,l=l||q,p=p||q,n=n||b,e=e||b,new ls(i,s,{wrapS:l,wrapT:p,minFilter:n,magFilter:e,format:U,type:B,depthBuffer:!1})},this.createTexture=function(){const i=new Float32Array(y*c*4),s=new hs(i,y,c,U,I);return s.needsUpdate=!0,s},this.renderTexture=function(i,s){F.passThruTexture.value=i,this.doRenderTarget(E,s),F.passThruTexture.value=null},this.doRenderTarget=function(i,s){const l=t.getRenderTarget(),p=t.xr.enabled,n=t.shadowMap.autoUpdate;t.xr.enabled=!1,t.shadowMap.autoUpdate=!1,k.material=i,t.setRenderTarget(s),k.render(t),k.material=E,t.xr.enabled=p,t.shadowMap.autoUpdate=n,t.setRenderTarget(l)};function x(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function D(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}}const vs={__name:"sixtyoneFile",async setup(R){let y,c;const t=M(null),B=M(null),F=new ts,E=new ks(35,window.innerWidth/window.innerHeight,.1,1e3),k=new ps({antialias:!0,powerPreference:"low-power",preserveDrawingBuffer:!1});k.setSize(window.innerWidth,window.innerHeight),k.shadowMap.enabled=!0,k.setPixelRatio(Math.min(window.devicePixelRatio,1.5));const v=new es(100);F.add(v);const A=new rs(100,100);A.material.opacity=.2,A.material.transparent=!0,F.add(A);const x=new Cs(E,k.domElement);x.enableDamping=!0,x.dampingFactor=.01,E.position.set(10,10,10);let D=null,i=null;X(()=>{t.value.appendChild(k.domElement),n(),i=new As({container:B.value}),L(),D=()=>{d.material.uniforms.uResolution.value.set(t.value.offsetWidth*window.devicePixelRatio,t.value.offsetHeight*window.devicePixelRatio),k.setSize(t.value.offsetWidth,t.value.offsetHeight),k.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),E.aspect=t.value.offsetWidth/t.value.offsetHeight,E.updateProjectionMatrix()},D(),window.addEventListener("resize",D)}),Y(()=>{i.destroy(),cancelAnimationFrame(s),F.traverse(h=>{h.geometry&&h.geometry.dispose(),h.material&&(Array.isArray(h.material)?h.material.forEach(g=>g.dispose()):h.material.dispose()),h.texture&&h.texture.dispose()}),F.clear(),k.forceContextLoss(),window.removeEventListener("resize",D)});let s;const l=new Es;let p=0;function n(){const h=l.getElapsedTime(),g=h-p;p=h,a.computation.compute(),d.material.uniforms.uParticlesTexture.value=a.computation.getCurrentRenderTarget(a.particlesVariable).texture,a.particlesVariable.material.uniforms.uTime.value=h,a.particlesVariable.material.uniforms.uDeltaTime.value=g,x.update(),s=requestAnimationFrame(n),k.render(F,E)}new ds;const e=new ms,o=new Bs;o.setDecoderPath("/threeProjectDocs/draco/"),e.setDRACOLoader(o);const C=([y,c]=$(()=>e.loadAsync("/threeProjectDocs/boat.glb")),y=await y,c(),y);console.log(C);const r={};r.instance=C.scene.children[0].geometry,r.count=r.instance.attributes.position.count;const a={};a.size=Math.ceil(Math.sqrt(r.count)),a.computation=new xs(a.size,a.size,k);const f=a.computation.createTexture();for(let h=0;h<r.count;h++){const g=h*3,m=h*4;f.image.data[m+0]=r.instance.attributes.position.array[g+0],f.image.data[m+1]=r.instance.attributes.position.array[g+1],f.image.data[m+2]=r.instance.attributes.position.array[g+2],f.image.data[m+3]=Math.random()}let O=`
uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;

${Ds}

void main(){
  float time =uTime * 0.2;
  vec2 uv= gl_FragCoord.xy/resolution.xy;
  vec4 particle =texture(uParticles,uv);
  vec4 base =texture(uBase,uv);
  // particle.x+=0.01;

  if(particle.a >= 1.0){
    // particle.a = 0.0;
    particle.a=mod(particle.a,1.0);
    // particle.a=fract(particle.a);
    particle.xyz=base.xyz;
  }
  else {
    // float strength =simplexNoise4d(vec4(base.xyz,time + 1.0));
    float strength =simplexNoise4d(vec4(base.xyz*0.2,time + 1.0));
    float influence =(uFlowFieldInfluence-0.5)*(-2.0);
    // strength=smoothstep(-1.0,1.0,strength);
    // strength=smoothstep(0.0,1.0,strength);
    strength=smoothstep(influence,1.0,strength);

    // vec3 flowField = vec3(
    //   simplexNoise4d(vec4(particle.xyz + 0.0,time)),
    //   simplexNoise4d(vec4(particle.xyz + 1.0,time)),
    //   simplexNoise4d(vec4(particle.xyz + 2.0,time))
    // );
    vec3 flowField = vec3(
      simplexNoise4d(vec4(particle.xyz *uFlowFieldFrequency + 0.0,time)),
      simplexNoise4d(vec4(particle.xyz *uFlowFieldFrequency + 1.0,time)),
      simplexNoise4d(vec4(particle.xyz *uFlowFieldFrequency + 2.0,time))
    );
    flowField = normalize(flowField);
    // particle.xyz += flowField*0.01;
    // particle.xyz += flowField*uDeltaTime*0.5;
    // particle.xyz += flowField*uDeltaTime*strength*0.5;
    particle.xyz += flowField*uDeltaTime*strength*uFlowFieldStrength;

    // particle.a+=0.01;
    particle.a+=uDeltaTime*0.3;
  }
  

  gl_FragColor=particle;
}`;a.particlesVariable=a.computation.addVariable("uParticles",O,f),a.computation.setVariableDependencies(a.particlesVariable,[a.particlesVariable]),a.particlesVariable.material.uniforms.uTime=new u(0),a.particlesVariable.material.uniforms.uDeltaTime=new u(0),a.particlesVariable.material.uniforms.uBase=new u(f),a.particlesVariable.material.uniforms.uFlowFieldInfluence=new u(.5),a.particlesVariable.material.uniforms.uFlowFieldStrength=new u(2),a.particlesVariable.material.uniforms.uFlowFieldFrequency=new u(.5),a.computation.init(),a.debug=new gs(new ys(3,3),new Fs({map:a.computation.getCurrentRenderTarget(a.particlesVariable).texture})),a.debug.position.x=3,a.debug.visible=!1,F.add(a.debug);const d={},z=new Float32Array(r.count*2),_=new Float32Array(r.count);for(let h=0;h<a.size;h++)for(let g=0;g<a.size;g++){const m=h*a.size+g,V=m*2,W=(g+.5)/a.size,Z=(h+.5)/a.size;z[V+0]=W,z[V+1]=Z,_[m]=Math.random()}d.geometry=new cs,d.geometry.setDrawRange(0,r.count),d.geometry.setAttribute("aParticlesUv",new N(z,2)),d.geometry.setAttribute("aColor",r.instance.attributes.color),d.geometry.setAttribute("aSize",new N(_,1)),d.material=new j({vertexShader:`
  uniform vec2 uResolution;
  uniform float uSize;
  uniform sampler2D uParticlesTexture;

  attribute vec2 aParticlesUv;
  attribute vec3 aColor;
  attribute float aSize;

  varying vec3 vColor;

  void main(){
    vec4 particle = texture(uParticlesTexture,aParticlesUv);

    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float sizeIn=smoothstep(0.0,0.1,particle.a);
    float sizeOut=1.0-smoothstep(0.7,1.0, particle.a);
    float size = min(sizeIn, sizeOut);

    // Point size
    // gl_PointSize = uSize * uResolution.y;
    // gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize = size * aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // vColor = vec3(1.0);
    vColor = aColor;
  }`,fragmentShader:`
  varying vec3 vColor;

  void main(){
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if(distanceToCenter > 0.5)
        discard;
    
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`,uniforms:{uSize:new u(.07),uResolution:new u(new os(window.innerWidth*window.devicePixelRatio,window.innerHeight*window.devicePixelRatio)),uParticlesTexture:new u}}),d.points=new us(d.geometry,d.material),F.add(d.points);const w={};w.clearColor="#29191f",k.setClearColor(w.clearColor);function L(){i.addColor(w,"clearColor").onChange(()=>{k.setClearColor(w.clearColor)}),i.add(d.material.uniforms.uSize,"value").min(0).max(1).step(.001).name("uSize"),i.add(a.particlesVariable.material.uniforms.uFlowFieldInfluence,"value").min(0).max(1).name("uFlowFieldInfluence"),i.add(a.particlesVariable.material.uniforms.uFlowFieldStrength,"value").min(0).max(10).name("uFlowFieldStrength"),i.add(a.particlesVariable.material.uniforms.uFlowFieldFrequency,"value").min(0).max(1).step(.001).name("uFlowFieldFrequency")}return(h,g)=>(S(),H(K,null,[T("div",{ref_key:"ddd",ref:t,style:{width:"100%",height:"100%"}},null,512),T("div",{id:"aaa",ref_key:"a",ref:B},null,512)],64))}},ws=J(vs,[["__scopeId","data-v-409b4fb4"]]),bs={style:{height:"500px",width:"100%",position:"relative"}},Is=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"sixtyoneFile.md","filePath":"sixtyoneFile.md"}'),Ts={name:"sixtyoneFile.md"},Us=Object.assign(Ts,{setup(R){const{site:y,theme:c,page:t,frontmatter:B}=Q();return(F,E)=>{const k=ss("ClientOnly");return S(),H("div",null,[(S(),is(as,null,{default:P(()=>[T("div",bs,[G(k,null,{default:P(()=>[G(ws)]),_:1})])]),fallback:P(()=>[...E[0]||(E[0]=[T("div",{class:"loading"},"加载中...",-1)])]),_:1})),E[1]||(E[1]=ns("",3))])}}});export{Is as __pageData,Us as default};
