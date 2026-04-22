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