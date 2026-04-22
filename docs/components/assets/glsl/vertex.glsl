// 注意：必写；分号！！！
// 不能写console和print！！！


// 包含3中类型信息
// uniform（统一值）  attribute（属性）  varying（变）
// varying会发送到片段着色器里
// 片段着色器只有 uniform  varying
// attribute是物体形状的attribute
// 如果片段着色器要访问attribute，通过varying发送


// 模型矩阵  旋转平移缩放
uniform mat4 modelMatrix;
// 视图矩阵，相机矩阵   离相机，视图的远近
uniform mat4 viewMatrix;
// 投影矩阵 将坐标转换为最终的裁剪空间坐标
uniform mat4 projectionMatrix;

// 可以把模型和视图连接起来做一个
// uniform mat4 modelViewMatrix;


attribute vec3 position;

// 命名要和自定义添加的属性的名字一致
attribute float aMyrandom;

// 这个最终会传输到片段着色器，命名不能和其他一致，如aMyrandom
varying float vMyrandom;

// 自定义的属性，要和材质里的命名一致
uniform float my1;
uniform vec2 my2;
uniform float utime;

attribute vec2 uv;
varying vec2 uuv;

varying float uyinying;

float fn(float a){
  float b=2.0;
  return a+b;
}

// 定义常量
#define PI 3.141592653589793

// 必包含main函数，返回值空，自动执行
void main(){
  // 变量初始化不能写在全局上，要写在函数内！！！

  // 浮点型
  float a=1.0;
  float b=2.0;
  // 加减乘除
  float c=a+b;

  // 整数型
  int d=1;
  int e=2;
  int f=d+e;

  // 浮点不能和整数相计算，要转化，浮点和浮点相计算只能是浮点，不是整数
  float g=a+float(d);
  
  bool tf=true;

  // 二维坐标，x，y   初始化x,y必须传值
  vec2 h=vec2(1.0,2.0);
  h.x=2.0;
  h.y=3.0;
  h*=2.0;

  vec3 i=vec3(0,0,0);
  vec3 j=vec3(1.0,2.0,3.0);

  vec3 k=vec3(h,4.0);
  vec3 k2=vec3(h.x,h.y,5.0);
  vec2 l=k.xy;
  vec2 l2=k.xz;
  //xy,xz,yx,yz,zx,zy...

  vec3 rgbcolor=vec3(1.0,1.0,1.0);
  rgbcolor.r=2.0;
  rgbcolor.g=2.0;
  rgbcolor.b=2.0;

  vec4 m=vec4(1.0,2.0,3.0,4.0);

  float res=fn(1.0);



  // 要实现gl_postion，按顺序相乘  坐标*模型*视图*投影
  vec4 modelPosition = modelMatrix * vec4(position,1.0);
  
  // modelPosition.z += 5.0;
  // modelPosition.x += 5.0;
  // modelPosition.z += sin( modelPosition.x * 100.0) * 0.9;

  // aMyrandom,随机数变化他的z
  // modelPosition.z +=aMyrandom*0.5;

  // 没有近亮远暗的阴影效果
  // modelPosition.z+=sin( my1 * modelPosition.x-utime) * 0.4;
  // modelPosition.z+=sin( my2.x * modelPosition.y-utime) * 0.4;
  // 添加近亮远暗的阴影效果
  float yinying=sin( my1 * modelPosition.x-utime) * 0.4;
  yinying+=sin( my2.x * modelPosition.y-utime) * 0.4;
  modelPosition.z=yinying;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  // gl_Position就是最终的坐标
  gl_Position = projectionPosition;
  // 简写
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);

  vMyrandom=aMyrandom;

  uuv=uv;

  uyinying=yinying;
}