//通过canvas获取gl context，可以传入额外参数
//兼容几种浏览器的获取方式
function getWebGLContext(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var i = 0; i < names.length; ++i) {
      try {
        context = canvas.getContext(names[i], opt_attribs);
      } catch(e) {}
      if (context) {
        break;
      }
    }
    return context;
  }
  
  //初始化着色器，传入GL contest、顶点着色器代码、片元着色器代码
  function initShaders(gl, vshader, fshader) {
      //创建着色程序，实际上返回的int值，相当于底层的一个句柄引用
      var program = createProgram(gl, vshader, fshader);
      if (!program) {
        console.log('Failed to create program');
        return false;
      }
      //指定这个gl context使用这个着色程序
      gl.useProgram(program);
      gl.program = program;
      return true;
  }
  
//创建着色程序
function createProgram(gl, vshader, fshader) {
    //分别编译加载顶点着色器和片元着色器代码，实际上返回的也是int类型
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
      return null;
    }
    //首先创建一个程序，获取这个程序的句柄引用
    var program = gl.createProgram();
    if (!program) {
      return null;
    }
    //然后把这个程序绑定着色器
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接程序，是不是和c语言的编译很像？
    gl.linkProgram(program);

    //获取program的链接情况，如果链接失败则进行清理
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      var error = gl.getProgramInfoLog(program);
      console.log('Failed to link program: ' + error);
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      return null;
    }
    return program;
}

//加载编译着色器代码
function loadShader(gl, type, source) {
    //创建一个新的着色器
    var shader = gl.createShader(type);
    if (shader == null) {
      console.log('unable to create shader');
      return null;
    }
    ///加载着色器的源代码
    gl.shaderSource(shader, source);
    //编译着色器代码
    gl.compileShader(shader);
    //获取着色器的编译情况，如果编译失败则进行处理
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      var error = gl.getShaderInfoLog(shader);
      console.log('Failed to compile shader: ' + error);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
}
//主程序入口
function main() {
    //获取<canvas>标签
    var canvas = document.getElementById('webgl');
    if(!canvas) {
      console.log('Failed to retrieve the <canvas> element');
      return;
    }
    //获取web gl context
    var gl = getWebGLContext(canvas);
    if(!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    //初始化着色器
    if (!initShaders(gl, VERT_SHADER_SRC, FRAG_SHADER_SRC)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    //设置canvas的背景颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空颜色缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //画上一个点
    gl.drawArrays(gl.POINTS, 0, 1);
  }