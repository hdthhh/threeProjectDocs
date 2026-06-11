import{p as E,s as f,o as u,c as v,y as B,u as m,I as _,j as b,J as o,w,av as P}from"./chunks/framework.BB2QZFaM.js";import{S as z,P as A,W as D,A as S,G as I,g as M,m as T,j as H,h as L}from"./chunks/three.module.Bw-VuLTn.js";import{O as G}from"./chunks/OrbitControls.DnynEjGF.js";import{G as N}from"./chunks/GLTFLoader.CDa-noHW.js";import{D as O}from"./chunks/DRACOLoader.BqtDfez1.js";const R={__name:"fortynineFile",setup(g){const i=B(null),n=new z,l=new A(75,window.innerWidth/window.innerHeight,.1,1e3),s=new D({antialias:!0});s.setSize(window.innerWidth,window.innerHeight),s.shadowMap.enabled=!0;const h=new S(100);n.add(h);const e=new I(100,100);e.material.opacity=.2,e.material.transparent=!0,n.add(e);const t=new G(l,s.domElement);t.enableDamping=!0,t.dampingFactor=.01,l.position.set(10,10,10);let p=null,r;E(()=>{i.value.appendChild(s.domElement),k(),p=()=>{s.setSize(i.value.offsetWidth,i.value.offsetHeight),s.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),l.aspect=i.value.offsetWidth/i.value.offsetHeight,l.updateProjectionMatrix()},p(),window.addEventListener("resize",p)}),f(()=>{gui.destroy(),cancelAnimationFrame(r),n.traverse(a=>{a.geometry&&a.geometry.dispose(),a.material&&(Array.isArray(a.material)?a.material.forEach(c=>c.dispose()):a.material.dispose()),a.texture&&a.texture.dispose()}),n.clear(),s.forceContextLoss(),window.removeEventListener("resize",p)});function k(){t.update(),r=requestAnimationFrame(k),s.render(n,l)}new M;const d=new N,F=new O;F.setDecoderPath("/draco/"),d.setDRACOLoader(F);const y=new T(10,10,32,32),C=new H({vertexShader:`
    varying vec2 uuv;
    void main(){
      gl_Position= projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
      uuv=uv;
    }`,fragmentShader:`
    // 定义常量
    #define PI 3.141592653589793
    varying vec2 uuv;
    float random(vec2 num){
      return fract(sin(dot(num.xy,vec2(12.9898,78.233)))*43758.5453123);
    }
    vec2 rotate(vec2 uv, float rotation,vec2 mid){
      // 要旋转的坐标，旋转角度，旋转的中心点（绕中心点旋转）
      return vec2(
        cos(rotation)*(uv.x-mid.x)+sin(rotation)*(uv.y-mid.y)+mid.x,
        cos(rotation)*(uv.y-mid.y)-sin(rotation)*(uv.x-mid.x)+mid.y
      );
    }
    //	Classic Perlin 2D Noise 经典柏林噪音
    //	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
    //
    vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
    float cnoise(vec2 P){
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x,gy.x);
      vec2 g10 = vec2(gx.y,gy.y);
      vec2 g01 = vec2(gx.z,gy.z);
      vec2 g11 = vec2(gx.w,gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x;
      g01 *= norm.y;
      g10 *= norm.z;
      g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
      return 2.3 * n_xy;
    }
    void main(){
      // gl_FragColor=vec4(uuv.x,uuv.y,0.0,1.0);// 渐变
      // gl_FragColor=vec4(uuv.x,uuv.y,1.0,1.0);// 渐变
      // gl_FragColor=vec4(0.5,0.5,0.5,1.0);// 灰
      // gl_FragColor=vec4(uuv.x,uuv.x,uuv.x,1.0);// 白到黑
      // gl_FragColor=vec4(uuv.y,uuv.y,uuv.y,1.0);// 白到黑
      // gl_FragColor=vec4(1.0-uuv.y,1.0-uuv.y,1.0-uuv.y,1.0);// 黑到白
      // gl_FragColor=vec4(uuv.y*10.0,uuv.y*10.0,uuv.y*10.0,1.0);//一点点黑到白
      // gl_FragColor=vec4(mod(uuv.y*10.0,1.0),mod(uuv.y*10.0,1.0),mod(uuv.y*10.0,1.0),1.0);// 百叶窗
      // float a=mod(uuv.y*10.0,1.0);// 模运算，到10变0？
      // // 斑马纹，均匀的百叶窗
      // // a=step(0.5,a);// 类似三元，大于0.5是1，小于0.5是0，或者ifelse（）
      // a=step(0.8,a);
      // gl_FragColor=vec4(a,a,a,1.0);
      // float b=step(0.8,mod(uuv.x*10.0,1.0));
      // b+=step(0.8,mod(uuv.y*10.0,1.0));
      // gl_FragColor=vec4(b,b,b,1.0);// 象棋盘
      // float c=step(0.8,mod(uuv.x*10.0,1.0));
      // c*=step(0.8,mod(uuv.y*10.0,1.0));
      // gl_FragColor=vec4(c,c,c,1.0);// 粒子
      // float d=step(0.4,mod(uuv.x*10.0,1.0));
      // d*=step(0.8,mod(uuv.y*10.0,1.0));
      // gl_FragColor=vec4(d,d,d,1.0);// 线段
      // float x=step(0.8,mod(uuv.x*10.0,1.0));
      // x*=step(0.4,mod(uuv.y*10.0,1.0));
      // float y=step(0.4,mod(uuv.x*10.0,1.0));
      // y*=step(0.8,mod(uuv.y*10.0,1.0));
      // gl_FragColor=vec4(x+y,x+y,x+y,1.0);// 反转7直角
      // float x=step(0.8,mod(uuv.x*10.0,1.0));
      // x*=step(0.4,mod(uuv.y*10.0-0.2,1.0));
      // float y=step(0.4,mod(uuv.x*10.0-0.2,1.0));
      // y*=step(0.8,mod(uuv.y*10.0,1.0));
      // gl_FragColor=vec4(x+y,x+y,x+y,1.0);// 加号
      // gl_FragColor=vec4(abs(uuv.x-0.5),abs(uuv.x-0.5),abs(uuv.x-0.5),1.0);// 灰到黑到灰渐变
      // gl_FragColor=vec4(min(abs(uuv.x-0.5),abs(uuv.y-0.5)),min(abs(uuv.x-0.5),abs(uuv.y-0.5)),min(abs(uuv.x-0.5),abs(uuv.y-0.5)),1.0);// 灰到黑到灰渐变,x轴+y轴
      // gl_FragColor=vec4(max(abs(uuv.x-0.5),abs(uuv.y-0.5)),max(abs(uuv.x-0.5),abs(uuv.y-0.5)),max(abs(uuv.x-0.5),abs(uuv.y-0.5)),1.0);// 灰到黑到灰渐变,x轴+y轴,反向
      // gl_FragColor=vec4(step(0.2,max(abs(uuv.x-0.5),abs(uuv.y-0.5))),step(0.2,max(abs(uuv.x-0.5),abs(uuv.y-0.5))),step(0.2,max(abs(uuv.x-0.5),abs(uuv.y-0.5))),1.0);// 白的加个黑的，像画框
      // float a=step(0.2,max(abs(uuv.x-0.5),abs(uuv.y-0.5)));
      // float b=1.0-step(0.25,max(abs(uuv.x-0.5),abs(uuv.y-0.5)));
      // gl_FragColor=vec4(a*b,a*b,a*b,1.0);// 白的加个黑的，像画框,画框比例变小
      // gl_FragColor=vec4(floor(uuv.x*10.0)/10.0,floor(uuv.x*10.0)/10.0,floor(uuv.x*10.0)/10.0,1.0);//黑到白渐变，每10加段，形成一段一段
      // float a=floor(uuv.x*10.0)/10.0;
      // a*=floor(uuv.y*10.0)/10.0;
      // gl_FragColor=vec4(a,a,a,1.0);//黑到白渐变，每10加段，形成一段一段,x轴+y轴
      // float a=random(uuv);
      // gl_FragColor=vec4(a,a,a,1.0);// 使用函数，生成随机，像失效的电视机，雪花屏
      // vec2 b=vec2(floor(uuv.x*10.0)/10.0,floor(uuv.y*10.0)/10.0);
      // float a=random(b);
      // gl_FragColor=vec4(a,a,a,1.0);// 结合前两个，生成随机，大块的马赛克
      // vec2 b=vec2(floor(uuv.x*10.0)/10.0,floor(uuv.y*10.0+uuv.x*5.0)/10.0);
      // float a=random(b);
      // gl_FragColor=vec4(a,a,a,1.0);// 上一个版本的倾斜版本
      // gl_FragColor=vec4(length(uuv),length(uuv),length(uuv),1.0);// 沿左下到右上渐变，一点点黑到白
      // gl_FragColor=vec4(length(uuv-0.5),length(uuv-0.5),length(uuv-0.5),1.0);// 中心到四周渐变，黑到白
      // gl_FragColor=vec4(distance(uuv,vec2(0.5)),distance(uuv,vec2(0.5)),distance(uuv,vec2(0.5)),1.0);// 同上  distance：计算第二个参数的点到第一个参数的距离
      // gl_FragColor=vec4(1.0-distance(uuv,vec2(0.5)),1.0-distance(uuv,vec2(0.5)),1.0-distance(uuv,vec2(0.5)),1.0);// 上一个的反向
      // gl_FragColor=vec4(0.015/distance(uuv,vec2(0.5)),0.015/distance(uuv,vec2(0.5)),0.015/distance(uuv,vec2(0.5)),1.0);// 四周黑，中间有个小白点光
      // gl_FragColor=vec4(0.015/distance(vec2((uuv.x-0.5)*0.5+0.5,uuv.y),vec2(0.5)),0.015/distance(vec2((uuv.x-0.5)*0.5+0.5,uuv.y),vec2(0.5)),0.015/distance(vec2((uuv.x-0.5)*0.5+0.5,uuv.y),vec2(0.5)),1.0);// 四周黑，中间有个小白点光,小白光拉伸了
      // float a=0.15/(distance(vec2(uuv.y,(uuv.x-0.5)*5.0+0.5),vec2(0.5)));
      // a*=0.15/(distance(vec2(uuv.x,(uuv.y-0.5)*5.0+0.5),vec2(0.5)));
      // gl_FragColor=vec4(a,a,a,1.0);// 四周黑，中间有个小白点光,小白光拉伸了,x轴+y轴
      // vec2 rotateuv=rotate(uuv,PI*0.25,vec2(0.5));
      // float a=0.15/(distance(vec2(rotateuv.y,(rotateuv.x-0.5)*5.0+0.5),vec2(0.5)));
      // a*=0.15/(distance(vec2(rotateuv.x,(rotateuv.y-0.5)*5.0+0.5),vec2(0.5)));
      // gl_FragColor=vec4(a,a,a,1.0);// 四周黑，中间有个小白点光,小白光拉伸了,x轴+y轴,旋转45度
      // float a=step(0.25,distance(uuv,vec2(0.5)));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间黑圆，四周白
      // float a=abs(distance(uuv,vec2(0.5))-0.25);
      // gl_FragColor=vec4(a,a,a,1.0);// 中间黑环，四周渐变灰
      // float a=step(0.01,abs(distance(uuv,vec2(0.5))-0.25));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间黑环(细)，四周白
      // float a=1.0-step(0.01,abs(distance(uuv,vec2(0.5))-0.25));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间白环(细)，四周黑
      // vec2 aa=vec2(uuv.x,uuv.y+sin(30.0*uuv.x)*0.1);
      // float a=1.0-step(0.01,abs(distance(aa,vec2(0.5))-0.25));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间波浪白环(细)x，四周黑
      // vec2 aa=vec2(uuv.x+sin(30.0*uuv.y)*0.1,uuv.y+sin(30.0*uuv.x)*0.1);
      // float a=1.0-step(0.01,abs(distance(aa,vec2(0.5))-0.25));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间波浪白环(细)xy，四周黑
      // vec2 aa=vec2(uuv.x+sin(100.0*uuv.y)*0.1,uuv.y+sin(100.0*uuv.x)*0.1);
      // float a=1.0-step(0.01,abs(distance(aa,vec2(0.5))-0.25));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间波浪白环(细)xy，四周黑(效果加大版)
      // float a=atan(uuv.x,uuv.y);
      // gl_FragColor=vec4(a,a,a,1.0);// 左下角为圆心，从左往下渐变灰到白
      // float a=atan(uuv.x-0.5,uuv.y-0.5);
      // gl_FragColor=vec4(a,a,a,1.0);// 中间为圆心，从左往下渐变灰到白
      // float a=atan(uuv.x-0.5,uuv.y-0.5);
      // a/=(PI*2.0);
      // a+=0.5;
      // gl_FragColor=vec4(a,a,a,1.0);// 中间为圆心，从中下绕一圈渐变灰到白
      // float a=atan(uuv.x-0.5,uuv.y-0.5);
      // a/=(PI*2.0);
      // a+=0.5;
      // a*=20.0;
      // a=mod(a,1.0);
      // gl_FragColor=vec4(a,a,a,1.0);// 中间为圆心，从中下绕一圈渐变灰到白，频率变高点，形成一圈，类似花
      // float b=atan(uuv.x-0.5,uuv.y-0.5);
      // b/=(PI*2.0);
      // b+=0.5;
      // b=sin(b*100.0);
      // float c=0.25+b*0.02;
      // float a=1.0-step(0.01,abs(distance(uuv,vec2(0.5))-c));
      // gl_FragColor=vec4(a,a,a,1.0);// 中间白环波浪(细)
      // 柏林噪声（Perlin Noise）
      // float a=cnoise(uuv*10.0);
      // gl_FragColor=vec4(a,a,a,1.0);// 随机噪点，可生成云，草之类的随机物体
      // float a=step(0.0,cnoise(uuv*10.0));
      // gl_FragColor=vec4(a,a,a,1.0);// 清晰随机噪点
      // float a=1.0-abs(cnoise(uuv*10.0));
      // gl_FragColor=vec4(a,a,a,1.0);// 略清晰随机噪点线状
      float a=step(0.9,sin(cnoise(uuv*10.0)*20.0));
      // gl_FragColor=vec4(a,a,a,1.0);// 清晰随机噪点线状

      // 设置界限，不小于0，不大于1
      a=clamp(a,0.0,1.0);

      // 添加颜色
      vec3 blackColor=vec3(0.0);
      vec3 uuvColor=vec3(uuv,1.0);
      vec3 mixColor=mix(blackColor,uuvColor,a);// 使用以上任意一个图案效果
      gl_FragColor=vec4(mixColor,1.0);
    }`}),x=new L(y,C);return n.add(x),(a,c)=>(u(),v("div",{ref_key:"ddd",ref:i,style:{width:"100%",height:"100%"}},null,512))}},W={style:{height:"500px",width:"100%"}},Q=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"fortynineFile.md","filePath":"fortynineFile.md"}'),V={name:"fortynineFile.md"},X=Object.assign(V,{setup(g){const{site:i,theme:n,page:l,frontmatter:s}=m();return(h,e)=>{const t=_("ClientOnly");return u(),v("div",null,[b("div",W,[o(t,null,{default:w(()=>[o(R)]),_:1})]),e[0]||(e[0]=P("",2))])}}});export{Q as __pageData,X as default};
