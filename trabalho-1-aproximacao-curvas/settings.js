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

let espressaoHandlerFn = function (value) {
  let funcao_parseada  = math.parse(value);
  let funcao_compilada = funcao_parseada.compile();
  try {
    funcao_compilada.evaluate({x: 1, y: 1});
    funcao = funcao_compilada;
    settingsPanel.setValue('Expressão parseada', '<span id="math">$$ ' + funcao_parseada.toTex() + ' $$</span>');
    setTimeout(() => {
      MathJax.typesetClear();
      MathJax.typeset(document.querySelectorAll('#math'));
    }, 10);
  }
  catch (e) {
    console.log(e);
  }

};

function setupPanel() {

  settingsPanel = QuickSettings
      .create(20, 20, 'Ajustes')
      .setGlobalChangeHandler(settingsChangedFn)
      .addHTML('Função', 'Altura z da curva de nível e expressão na forma z = f(x,y)')
      .bindRange('nivel', -100, 100, 10, 1, settings)
      .addText('expressao', '3x^2 - 1/2y^2 -5', espressaoHandlerFn)
      .addHTML('Expressão parseada', '')
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

  espressaoHandlerFn('3x^2 - 1/2y^2 -5');
  settingsChangedFn();

}

function debounceWithThrottle(func, debouncewait, throttlewait, callatstart, callatend) {
  var debouncetimeout, throttletimeout;

  return function () {
    var context = this, args = arguments;

    if (callatstart && !debouncetimeout) {
      func.apply(context, [].concat(args, 'start'));
    }

    if (!throttletimeout && throttlewait > 0) {
      throttletimeout = setInterval(function () {
        func.apply(context, [].concat(args, 'during'));
      }, throttlewait);
    }

    clearTimeout(debouncetimeout);
    debouncetimeout = setTimeout(function () {
      clearTimeout(throttletimeout);
      throttletimeout = null;
      debouncetimeout = null;

      if (callatend) {
        func.apply(context, [].concat(args, 'end'));
      }
    }, debouncewait);
  };
};

var settingsChangedFn = debounceWithThrottle(
    function () {
      let funcao_parseada = math.parse(settings.expressao);
      nivel               = settings.nivel;
      // funcao              = funcao_parseada.compile();
      // settingsPanel.setValue('Expressão parseada', `<p>${funcao_parseada.toTex()}</p>`);
      // MathJax.typeset();

      m_max       = settings.m_max;
      m_min       = settings.m_min;
      m_intervals = settings.m_intervals;

      n_max       = settings.n_max;
      n_min       = settings.n_min;
      n_intervals = settings.n_intervals;

      desenharTriangulos = settings.triangulosParticipantes;

      doit();

    },
    50,
    50,
    false,
    true);
