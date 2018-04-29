import _isObject from 'ramda/src/internal/_isObject';
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

export const isTypeOfObject = val => typeof val === 'object';

/**
 * Checks if input value is language type of `Object`.
 */
export const isObj = R.both(isNotNull, R.either(isTypeOfObject, isFunction));

/**
 * Checks if value is object-like. A value is object-like if it's not null and has a typeof result of "object".
 */
export const isObjLike = R.both(isNotNull, isTypeOfObject);

const isObjectConstructor = R.pipe(R.toString, R.equals(R.toString(Object)));
const hasObjectConstructor = R.pathSatisfies(
  R.both(isFunction, isObjectConstructor),
  ['constructor']
);

/**
 * Check to see if an object is a plain object (created using `{}`, `new Object()` or `Object.create(null)`).
 */
export const isPlainObj = val => {
  if (!isObjLike(val) || !_isObject(val)) {
    return false;
  }

  const proto = Object.getPrototypeOf(val);

  if (isNull(proto)) {
    return true;
  }

  return hasObjectConstructor(proto);
};


/**
 * Count of values satifies a provided function
 *
 * usage: countIf(isTruthy, [null, 1, 0, true]) // 2
 */
// (a -> Boolean) -> [a] -> Number
export const countIf = R.curry(R.compose(R.length, R.filter));

