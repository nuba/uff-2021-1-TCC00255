function buildNormalizeFn(min = 0, max = 255, rmin = 0, rmax = 1) {
  let d = max - min, r = rmax - rmin;
  return function normalize(valor) {
    return rmin + (valor - min) * r / d;
  };
}
