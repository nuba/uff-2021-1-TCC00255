'use strict';

let gl,
    program,

    //Define o vetor de translação em z
    translationVector = [0, 0, -90],

    //Define um vetor com ângulos de rotação em cada um dos eixos (x,y,z)
    rotationVector    = [-70, 0, -61],

    //Cria a matriz de projeção 4x4
    projectionMatrix,

    // Global variable that captures the current rendering mode type
    renderingMode     = 'TRIANGLES',

    // um unico objeto de modelo global, do tipo ModelTree
    scene;

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
  // Atualiza as matrizes de transformação de câmera e projeção
  // Envia a matriz projeção para o shader
  gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function render() {
  setCameraMatrices();
  scene.draw(renderingMode);
}

function init() {
  function logGLCall(functionName, args) {
    return;
    console.log('gl.' + functionName + '(' +
                WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
  }

  function validateNoneOfTheArgsAreUndefined(functionName, args) {
    for (var ii = 0; ii < args.length; ++ii) {
      if (args[ii] === undefined) {
        console.error('undefined passed to gl.' + functionName + '(' +
                      WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')');
      }
    }
  }

  function logAndValidate(functionName, args) {
    logGLCall(functionName, args);
    validateNoneOfTheArgsAreUndefined(functionName, args);
  }

  const canvas  = utils.getCanvas('webgl-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  gl = utils.getGLContext(canvas);
  gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logAndValidate);

  gl.clearColor(0, 128, 128, 1);
  gl.enable(gl.DEPTH_TEST);

  initProgram();

  // aqui cria a "paleta" de sólidos necessários
  let creatureCylinderBodyPart = new MyCylinder(
      program,
      gl,
      1,
      1,
      16,
      16,
      new Color(1, 1, 0),
      'textures/Plaster06-1k/Plasteryellow_diffuse 1k.png');
  scene                        = new ModelTree({
    translate   : [translationVector[0], translationVector[1], translationVector[2]],
    rotate      : [rotationVector[0], rotationVector[1], rotationVector[2]],
    scale       : [1, 1, 1],
    childrenList: [
      {
        slug        : 'terrain',
        model       : new TerrainShape3d({
          program,
          gl,
          color            : new Color(1.0, 0.0, 0.0),
          textureName      : 'textures/Dirt01-1k/Dirt01 diffuse 1k.jpg',
          mMin             : -50,
          nMin             : -50,
          mMax             : 50,
          nMax             : 50,
          fatorInterpolacao: 20,

          // zValues tem que ser uma matriz quadrada
          zValues: [
            [-1, 0, 0, 5, 5, 10, 10],
            [-1, 0, 5, 5, 5, 10, 10],
            [-1, 0, 5, 5, 5, 5, 5],
            [-1, 0, 5, 5, 5, 5, 5],
            [-1, 0, 5, 5, 5, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, 0],
          ],
        }),
        childrenList: [
          {
            slug     : 'monolito',
            model    : new MyCube(program, gl, undefined, 'textures/leather07-1k/leather07 diffuse 1k.png'),
            scale    : [1, 4, 9],
            translate: [0, 0, 14],
          },
          {
            slug        : 'hand',
            translate   : [8, -24, 6.5],
            rotate      : [90, 90, 10],
            childrenList: [
              {
                slug     : 'opositor1',
                scale    : [1.2, 0.8, 1.7],
                rotate   : [0, -75, 0],
                // translate: [-1, 0, 1],
                translate: [-3, 0, 0],
                model    : creatureCylinderBodyPart,
                childrenList: [
                  {
                    slug        : 'opositor2',
                    model       : creatureCylinderBodyPart,
                    scale       : [0.9, 0.9, 2.7],
                    rotate      : [15, 55, 0],
                    translate   : [0, -0.2, 1.6],
                    childrenList: [
                      {
                        slug     : 'opositor3',
                        model    : creatureCylinderBodyPart,
                        scale    : [0.6, 0.6, 1.5],
                        rotate   : [5, 20, 0],
                        translate: [0, 0, 2.7]
                      },
                    ],
                  },
                ]
              },
              {
                slug        : 'miolo1',
                scale       : [3, 1, 3],
                rotate      : [0, 0, 0],
                translate   : [0, 0, 0],
                model       : creatureCylinderBodyPart,
                childrenList: [
                  {
                    slug        : 'miolo2',
                    scale       : [3, 1, 2],
                    rotate      : [10, 0, 0],
                    translate   : [0, 0, 3],
                    model       : creatureCylinderBodyPart,
                    childrenList: [
                      {
                        slug        : 'd1a',
                        model       : creatureCylinderBodyPart,
                        scale       : [0.5, 0.5, 2.5],
                        rotate      : [10, 0, 0],
                        translate   : [-2.5, 0, 2],
                        childrenList: [
                          {
                            slug     : 'd1b',
                            model    : creatureCylinderBodyPart,
                            scale    : [0.4, 0.4, 2],
                            rotate   : [15, 0, 0],
                            translate: [0, 0, 2.5],
                            childrenList: [
                              {
                                slug     : 'd1c',
                                model    : creatureCylinderBodyPart,
                                scale    : [0.3, 0.3, 1.5],
                                rotate   : [10, 0, 0],
                                translate: [0, 0, 2],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        slug        : 'd2a',
                        model       : creatureCylinderBodyPart,
                        scale       : [0.5, 0.5, 2.8],
                        rotate      : [10, 0, 0],
                        translate   : [-1, 0, 2],
                        childrenList: [
                          {
                            slug     : 'd2b',
                            model    : creatureCylinderBodyPart,
                            scale    : [0.4, 0.4, 2.2],
                            rotate   : [15, 0, 0],
                            translate: [0, 0, 2.8],
                            childrenList: [
                              {
                                slug     : 'd2c',
                                model    : creatureCylinderBodyPart,
                                scale    : [0.3, 0.3, 1.5],
                                rotate   : [10, 0, 0],
                                translate: [0, 0, 2.2],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        slug        : 'd3a',
                        model       : creatureCylinderBodyPart,
                        scale       : [0.5, 0.5, 2.6],
                        rotate      : [10, 0, 0],
                        translate   : [1, 0, 2],
                        childrenList: [
                          {
                            slug     : 'd3b',
                            model    : creatureCylinderBodyPart,
                            scale    : [0.4, 0.4, 1.7],
                            rotate   : [15, 0, 0],
                            translate: [0, 0, 2.6],
                            childrenList: [
                              {
                                slug     : 'd3c',
                                model    : creatureCylinderBodyPart,
                                scale    : [0.3, 0.3, 1.5],
                                rotate   : [10, 0, 0],
                                translate: [0, 0, 1.7],
                              },
                            ],
                          },
                        ],
                      },
                      {
                        slug     : 'd4',
                        model    : creatureCylinderBodyPart,
                        scale    : [0.5, 0.5, 2],
                        rotate   : [0, 0, 0],
                        translate: [2.5, 0, 2],
                        childrenList: [
                          {
                            slug     : 'd4b',
                            model    : creatureCylinderBodyPart,
                            scale    : [0.4, 0.4, 1.5],
                            rotate   : [15, 0, 0],
                            translate: [0, 0, 2],
                            childrenList: [
                              {
                                slug     : 'd4c',
                                model    : creatureCylinderBodyPart,
                                scale    : [0.3, 0.3, 1.2],
                                rotate   : [10, 0, 0],
                                translate: [0, 0, 1.5],
                              },
                            ],
                          },

                        ]
                      },
                    ],
                  },
                ],
              },
              {
                slug     : 'base',
                scale    : [3.2, 1, 3],
                rotate   : [-10, 180, 0],
                translate: [-0.5, 0, 0.5],
                model    : creatureCylinderBodyPart
              }
            ],
          },
        ],
      },
      {
        slug : 'water',
        model: new TerrainShape3d({
          program,
          gl,
          color            : new Color(1.0, 0.0, 0.0),
          textureName      : 'textures/Marble01-1k/Marble01 diffuse 1k.jpg',
          mMin             : -50,
          nMin             : -50,
          mMax             : 50,
          nMax             : 50,
          fatorInterpolacao: 1,

          // zValues tem que ser uma matriz quadrada
          zValues: [
            [0, 0],
            [0, 0],
          ],
        }),
      },
      {
        slug : 'stones',
        model: new TerrainShape3d({
          program,
          gl,
          color            : new Color(1.0, 0.0, 0.0),
          textureName      : 'textures/Forest03-1k/Forest03 diffuse 1k.jpg',
          mMin             : -50,
          nMin             : -50,
          mMax             : 50,
          nMax             : 50,
          fatorInterpolacao: 3,

          // zValues tem que ser uma matriz quadrada
          zValues: [
            [15, 15, 15, 15, 15, 15, 15],
            [-5, -5, 15, 15, -5, 10, 10],
            [-5, -5, -5, -5, -5, -5, 5],
            [-5, -5, -5, -5, -5, -5, 5],
            [-5, -5, -5, -5, -5, -5, -5],
            [-5, -5, -5, -5, -5, -5, 5],
            [10, 5, -5, -5, -5, -5, 15],
          ],
        }),
      },
    ],
  });

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
  initControls();

}

function initControls() {

  var axis = ['x', 'y', 'z'];

  // A wrapper around dat.GUI interface for a simpler API
  // for the purpose of this book
  utils.configureControls({
    'Rendering Mode': {
      value   : renderingMode,
      options : [
        'TRIANGLES',
        'LINES',
        // 'POINTS'
        /*,
         'LINE_LOOP',
         'LINE_STRIP',
         'TRIANGLE_STRIP',
         'TRIANGLE_FAN'*/
      ],
      onChange: v => {
        renderingMode = v;
        render();
      },
    },

    // reduce receives a function and the initial value (below the initial value is {})
    // result is the inital value or the return of the previous call to the function
    // Spread all values from the reduce onto the controls
    ...['Translate X', 'Translate Y', 'TranslateZ'].reduce((result, name, i) => {
      result[name] = {
        value: translationVector[i],
        min  : -100,
        max  : 100,
        step : 0.01,
        onChange(v, state) {
          scene.translate[i] = v;
          render();
        },
      };
      return result;
    }, {}),

    ...['Rotate X', 'Rotate Y', 'Rotate Z'].reduce((result, name, i) => {
      result[name] = {
        value: rotationVector[i],
        min  : -180, max: 180, step: 0.000001,
        onChange(v, state) {
          rotationVector  = [
            state['Rotate X'],
            state['Rotate Y'],
            state['Rotate Z'],
          ];
          scene.rotate[i] = v;
          render();

        },
      };
      return result;
    }, {}),

  });
}

window.onload = init;
