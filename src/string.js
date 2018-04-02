import R from 'ramda';

/**
 * split path to get head or tail
 */
export const splitHead = R.compose(R.head, R.split('.'));
export const splitTail = R.compose(R.join('.'), R.tail, R.split('.'));

export const splitOrArray = R.ifElse(
  R.is(Array),
  R.identity,
  R.split(',')
);