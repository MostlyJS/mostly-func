import R from 'ramda';

/**
 * Split path to get head or tail
 */
export const splitHead = R.compose(R.head, R.split('.'));
export const splitTail = R.compose(R.join('.'), R.tail, R.split('.'));

/**
 * Always get an array of a possible input.
 * if it is a string, split it;
 * if it is already an array, return itself;
 * if it is an object, wrap it in an array.
 */
export const splitOrArray = R.ifElse(
  R.is(Array),
  R.identity,
  R.ifElse(
    R.is(Object),
    o => [o],
    R.split(',')
  )
);

/**
 * Constructs RegExp.
 *
 * usage: R.test(regExp('end$', 'gi'), 'in the end') // true
 */
export const regExp = R.constructN(2, RegExp);

/**
 * Testing string if starts with some prefix.
 *
 * usage: prefixWith('h', 'hello') // true
 *        prefixWith('hell', 'hello')  // true
 *        prefixWith('h', 'good bye')  // false
 */
// :: a -> b -> Boolean
const reStarts = R.useWith(R.flip(regExp)('gi'), [R.concat('^')]);
export const prefixWith = R.useWith(R.test, [reStarts, R.identity]);

/**
 * Splits string into list. Delimiter is every sequence of non-alphanumerical values.
 *
 * usage: splitAlphameric('Hello    world/1'); // ['Hello', 'world', '1']
 */
// :: String -> [String]
export const splitAlphameric = R.o(R.reject(R.equals('')), R.split(/[^a-zéçA-ZÉÇ0-9]+/g));

