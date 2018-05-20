import R from 'ramda';

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
 * Count of values satifies a provided function
 *
 * usage: countIf(isTruthy, [null, 1, 0, true]) // 2
 */
// (a -> Boolean) -> [a] -> Number
export const countIf = R.curry(R.compose(R.length, R.filter));

