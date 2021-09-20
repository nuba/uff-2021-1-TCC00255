let nivel         = 0;
let planoProjecao = new Plane3d(new Vector3d(0, 0, 0), new Vector3d(0, 0, 1));
var funcao        = (x, y) => {
  return Math.pow(x, 2) + Math.pow(y, 2) - 1;
};

let m_min = 0, n_min = 0,
    m_max = 2, n_max = 2,
    m_intervals = 20, n_intervals = 20;

let m_increment = (m_max - m_min) / m_intervals,
    n_increment = (n_max - n_min) / n_intervals;

let aproximacao_da_curva = [];

var idx_to_value = (idx, increment) => {
  return idx * increment;
};

var funcao_reticulado = (m_idx, n_idx) => {
  return funcao(
      idx_to_value(m_idx, m_increment),
      idx_to_value(n_idx, n_increment),
  );
};

let reticulado = [];

function reticulado_clean() {
  reticulado.forEach(linha => linha.length = 0);
  reticulado.length = 0;
}

function reticulado_popula() {
  reticulado_clean();
  for (let m = 0; m < m_intervals; m++) {
    reticulado.push([]);
    for (let n = 0; n < n_intervals; n++) {
      reticulado[m].push(funcao_reticulado(m, n));
    }
  }
}

function verifica_triangulo(m_s, n_s, z1, z2, z3) {
  z1_transladado = z1 - nivel;
  z2_transladado = z2 - nivel;
  z3_transladado = z3 - nivel;

  if (
      z1_transladado > 0
      && z2_transladado > 0
      && z3_transladado > 0
  ) {
    // todos os pontos do triângulo estão acima do plano de nível
  }
  else if (
      z1_transladado < 0
      && z2_transladado < 0
      && z3_transladado < 0
  ) {
    // todos os pontos do triângulo estão abaixo do plano de nível
  }
  else {
    // pelo menos dois pontos estão em lados distintos do plano
    // ou no plano do nível

    let segmentos_que_cruzam_o_plano = [];

    if (Math.sign(z1_transladado) !== Math.sign(z2_transladado)) {
      segmentos_que_cruzam_o_plano.push(
          new LineSegment3d(
              new Vector3d(
                  idx_to_value(m_s[0], m_increment),
                  idx_to_value(n_s[0], n_increment),
                  z1,
              ),
              new Vector3d(
                  idx_to_value(m_s[1], m_increment),
                  idx_to_value(n_s[1], n_increment),
                  z2,
              ),
          ),
      );
    }

    if (Math.sign(z1_transladado) !== Math.sign(z3_transladado)) {
      segmentos_que_cruzam_o_plano.push(
          new LineSegment3d(
              new Vector3d(
                  idx_to_value(m_s[0], m_increment),
                  idx_to_value(n_s[0], n_increment),
                  z1,
              ),
              new Vector3d(
                  idx_to_value(m_s[2], m_increment),
                  idx_to_value(n_s[2], n_increment),
                  z3,
              ),
          ),
      );
    }

    if (Math.sign(z2_transladado) !== Math.sign(z3_transladado)) {
      segmentos_que_cruzam_o_plano.push(
          new LineSegment3d(
              new Vector3d(
                  idx_to_value(m_s[1], m_increment),
                  idx_to_value(n_s[1], n_increment),
                  z2,
              ),
              new Vector3d(
                  idx_to_value(m_s[2], m_increment),
                  idx_to_value(n_s[2], n_increment),
                  z3,
              ),
          ),
      );
    }

    let pontos_de_intersecao = segmentos_que_cruzam_o_plano
        .map(s => s.lineToPlaneIntersection(planoProjecao))
        .filter(r => r[0])
        .map(r => r[2]);

    if (pontos_de_intersecao.length === 2) {
      aproximacao_da_curva.push(
          new LineSegment3d(pontos_de_intersecao[0], pontos_de_intersecao[1]),
      );
    }
    else {
      console.log('wtf');
    }
  }

}

function reticulado_percorre_linha(m, linha_atual, linha_seguinte) {
  for (let n = 0; n < n_intervals - 1; n++) {
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
  aproximacao_da_curva.length = 0;
  for (let m = 0; m < m_intervals - 1; m++) {
    reticulado_percorre_linha(
        m,
        reticulado[m],
        reticulado[m + 1],
    );
  }
}

reticulado_popula();
reticulado_percorre();
console.log(aproximacao_da_curva);
