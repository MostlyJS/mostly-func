const R = require('ramda');

const divideBy = R.flip(R.divide);
const moduloBy = R.flip(R.modulo);
const subtractBy = R.flip(R.subtract);

const average = R.converge(R.divide, [R.sum, R.length]);

// :: Number -> Boolean
const isOdd = R.o(Boolean, R.modulo(2));

// :: Number -> Boolean
const isEven = R.o(R.not, R.isOdd);

/**
 * Create an incrementing or decrementing range of numbers with a step
 *
 * usage: rangeStep(2, 2, 8);   // [2, 4, 6, 8]
 */
const rangeStep = (start, step, stop) => R.map(
  n => start + step * n,
  R.range(0, (1 + (stop - start) / step) >>> 0)
);

/**
 * get range of a number list
 */
const getRange = R.juxt([Math.min, Math.max]);

module.exports = {
  average,
  divideBy,
  getRange,
  isEven,
  isOdd,
  moduloBy,
  rangeStep,
  subtractBy
};