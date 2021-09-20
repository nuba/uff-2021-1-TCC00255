function remap(x, oMin, oMax, nMin, nMax) {
  // range check
  if (oMin === oMax || nMin === nMax) {
    return null;
  }

  // check reversed input range
  let oldMin       = Math.min(oMin, oMax);
  let oldMax       = Math.max(oMin, oMax);
  let reverseInput = !(oldMin === oMin);

  // check reversed output range
  let newMin        = Math.min(nMin, nMax);
  let newMax        = Math.max(nMin, nMax);
  let reverseOutput = !(newMin === nMin);

  let portion = reverseInput
                ? (oldMax - x) * (newMax - newMin) / (oldMax - oldMin)
                : (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);

  return reverseOutput
         ? newMax - portion
         : portion + newMin;

}

// test cases
console.log(remap(25.0, 0.0, 100.0, 1.0, -1.0), '==', 0.5);
console.log(remap(25.0, 100.0, -100.0, -1.0, 1.0), '==', -0.25);
console.log(remap(-125.0, -100.0, -200.0, 1.0, -1.0), '==', 0.5);
console.log(remap(-125.0, -200.0, -100.0, -1.0, 1.0), '==', 0.5);
// even when value is out of bound
console.log(remap(-20.0, 0.0, 100.0, 0.0, 1.0), '==', -0.2);
