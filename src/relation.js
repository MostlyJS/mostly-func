import R from 'ramda';

/**
 * Some convenient complement
 */
export const isNotEquals = R.both(R.complement(R.isNil), R.complement(R.equals));

/**
 * Is mongo objectId/string equals with another
 */
export const idEquals = R.curry((a, b) => {
  if (a && typeof a.equals === 'function') return a.equals(b);
  if (b && typeof b.equals === 'function') return b.equals(a);
  return R.equals(a, b);
});

/**
 * Returns true if prop equals as mongo objectId/string
 */
export const idPropEq = R.curry((name, val, obj) =>
  R.propSatisfies(idEquals(val), name, obj)
);
export const idPropNe = R.complement(idPropEq);
