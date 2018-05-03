import R from 'ramda';

export const noop = () => {};

/**
 * Apply a given function N times
 *
 * usage: applyN(x => x * x, 4)(2); //=> 65536 (2 -> 4 -> 16 -> 256 -> 65536)
 */
export const applyN = R.compose(R.reduceRight(R.compose, R.identity), R.repeat);

/**
 * Apply function over the value at the end of a path
 *
 * usage: mapPath(['a', 'b', 'c'], R.inc, {a: {b: {c: 3}}});
 *   //=> { a: { b: { c: 4 } } }
 */
// :: [String] -> (a -> b) -> {k: a} -> {k: b}
export const applyPath = R.curry((path, fn, obj) =>
  R.assocPath(path, fn(R.path(path, obj)), obj)
);

/**
 * This allows you to create functions that work on a heterogenous collection
 * and return a new collection of the same arity. It is an relative of juxt.
 * Like juxt it takes a series of functions and returns a new function.
 * Unlike juxt the resulting function takes a sequence. The functions and
 * sequence are zipped together and invoked.
 *
 * usage:
 *   const pairs = [["key1", "VAL1"], ["key2", "VAL2"], ["key3", "VAL3"]];
 *   knit([toUpper, toLower])(pairs);
 *     //=> [["KEY1", "val1"], ["KEY2", "val2"], ["KEY3", "val3"]]
 */
export const knit = R.compose(R.map, R.zipWith(R.call));