//顶点着色器代码
var VERT_SHADER_SRC = `
void main()     
{                                   
   gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
   gl_PointSize = 50.0;
}
`;
//片元着色器代码
var FRAG_SHADER_SRC = `
void main()
{
  gl_FragColor=vec4(1.0, 0.0, 0.0, 1.0);
}
`;

