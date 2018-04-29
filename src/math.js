import R from 'ramda';

export const subtractBy = R.flip(R.subtract);
export const divideBy = R.flip(R.divide);
export const moduloBy = R.flip(R.modulo);

export const average = R.converge(R.divide, [R.sum, R.length]);

/**
 * Create an incrementing or decrementing range of numbers with a step
 *
 * usage: rangeStep(2, 2, 8);   // [2, 4, 6, 8]
 */
export const rangeStep = (start, step, stop) => R.map(
  n => start + step * n,
  R.range(0, (1 + (stop - start) / step) >>> 0)
);

export const getRange = R.juxt([Math.min, Math.max]);