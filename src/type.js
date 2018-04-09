import R from 'ramda';

/**
 * Checks if input value is `Function`.
 */
export isFunction = R.anyPass(
  val => Object.prototype.toString.call(val) === '[object Function]',
  val => Object.prototype.toString.call(val) === '[object AsyncFunction]',
  val => Object.prototype.toString.call(val) === '[object GeneratorFunction]'
);

/**
 * is hexadecimal
 */
export const isHex = R.test(/^[0-9A-F]+$/i);

/**
 * is mongo objectId
 */
export const isObjectId = (str) => {
  return isHex(str) && str.length === 24;
};

