class Terrain {
  reticulado               = [];
  triangulos_vertices      = [];
  triangulos_normals       = [];
  triangulos_lines_indices = [];
  triangulos_faces_indices = [];

  constructor({
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

    this.mMin              = mMin;
    this.nMin              = nMin;
    this.mMax              = mMax;
    this.nMax              = nMax;
    this.fatorInterpolacao = fatorInterpolacao;
    this.zValues           = zValues;

    this.buildReticulado(zValues, fatorInterpolacao, mMin, mMax, nMin, nMax);
    this.buildTriangulos();

  }

  buildReticulado() {

    let baseParaInterpolacao = [];

    let m_idx_min = 0;
    // -1 pq são posições no array, que vão de 0 até oldMax...
    let m_idx_max = (this.zValues.length + (this.zValues.length - 1) * this.fatorInterpolacao) - 1;

    const mRemapFn = buildNormalizeFn(
        m_idx_min,
        m_idx_max,
        this.mMin,
        this.mMax,
    );

    const nRemapFn = buildNormalizeFn(
        m_idx_min,
        m_idx_max,
        this.nMin,
        this.nMax,
    );

    for (let i = 0; i < this.zValues.length; i++) {
      let linhaParaBaseParaInterpolacao = [];
      for (let j = 0; j < this.zValues.length; j++) {
        linhaParaBaseParaInterpolacao.push({
          x: mRemapFn(i * (this.fatorInterpolacao + 1)),
          y: nRemapFn(j * (this.fatorInterpolacao + 1)),
          z: this.zValues[i][j],
        });
      }
      baseParaInterpolacao.push(...linhaParaBaseParaInterpolacao);
    }

    let pontosInterpolados = interpolateArray(baseParaInterpolacao, this.fatorInterpolacao);
    let numLinhas          = Math.sqrt(pontosInterpolados.length);
    if (numLinhas === Math.trunc(numLinhas)) {
      this.reticulado = _.chunk(pontosInterpolados, numLinhas);
      // aí agora tenho que iterar sobre esse cara,
      // só que
      //    ao contrario de antes
      //    não preciso traduzir m e n para x e y mais, já tá computado...
    }
    else {
      console.log('uai, mas isso aqui era pra ser um quadrado perfeito!?...');
    }
  }

  gera_triangulo(m_s, n_s) {

    let p0 = this.reticulado[m_s[0]][n_s[0]];
    let p1 = this.reticulado[m_s[1]][n_s[1]];
    let p2 = this.reticulado[m_s[2]][n_s[2]];

    const new_vertex_idx = this.triangulos_vertices.length / 3;

    this.triangulos_vertices.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    let vec_normal = this.buildNormal(p1, p0, p2);
    this.triangulos_normals.push(vec_normal[0], vec_normal[1], vec_normal[2]);

    // para desenhar linhas
    this.triangulos_lines_indices.push(
        new_vertex_idx, new_vertex_idx + 1, new_vertex_idx + 1, new_vertex_idx + 2, new_vertex_idx + 2, new_vertex_idx);
    this.triangulos_faces_indices.push(new_vertex_idx, new_vertex_idx + 1, new_vertex_idx + 2);

    // vertices

  }

  buildNormal(p1, p0, p2) {
    let vec_1 = vec3.create();
    vec3.set(vec_1, p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);

    let vec_2 = vec3.create();
    vec3.set(vec_2, p2.x - p0.x, p2.y - p0.y, p2.z - p0.z);

    let vec_normal = vec3.create();
    vec3.cross(vec_normal, vec_1, vec_2);
    vec3.normalize(vec_normal, vec_normal);
    return vec_normal;
  }

  clean() {
    this.reticulado.length               = 0;
    this.triangulos_vertices.length      = 0;
    this.triangulos_lines_indices.length = 0;
  }

  rebuild() {
    this.clean();
    this.buildReticulado();
    this.buildTriangulos();
  }

  buildTriangulos() {
    for (let m = 0; m < this.reticulado.length - 1; m++) {
      for (let n = 0; n < this.reticulado.length - 1; n++) {
        // triangulo inferior
        this.gera_triangulo([m, m, m + 1], [n, n + 1, n + 1]);
        // triangulo superior
        this.gera_triangulo([m, m + 1, m + 1], [n, n + 1, n]);
      }
    }
  }
}
