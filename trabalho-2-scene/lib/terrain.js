class Terrain {
  reticulado = [];

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

    let reticulado;
    this.buildReticulado(zValues, fatorInterpolacao, mMin, mMax, nMin, nMax);

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
}
