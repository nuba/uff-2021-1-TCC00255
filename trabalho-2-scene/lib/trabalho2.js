'use strict';

let gl,
    program,

    //Define o vetor de translação em z
    translationVector = [0.0, 0.0, -20.0],

    //Define um vetor com ângulos de rotação em cada um dos eixos (x,y,z)
    rotationVector    = [15.0, 15.0, 0.0],

    //Criar a matriz de camera e modelagem 4x4
    modelViewMatrix,

    //Cria a matriz de projeção 4x4
    projectionMatrix,

    // Global variable that captures the current rendering mode type
    renderingMode     = 'TRIANGLES',
    myMatrixStack;

//Função que constroi um shader (Vertex ou Fragment shader)
function getShader(id) {
  const script       = document.getElementById(id);
  const shaderString = script.text.trim();

  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initProgram() {
  const vertexShader   = getShader('vertex-shader');
  const fragmentShader = getShader('fragment-shader');

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  gl.useProgram(program);

  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aVertexColor    = gl.getAttribLocation(program, 'aVertexColor');
  program.aVertexNormal   = gl.getAttribLocation(program, 'aVertexNormal');

  program.uModelViewMatrix  = gl.getUniformLocation(program, 'uModelViewMatrix');
  program.uNormalMatrix     = gl.getUniformLocation(program, 'uNormalMatrix');
  program.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');

  program.aTextureCoordinate = gl.getAttribLocation(program, 'aTextureCoordinate');
  program.uTextureActive     = gl.getUniformLocation(program, 'uTextureActive');
  program.uSampler           = gl.getUniformLocation(program, 'uSampler');

  program.uLightPosition   = gl.getUniformLocation(program, 'uLightPosition');
  program.uLightAmbient    = gl.getUniformLocation(program, 'uLightAmbient');
  program.uLightDiffuse    = gl.getUniformLocation(program, 'uLightDiffuse');
  program.uMaterialDiffuse = gl.getUniformLocation(program, 'uMaterialDiffuse');
  program.uWireframe       = gl.getUniformLocation(program, 'uWireframe');

}

function computeNormalMatrix(modelViewMatrix) {
  var normalMatrix = mat4.create();
  // define normal matrix s
  mat4.identity(normalMatrix);
  mat4.copy(normalMatrix, modelViewMatrix);
  mat4.invert(normalMatrix, normalMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  return normalMatrix;
}

function setProgramMatrices(program, modelViewMatrix) {
  gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
  var normalMatrix = computeNormalMatrix(modelViewMatrix);
  gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
}

function setCameraMatrices() {
  //Atualiza as matrizes de transformação de câmera e projeção
  var tv = vec3.create();
  vec3.set(tv, translationVector[0], translationVector[1], translationVector[2]);

  mat4.identity(modelViewMatrix);
  mat4.translate(modelViewMatrix, modelViewMatrix, tv);
  mat4.rotateX(modelViewMatrix, modelViewMatrix, rotationVector[0] * Math.PI / 180);
  mat4.rotateY(modelViewMatrix, modelViewMatrix, rotationVector[1] * Math.PI / 180);
  mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotationVector[2] * Math.PI / 180);

  //Evia a matriz projeção para o shader
  //gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
  //gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
  gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function render() {
  setCameraMatrices();
  // itera sobre elementos do cenário invocando draw
}

function init() {
  const canvas = utils.getCanvas('webgl-canvas');

  gl = utils.getGLContext(canvas);
  gl.clearColor(0, 128, 128, 1);
  gl.enable(gl.DEPTH_TEST);

  initProgram();

  // aqui cria a "paleta" de sólidos necessários

  myMatrixStack = new MyStack();
  var tv        = vec3.create();
  vec3.set(tv, translationVector[0], translationVector[1], translationVector[2]);
  modelViewMatrix = mat4.create();
  mat4.fromTranslation(modelViewMatrix, tv);

  projectionMatrix = mat4.create();
  //Cria a matriz de projeção com angulo de abertura de 45 graus, near plane = 0.1 e far_plane = 1000
  mat4.identity(projectionMatrix);
  mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 1000);

  // Configure lights
  gl.uniform3fv(program.uLightPosition, [0, 100, 100]);
  gl.uniform4fv(program.uLightAmbient, [0.10, 0.10, 0.10, 1]);
  gl.uniform4fv(program.uLightDiffuse, [1, 1, 1, 1]);
  gl.uniform1i(program.uSampler, 0);

  render();
}

window.onload = init;
