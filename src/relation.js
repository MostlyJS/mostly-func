import R from 'ramda';

/**
 * some convenient complement
 */
export const isNotEquals = R.both(R.complement(R.isNil), R.complement(R.equals));

/**
 * is mongo objectId equals with string
 */
export const idEquals = R.curry((a, b) =>
  a && typeof a.equals === 'function'? a.equals(b) : R.equals(a, b)
);