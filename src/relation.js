import R from 'ramda';

/**
 * some convenient complement
 */
export const isNotEquals = R.both(R.complement(R.isNil), R.complement(R.equals));
