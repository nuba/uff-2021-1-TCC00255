// class TerrainShape3d {}

class TerrainShape3d {
  shape3d;
  terrain;

  constructor({
    program, gl, color, textureName,
    mMin = -100,
    nMin = -100,
    mMax = 100,
    nMax = 100,
    fatorInterpolacao = 8,

    // zValues tem que ser uma matriz quadrada
    zValues = [
      [10, 20, 40, 50],
      [10, 30, 30, 20],
      [30, 30, 30, 20],
      [50, 20, 20, 10],
    ],

  }) {
    this.mMin = mMin;
    this.nMin = nMin;
    this.mMax = mMax;
    this.nMax = nMax;
    this.fatorInterpolacao = fatorInterpolacao;
    this.zValues = zValues;

    this.terrain = new Terrain({mMin, nMin, mMax, nMax, fatorInterpolacao, zValues});
    this.shape3d = new Shape3d(program, gl, color, textureName);
    // this.shape3d = new Shape3d(program, gl, color, undefined);

    this.shape3d.indices = this.terrain.triangulos_faces_indices;
    this.shape3d.indicesLines = this.terrain.triangulos_lines_indices;
    this.shape3d.vertices  = this.terrain.triangulos_vertices;
    this.shape3d.normals = this.terrain.triangulos_vertices_normals;
    this.shape3d.colors = [];

    for (let i=0; i < this.terrain.triangulos_vertices.length / 3; i++) {
      this.shape3d.colors.push(color.r, color.g, color.b);
    }

    this.shape3d.textureCoord = [];
    for (let i=0; i < this.terrain.triangulos_faces_indices.length/3; i++) {
      // triangulo superior
      this.shape3d.textureCoord.push(
          0, 0,
          0, 1,
          1, 1)
      // triangulo superior
      this.shape3d.textureCoord.push(
          0, 0,
          1, 1,
          1, 0
      );
    }


    if (this.shape3d.textureName !== undefined) {
      this.shape3d.loadTexture(this.shape3d.textureName);
    }

    this.shape3d.init_buffers();

    // this.shape3d.colors = this.terrain.triangulos_colors;
    // this.shape3d.textureCoord = this.terrain.triangulos_texture;

  }

  draw(renderingMode) {
    var gl = this.shape3d.gl;

    if (this.shape3d.textureName){
      gl.uniform1i(this.shape3d.program.uTextureActive, 1);
      gl.bindTexture(gl.TEXTURE_2D, this.shape3d.texture);
    }
    else{
      gl.uniform1i(this.shape3d.program.uTextureActive, 0);
    }

    // Bind VAO
    gl.bindVertexArray(this.shape3d.VAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape3d.coordVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.shape3d.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(this.shape3d.program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.shape3d.program.aVertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.shape3d.textureCoordVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.shape3d.textureCoord), gl.STATIC_DRAW);


    // Depending on the rendering mode type, we will draw differently
    switch (renderingMode) {
      case 'TRIANGLES': {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.terrain.triangulos_faces_indices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, this.terrain.triangulos_faces_indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
      case 'LINES': {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.terrain.triangulos_lines_indices), gl.STATIC_DRAW);
        gl.drawElements(gl.LINES, this.terrain.triangulos_lines_indices.length, gl.UNSIGNED_SHORT, 0);
        break;
      }
    }

    // Clean
    gl.bindVertexArray(null);
  }
}
