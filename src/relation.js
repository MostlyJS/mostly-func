import R from 'ramda';

/**
 * some convenient complement
 */
export const isNotEquals = R.both(R.complement(R.isNil), R.complement(R.equals));

/**
 * is mongo objectId equals with string
 */
export const idEquals = R.curry((a, b) => {
  if (a && typeof a.equals === 'function') return a.equals(b);
  if (b && typeof b.equals === 'function') return b.equals(a);
  return R.equals(a, b);
});
