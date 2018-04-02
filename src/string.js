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