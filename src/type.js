import _isArray from 'ramda/src/internal/_isObject';
import _isNumber from 'ramda/src/internal/_isNumber';
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

// :: * -> Boolean
export const isString = R.is(String);
export const isNotString = R.complement(isString);

// :: * -> Boolean
export const isArray = Array.isArray || _isArray;
export const isNotArray = R.complement(isArray);

// :: * -> Boolean
export const isNumber = _isNumber;
export const isNotNumber = R.complement(isNumber);

// :: * -> Boolean
export const isInteger = Number.isInteger;
export const isNotInteger = R.complement(isInteger);

// :: * -> Boolean
export const isNaN = Number.isNaN || R.equals(NaN);
export const isNotNaN = R.complement(isNaN);

// :: * -> Boolean
export const isFinite = Number.isFinite;
export const isNotFinite = R.complement(isFinite);

// :: * -> Boolean
export const isFloat = R.both(isFinite, R.complement(isInteger));
export const isNotFloat = R.complement(isFloat);

// :: * -> Boolean
export const isObject = _isObject;
export const isNotObject = R.complement(isObject);

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

/**
 * is like an id (string, int, or objectId)
 */
export const isIdLike = (val) =>
  isNotNil(val) && (isInteger(val) || isString(val) || isObjectId(val.toString()));

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

  if (proto === null) {
    return true;
  }

  return hasObjectConstructor(proto);
};

/**
 * Checks if input value is a native `Promise`.
 *
 * usage: isPromise(null); // => false
 *        isPromise(Promise.resolve()); // => true
 *        isPromise(Promise.reject()); // => true
 *        isPromise({ then: () => 1 }); // => false
 */
// :: * -> Boolean
const isPromise = R.both(isObj, R.pipe(R.toString, R.equals('[object Promise]')));
