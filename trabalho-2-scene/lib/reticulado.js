let Reticulado = ({
  m_min,
  m_max,
  n_min,
  n_max,
  m_intervals,
  n_intervals,
}) => {

  if (m_min === undefined) {
    m_min = 0;
  }
  if (m_max === undefined) {
    m_max = 10;
  }
  if (n_min === undefined) {
    n_min = 0;
  }
  if (n_max === undefined) {
    n_max = 10;
  }
  if (m_intervals === undefined) {
    m_intervals = 4;
  }
  if (n_intervals === undefined) {
    n_intervals = 4;
  }

  let m_increment = (m_max - m_min) / m_intervals,
      n_increment = (n_max - n_min) / n_intervals;

  var idx_to_value = (idx, min, increment) => {
    return min + idx * increment;
  };

  function expressao_wrapper(x, y) {
    return x + y;
  }

  var funcao_reticulado = (m_idx, n_idx) => {
    return expressao_wrapper(
        idx_to_value(m_idx, m_min, m_increment),
        idx_to_value(n_idx, n_min, n_increment),
    );
  };

  let reticulado                     = [];
  let triangulos_participantes       = [];
  let triangulos_participantes_lines = [];

  function clean() {
    reticulado.forEach(linha => linha.length = 0);
    reticulado.length                     = 0;
    aproximacao_da_curva.length           = 0;
    triangulos_participantes.length       = 0;
    triangulos_participantes_lines.length = 0;
  }

  function reticulado_popula() {
    for (let m = 0; m <= m_intervals; m++) {
      reticulado.push([]);
      for (let n = 0; n <= n_intervals; n++) {
        reticulado[m].push(funcao_reticulado(m, n));
      }
    }
  }

  function gera_triangulo(m_s, n_s, z0, z1, z2) {

    let p0_x = idx_to_value(m_s[0], m_min, m_increment);
    let p0_y = idx_to_value(n_s[0], n_min, n_increment);
    let p1_x = idx_to_value(m_s[1], m_min, m_increment);
    let p1_y = idx_to_value(n_s[1], n_min, n_increment);
    let p2_x = idx_to_value(m_s[2], m_min, m_increment);
    let p2_y = idx_to_value(n_s[2], n_min, n_increment);

    let p0_z = reticulado[m_s[0]][n_s[0]];
    let p1_z = reticulado[m_s[1]][n_s[1]];
    let p2_z = reticulado[m_s[2]][n_s[2]];

    const line_idx = triangulos_participantes.length / 3;
    triangulos_participantes_lines.push(line_idx, line_idx + 1, line_idx + 1, line_idx + 2, line_idx + 2, line_idx);
    triangulos_participantes.push(p0_x, p0_y, p0_z, p1_x, p1_y, p1_z, p2_x, p2_y, p2_z);

  }

  function reticulado_percorre_linha(m, linha_atual, linha_seguinte) {
    for (let n = 0; n <= n_intervals; n++) {
      // triangulo inferior
      gera_triangulo(
          [m, m, m + 1],
          [n, n + 1, n + 1],
          linha_atual[n],
          linha_atual[n + 1],
          linha_seguinte[n + 1],
      );
      // triangulo superior
      gera_triangulo(
          [m, m + 1, m + 1],
          [n, n + 1, n],
          linha_atual[n],
          linha_seguinte[n + 1],
          linha_seguinte[n]);
    }
  }

  function reticulado_percorre() {
    for (let m = 0; m < m_intervals; m++) {
      reticulado_percorre_linha(
          m,
          reticulado[m],
          reticulado[m + 1],
      );
    }
  }

  return {
    data   : reticulado,
    popula  : reticulado_popula,
    indices : triangulos_participantes_lines,
    vertices: triangulos_participantes,
  };

};



