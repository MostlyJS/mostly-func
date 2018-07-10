const R = require('ramda');

/**
 * Some convenient complement
 */
const isNotEquals = R.both(R.complement(R.isNil), R.complement(R.equals));

/**
 * Is mongo objectId/string equals with another
 */
const idEquals = R.curry((a, b) => {
  if (a && typeof a.equals === 'function') return a.equals(b);
  if (b && typeof b.equals === 'function') return b.equals(a);
  return R.equals(a, b);
});

/**
 * Returns true if prop equals as mongo objectId/string
 */
const idPropEq = R.curry((name, val, obj) =>
  R.propSatisfies(idEquals(val), name, obj)
);
const idPropNe = R.complement(idPropEq);

/**
 * compare length of list
 */
const compareLength = R.useWith(R.__, [R.identity, R.length]);

/**
 * Returns true if length of array equals first argument
 *
 * usage: lengthEq(1, [{}]) // true
 *        lengthEq(1, [])   // false
 */
// :: Number -> [a] -> Boolean
const lengthEq = compareLength(R.equals);

/**
 * Returns true if length of array is smaller than first argument
 *
 * usage: lengthGt(2, [{}])     // true
 *        lengthGt(2, [{}, {}]) // false
 */
// :: Number -> [a] -> Boolean
const lengthGt = compareLength(R.gt);
const lengthGte = compareLength(R.gte);

/**
 * Returns true if length of array is bigger than first argument
 *
 * usage: lengthLt(0, [{}])  // true
 *        lengthLt(0, [])    // false
 *
 * @sig Number -> [a] -> Boolean
 */
const lengthLt = compareLength(R.lt);
const lengthLte = compareLength(R.lte);

module.exports = {
  compareLength,
  idEquals,
  idPropEq,
  idPropNe,
  isNotEquals,
  lengthEq,
  lengthGt,
  lengthGte,
  lengthLt,
  lengthLte
};