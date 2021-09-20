let nivel  = 10;
let funcao = math.compile('3x^2 - 1/2y^2 -5');

var expressao_wrapper = (x, y) => {
  return funcao.evaluate({x, y});
};

let m_min       = 0,
    m_max       = 10,
    n_min       = 0,
    n_max       = 10,
    m_intervals = 4,
    n_intervals = 4;

let m_increment   = (m_max - m_min) / m_intervals,
    n_increment   = (n_max - n_min) / n_intervals;
let planoProjecao = new Plane3d(new Vector3d(0, 0, nivel), new Vector3d(0, 0, 1));

let aproximacao_da_curva = [];

var idx_to_value = (idx, min, increment) => {
  return min + idx * increment;
};

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

function verifica_triangulo(m_s, n_s, z0, z1, z2) {
  let z0_ajustado = z0 - nivel,
      z1_ajustado = z1 - nivel,
      z2_ajustado = z2 - nivel;

  if (
      z0_ajustado > 0
      && z1_ajustado > 0
      && z2_ajustado > 0
  ) {
    // todos os pontos do triângulo estão acima do plano de nível
  }
  else if (
      z0_ajustado < 0
      && z1_ajustado < 0
      && z2_ajustado < 0
  ) {
    // todos os pontos do triângulo estão abaixo do plano de nível
  }
  else {
    // pelo menos dois pontos estão em lados distintos do plano
    // ou no plano do nível

    let segmentos_que_cruzam_o_plano = [];

    let p0_x = idx_to_value(m_s[0], m_min, m_increment);
    let p0_y = idx_to_value(n_s[0], n_min, n_increment);
    let p1_x = idx_to_value(m_s[1], m_min, m_increment);
    let p1_y = idx_to_value(n_s[1], n_min, n_increment);
    let p2_x = idx_to_value(m_s[2], m_min, m_increment);
    let p2_y = idx_to_value(n_s[2], n_min, n_increment);

    if (Math.sign(z0_ajustado) !== Math.sign(z1_ajustado)) {
      segmentos_que_cruzam_o_plano.push(
          new LineSegment3d(
              new Vector3d(p0_x, p0_y, z0),
              new Vector3d(p1_x, p1_y, z1),
          ),
      );
    }
    if (Math.sign(z0_ajustado) !== Math.sign(z2_ajustado)) {
      segmentos_que_cruzam_o_plano.push(
          new LineSegment3d(
              new Vector3d(p0_x, p0_y, z0),
              new Vector3d(p2_x, p2_y, z2),
          ),
      );
    }

    if (Math.sign(z1_ajustado) !== Math.sign(z2_ajustado)) {
      segmentos_que_cruzam_o_plano.push(
          new LineSegment3d(
              new Vector3d(p1_x, p1_y, z1),
              new Vector3d(p2_x, p2_y, z2),
          ),
      );
    }

    let pontos_de_intersecao = segmentos_que_cruzam_o_plano
        .map(s => s.lineToPlaneIntersection(planoProjecao))
        .filter(r => r[0])
        .map(r => r[2]);

    if (pontos_de_intersecao.length === 2) {
      const line_idx = triangulos_participantes.length / 3;
      triangulos_participantes_lines.push(line_idx, line_idx + 1, line_idx + 1, line_idx + 2, line_idx + 2, line_idx);
      triangulos_participantes.push(p0_x, p0_y, z0, p1_x, p1_y, z1, p2_x, p2_y, z2);
      aproximacao_da_curva.push(
          new LineSegment3d(pontos_de_intersecao[0], pontos_de_intersecao[1]),
      );
    }
    else {
      // console.log('wtf');
    }
  }

}

function reticulado_percorre_linha(m, linha_atual, linha_seguinte) {
  for (let n = 0; n <= n_intervals; n++) {
    // triangulo inferior
    verifica_triangulo(
        [m, m, m + 1],
        [n, n + 1, n + 1],
        linha_atual[n],
        linha_atual[n + 1],
        linha_seguinte[n + 1],
    );
    // triangulo superior
    verifica_triangulo(
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

function updateParameters() {
  m_increment   = (m_max - m_min) / m_intervals;
  n_increment   = (n_max - n_min) / n_intervals;
  planoProjecao = new Plane3d(
      new Vector3d(0, 0, nivel),
      new Vector3d(0, 0, 1),
  );
}

let cg_vertices;
let cg_indexes;

function doit() {
  clean();
  updateParameters();
  reticulado_popula();
  reticulado_percorre();
  // console.log(aproximacao_da_curva);
  cg_indexes  = aproximacao_da_curva.flatMap((s, idx) => [2 * idx, 2 * idx + 1]);
  cg_vertices = aproximacao_da_curva.flatMap(s => [s.p0.x, s.p0.y, s.p0.z, s.p1.x, s.p1.y, s.p1.z]);
}

doit();
