var t=`vec3 AmbientLight(vec3 lightColor,float lightIntensity){\r
  return lightColor*lightIntensity;\r
}\r
vec3 DirectionalLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower){\r
  vec3 lightDirection=normalize(lightPosition);\r
  vec3 lightRlflection=reflect(-lightDirection,normal);
  float shading=dot(normal,lightDirection);\r
  
  shading=max(0.0,shading);\r
  float specular = -dot(lightRlflection,viewDirection);
  specular=max(0.0,specular);\r
  specular=pow(specular,specularPower);\r
  return lightColor*lightIntensity*(shading+specular);\r
  
  
}\r
vec3 PointLight(vec3 lightColor,float lightIntensity,vec3 normal,vec3 lightPosition,vec3 viewDirection,float specularPower,vec3 position,float lightdecay){\r
  vec3 lightDelta=lightPosition-position;\r
  float lightDistance=length(lightDelta);\r
  vec3 lightDirection=normalize(lightDelta);\r
  vec3 lightRlflection=reflect(-lightDirection,normal);
  float shading=dot(normal,lightDirection);\r
  
  shading=max(0.0,shading);\r
  float specular = -dot(lightRlflection,viewDirection);
  specular=max(0.0,specular);\r
  specular=pow(specular,specularPower);\r
  float decay=1.0-lightDistance*lightdecay;\r
  decay=max(0.0,decay);\r
  return lightColor*lightIntensity*decay*(shading+specular);\r
  
  
  
}`;export{t as l};
