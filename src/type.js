const _isArray = require('ramda/src/internal/_isObject');
const _isNumber = require('ramda/src/internal/_isNumber');
const _isObject = require('ramda/src/internal/_isObject');
const R = require('ramda');

/**
 * some convenient complement
 */
const hasNot = R.complement(R.has);
const isNotNil = R.complement(R.isNil);
const isNotEmpty = R.complement(R.isEmpty);
const isNull = R.equals(null);
const isNotNull = R.complement(isNull);

// :: * -> Boolean
const isString = R.is(String);
const isNotString = R.complement(isString);

// :: * -> Boolean
const isArray = Array.isArray || _isArray;
const isNotArray = R.complement(isArray);

// :: * -> Boolean
const isNumber = _isNumber;
const isNotNumber = R.complement(isNumber);

// :: * -> Boolean
const isInteger = Number.isInteger;
const isNotInteger = R.complement(isInteger);

// :: * -> Boolean
const isNaN = Number.isNaN || R.equals(NaN);
const isNotNaN = R.complement(isNaN);

// :: * -> Boolean
const isFinite = Number.isFinite;
const isNotFinite = R.complement(isFinite);

// :: * -> Boolean
const isFloat = R.both(isFinite, R.complement(isInteger));
const isNotFloat = R.complement(isFloat);

// :: * -> Boolean
const isObject = _isObject;
const isNotObject = R.complement(isObject);

// :: * -> Boolean
const isValid = R.complement(R.anyPass([R.isNil, R.isEmpty, isNaN]));

/**
 * is hexadecimal
 */
const isHex = R.test(/^[0-9A-F]+$/i);

/**
 * is mongo objectId
 */
const isObjectId = (str) => {
  return isHex(str) && str.length === 24;
};

/**
 * is like an id (string, int, or objectId)
 */
const isIdLike = (val) =>
  isNotNil(val) && (isInteger(val) || isString(val) || isObjectId(val.toString()));

/**
 * Checks if input value is `Function`.
 */
const isFunction = R.anyPass([
  val => Object.prototype.toString.call(val) === '[object Function]',
  val => Object.prototype.toString.call(val) === '[object AsyncFunction]',
  val => Object.prototype.toString.call(val) === '[object GeneratorFunction]'
]);

const isTypeOfObject = val => typeof val === 'object';

/**
 * Checks if input value is language type of `Object`.
 */
const isObj = R.both(isNotNull, R.either(isTypeOfObject, isFunction));

/**
 * Checks if value is object-like. A value is object-like if it's not null and has a typeof result of "object".
 */
const isObjLike = R.both(isNotNull, isTypeOfObject);

/**
 * Check to see if an object is a plain object (created using `{}`, `new Object()` or `Object.create(null)`).
 */
const isObjectConstructor = R.pipe(R.toString, R.equals(R.toString(Object)));
const hasObjectConstructor = R.pathSatisfies(
  R.both(isFunction, isObjectConstructor),
  ['constructor']
);
const isPlainObj = val => {
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

module.exports = {
  hasNot,
  isArray,
  isFinite,
  isFloat,
  isFunction,
  isHex,
  isIdLike,
  isInteger,
  isNaN,
  isNotArray,
  isNotEmpty,
  isNotFinite,
  isNotFloat,
  isNotInteger,
  isNotNaN,
  isNotNil,
  isNotNull,
  isNotNumber,
  isNotObject,
  isNotString,
  isNull,
  isNumber,
  isObj,
  isObject,
  isObjectId,
  isObjLike,
  isPlainObj,
  isPromise,
  isString,
  isTypeOfObject,
  isValid,
};