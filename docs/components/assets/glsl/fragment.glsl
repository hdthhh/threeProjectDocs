// 精度设置
precision mediump float;

// 和顶点着色器书写一致
varying float vMyrandom;

uniform vec3 ucolor;

// 加载纹理
uniform sampler2D mytexture;

varying vec2 uuv;

varying float uyinying;

void main(){
  // 使用传入的随机数数组动态
  // gl_FragColor=vec4(0.1,vMyrandom,0.0,0.5);

  // 使用传入的color
  // gl_FragColor=vec4(ucolor,1.0);

  // gl_FragColor=vec4(1.0,0.0,0.0,1.0);

  // 传入的纹理
  vec4 texturecolor=texture2D(mytexture,uuv);
  texturecolor.rgb*=uyinying;
  gl_FragColor=texturecolor;
}