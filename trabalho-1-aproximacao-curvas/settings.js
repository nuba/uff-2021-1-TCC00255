settings = {
  nivel    : 0,
  expressao: '3x^2 - 1/2y^2 -5',

  m_min      : -10,
  m_max      : 10,
  m_intervals: 20,

  n_min      : -10,
  n_max      : 10,
  n_intervals: 20,

  triangulosParticipantes: true,
};

let settingsPanel;

function setupPanel() {
  settingsPanel = QuickSettings
      .create(20, 20, 'Ajustes')
      .setGlobalChangeHandler(settingsChangedFn)

      .addHTML('Função', 'Altura z da curva de nível e expressão')
      .bindRange('nivel', -100, 100, 10, 1, settings)
      .bindText('expressao', '3x^2 - 1/2y^2 -5', settings)

      .addHTML('Reticulado', 'Resolução da Discretização<BR>(m em X, n em Y)')
      .bindRange('m_intervals', 0, 200, 20, 1, settings)
      .bindRange('n_intervals', 0, 200, 20, 1, settings)

      .addHTML('Região de Interesse', 'Sempre normalizada para um quadrado com o maior lado possível.')
      .addHTML('Intervalo em X', '(-1000, +1000)')
      .bindRange('m_min', -1000, 1000, -10, 1, settings)
      .bindRange('m_max', -1000, 1000, 10, 1, settings)

      .addHTML('Intervalo em Y', '(-1000, +1000)')
      .bindRange('n_min', -1000, 1000, -10, 1, settings)
      .bindRange('n_max', -1000, 1000, 10, 1, settings)

      .addHTML('Extra', '')
      .bindBoolean('triangulosParticipantes', true, settings);

  settingsChangedFn();

}

function settingsChangedFn() {
  nivel  = settings.nivel;
  funcao = math.compile(settings.expressao);

  m_max       = settings.m_max;
  m_min       = settings.m_min;
  m_intervals = settings.m_intervals;

  n_max       = settings.n_max;
  n_min       = settings.n_min;
  n_intervals = settings.n_intervals;

  desenharTriangulos = settings.triangulosParticipantes;

  doit();

}
