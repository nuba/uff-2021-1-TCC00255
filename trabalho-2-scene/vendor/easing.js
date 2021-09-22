
// Esse  código vem de https://github.com/rook2pawn/node-easing
// Só adicionei o tratamento para Start & End (que poderia até encapsulado a lib original)
// o problema é que a lib original nao tem release que funciona no browser direto,
// criar este arquivo aqui foi inevitável

let Easing = (() => {

  const funclist          = {};
  funclist['linear']      = function (x) {
    return x;
  };
  funclist['quadratic']   = function (x) {
    return Math.pow(x, 2);
  };
  funclist['cubic']       = function (x) {
    return Math.pow(x, 3);
  };
  funclist['quartic']     = function (x) {
    return Math.pow(x, 4);
  };
  funclist['quintic']     = function (x) {
    return Math.pow(x, 5);
  };
  funclist['sigmoid']     = function (x) {
    return 1 / (1 + Math.exp(-x));
  };
  const sinusoidal        = function (x) {
    return Math.sin(x * (Math.PI / 2));
  };
  funclist['sinusoidal']  = sinusoidal;
  funclist['sin']         = sinusoidal;
  var exponential         = function (x) {
    return Math.pow(2, 10 * (x - 1));
  };
  funclist['exponential'] = exponential;
  funclist['expo']        = exponential;
  funclist['exp']         = exponential;
  funclist['circular']    = function (x) {
    return 1 - Math.sqrt(1 - x * x);
  };
  funclist['uniqueList']  = ['linear', 'quadratic', 'cubic', 'quartic', 'quintic', 'sinusoidal', 'exponential', 'circular', 'sigmoid'];

  const round = function (val) {
    return (~~(val * 1000) / 1000);
  };

  const Easing = function (number, type, options = {startAt: 0, endAt: 1}) {

    const list = new Array(number);
    const step = 1 / (list.length - 1);

    for (var i = 1; i < list.length - 1; i++) {
      let val = round(funclist[type](i * step));
      list[i] = val;
    }

    list[0]               = 0;
    list[list.length - 1] = 1;

    if (options.endToEnd) {
      var mid = Math.floor(list.length / 2);
      for (var i = 1; i < mid; i++) {
        list[i] = list[i * 2];
      }
      list[mid] = 1;
      for (var i = mid + 1; i < list.length - 1; i++) {
        list[i] = list[mid - (i - mid)];
      }
      list[list.length - 1] = 0;
    }
    if (options.invert) {
      for (var i = 0; i < list.length; i++) {
        list[i] = 1 - list[i];
      }
    }
    if (options.startAt < options.endAt) {
      return list.map(value => options.startAt + value * (options.endAt - options.startAt));
    }
    else {
      return list.map(value => options.startAt - value * (options.startAt - options.endAt));
    }

  };

  return Easing;
})();
