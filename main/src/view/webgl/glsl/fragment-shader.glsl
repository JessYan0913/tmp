// 片段着色器没有默认精度，所以我们需要设置一个精度
// mediump是一个不错的默认值，代表“medium precision”（中等精度）
precision mediump float;

void main(){
  // gl_FragColor是一个片段着色器主要设置的变量
  // v0 红色 v1 绿色 v2 蓝色 v3 阿尔法通道
  gl_FragColor=vec4(1,0,.5,1);// 返回“瑞迪施紫色”
}
