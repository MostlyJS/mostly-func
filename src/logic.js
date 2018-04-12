import R from 'ramda';

/**
 * some convenient complement
 */
export const hasNot = R.complement(R.has);
export const isNotNil = R.complement(R.isNil);
export const isNotEmpty = R.complement(R.isEmpty);
export const isNull = R.equals(null);
export const isNotNull = R.complement(isNull);
export const isValid = R.complement(R.either(R.isNil, R.isEmpty));

/**
 * In JavaScript, a `truthy` value is a value that is considered true
 * when evaluated in a Boolean context. All values are truthy unless
 * they are defined as falsy (i.e., except for `false`, `0`, `""`, `null`, `undefined`, and `NaN`).
 */
export const isTruthy = R.pipe(Boolean, R.equals(true));

/**
 * A falsy value is a value that translates to false when evaluated in a Boolean context.
 * Falsy values are `false`, `0`, `""`, `null`, `undefined`, and `NaN`.
 */
export const isFalsy = R.complement(isTruthy);

/**
 * Checks if input value is `Function`.
 */
export const isFunction = R.anyPass([
  val => Object.prototype.toString.call(val) === '[object Function]',
  val => Object.prototype.toString.call(val) === '[object AsyncFunction]',
  val => Object.prototype.toString.call(val) === '[object GeneratorFunction]'
]);
