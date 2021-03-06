const R = require('ramda');

/**
 * some convenient aka/alias
 */
const flatMap = R.chain;
const maptAt = R.adjust;
const constant = R.always;
const some = R.any;
const match = R.cond;
const includes = R.contains;

/**
 * Group by multiple
 *
 * usage: groupByMultiple([R.prop('a'), R.prop('b'), R.prop('c')], data)
 */
const groupByMultiple = R.curry((fields, data) => {
  if (fields.length === 1) return R.groupBy(fields[0], data);
  let groupBy = R.groupBy(R.last(fields));
  R.times(() => {
    groupBy = R.mapObjIndexed(groupBy);
  }, fields.length - 1);

  return groupBy(groupByMultiple(R.init(fields), data));
});

/**
 * Do any item in a list appear in another list?
 *
 * usage: includesAny(['a', 'e'], ['a', 'b', 'c']) // true
 */
// :: [a] -> [a] -> Boolean
const includesAny = R.curry(R.compose(R.not, R.isEmpty, R.intersection));

/**
 * Do all item in a list appear in another list?
 *
 * usage: includesAll([2, 1], [1, 2, 3]) // true
 */
// :: [a] -> [a] -> Boolean
const includesAll = R.curry(R.compose(R.isEmpty, R.difference));

/**
 * Do any item in a list not appear in another list?
 *
 * usage: includesNone(['e', 'f'], ['a', 'b', 'c']) // true
 */
// :: [a] -> [a] -> Boolean
const includesNone = R.curry(R.compose(R.isEmpty, R.intersection));

/**
 * Create a list function
 *
 * usage: R.compose(R.sum, list)(1, 2, 3) // 6
 */
// :: a... -> [a...]
const list = R.compose(R.flatten, R.unapply(R.identity));

/**
 * Returns an array containing the value provided.
 * If value is already an array, it is returned as is.
 *
 * usage: ensureArray(42); //=> [42]
 *        ensureArray([42]); //=> [42]
 */
// :: a | [a] -> [a]
const asArray = R.when(R.complement(R.is(Array)), R.of);

/**
 * Creates list of length `n`. Every item in list equals to `input` parameter.
 *
 * usage replicate(2, 6) // [6, 6]
 */
// :: Number -> a -> [a]
const replicate = R.flip(R.repeat);
const duplicate = replicate(2);

/**
 * Creates an array with all falsy values removed.
 * The values false, null, 0, "", undefined, and NaN are falsy.
 *
 * usage: compact([0, 1, false, 2, '', 3]); //=> [1, 2, 3]
 */
// Filterable f => f a -> f a
const compact = R.reject(R.compose(R.equals(false), Boolean));

/**
 * Maps an array using a mapping function (val, index, obj) receives
 * an array element, its index, and the whole array itself
 */
// :: ((a, Number, [a]) -> b) -> [a] -> [b]
const mapIndexed = R.addIndex(R.map);

/**
 * map with (val, index, obj) callback
 */
const reduceIndexed = R.addIndex(R.reduce);

/**
 * Pick values a from list by indexes
 *
 * usage: pickIndexes([0, 2], ['a', 'b', 'c']); // => ['a', 'c']
 */
// :: [Number] -> [a] -> [a]
const pickIndexes = R.compose(R.values, R.pickAll);

/**
 * Create a new object from a list objects by picking key and value
 *
 * usage:
 *   var list = [{ id: 'a', val: 1000 }, { id: 'b', val: 2000 }];
 *   pickFrom('id', 'val', list); // => { 'a': 1000, 'b': 2000 }
 */
const pickFrom = R.curry((key, val, list) =>
  R.reduce((acc, i) => R.assoc(i[key], i[val], acc), {}, list));

/**
 * Count members of the given filterable which satisfy the given predicate
 */
const count = R.compose(R.length, R.filter);

/**
 * Returns an over lens to the first index of list.
 *
 * usage: overhead(R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 *
 */
const overhead = R.over(R.lensIndex(0));

/**
 * find object in a list by prop
 */
const findByProp = R.curry((prop, value, list) => R.find(R.propEq(prop, value), list));

/**
 * find object in a list by id
 */
const findById = R.curry((id, list) => R.find(R.propEq('id', id), list));

/**
 * Pivot a table with a function to resolve conflicts (multiple values
 * for the same attribute)
 *
 * usage:
 *   pivotWith(R.min, "attribute", "value", [
 *     { key: "key1", attribute: "attribute1" , value: 1 },
 *     { key: "key1", attribute: "attribute3" , value: 3 },
 *     { key: "key2" , attribute: "attribute1" , value: 2 },
 *     { key: "key2", attribute: "attribute1", value: 8 },
 *     { key: "key2", attribute: "attribute2", value: 4 },
 *   ])
 *   result:
 *   [{ key: key1, attribute1: 1, attribute3: 3 },
 *    { key: key2, attribute1: 2, attribute2: 4 }]
 */
const pivotWith = R.curry((fn, keyCol, valCol, table) => R.pipe(
  R.groupWith(R.eqBy(R.omit([keyCol, valCol]))),
  R.map((rowGroup) => R.reduce(
    R.mergeWith(fn),
    R.omit([keyCol, valCol], rowGroup[0]),
    rowGroup.map((row) => ({ [row[keyCol]]: row[valCol] }))
  )),
)(table));

/**
 * Pivot a table
 *
 * usage:
 *   pivot("attribute", "value", [
 *     { key: "key1", attribute: "attribute1", value: 1 },
 *     { key: "key1", attribute: "attribute3", value: 3 },
 *     { key: "key2", attribute: "attribute1", value: 2 },
 *     { key: "key2", attribute: "attribute2", value: 4 },
 *   ])
 *   result:
 *   [{ key: key1, attribute1: 1, attribute3: 3 },
 *    { key: key2, attribute1: 2, attribute2: 4 }]
 */
const pivot = pivotWith(R.nthArg(0));

/**
 * Unpivot a table
 *
 * usage:
 *   unpivot([ "attribute1", "attribute2", "attribute3" ], "attribute", "value",
 *     [{ key: "key1", attribute1: 1, attribute2: null, attribute3: 3 }])
 *   result:
 *   [{ attribute: attribute1, value: 1, key: key1 },
 *    { attribute: attribute3, value: 3, key: key1 }]
 */
const unpivot = R.curry((cols, attrCol, valCol, table) => R.chain((row) => R.pipe(
  R.pick(cols),
  R.filter(R.complement(R.isNil)),
  R.mapObjIndexed((v, k) => Object.assign({ [attrCol]: k, [valCol]: v }, R.omit(cols, row))),
  R.values,
)(row), table));

/**
 * Unpivot any other columns in a table
 *
 * usage: unpivotRest([ "key" ], "attribute", "value",
 *     [{ key: "key1", attribute1: 1, attribute2: null, attribute3: 3 }])
 *   result:
 *   [{ attribute: attribute1, value: 1, key: key1 },
 *    { attribute: attribute3, value: 3, key: key1 }]
 */
const unpivotRest = R.curry((cols, attrCol, valCol, table) => R.chain((row) => R.pipe(
  R.omit(cols),
  R.filter(R.complement(R.isNil)),
  R.mapObjIndexed((v, k) => Object.assign({ [attrCol]: k, [valCol]: v }, R.pick(cols, row))),
  R.values,
)(row), table));

/**
 * Separate a list into n parts
 *
 * usage: separate(2, ['a','b','c','d','e'])
 * // -> [['a','b','c'],['d','e']]
 */
const separate = R.curry((n, list) => {
  var len = list.length;
  var idxs = R.range(0, len);
  var f = (_v, idx) => Math.floor(idx * n / len);
  return R.values(R.addIndex(R.groupBy)(f, list));
});

/**
 * Separate a list into n parts based on a comparator
 */
const separateBy = R.curry((comparator, n, coll) => {
  let sorted = R.sortBy(comparator, coll);
  return separate(n, sorted);
});

/*
 * Sort a List by array of props (if first prop equivalent, sort by second, etc.)
 *
 * usage: sortByProps(["a","b","c"], [{a:1,b:2,c:3}, {a:10,b:10,c:10}, {a:10,b:6,c:0}, {a:1, b:2, c:1}, {a:100}])
 * //=> [{a:100}, {a:10,b:10,c:10}, {a:10,b:6,c:0}, {a:1,b:2,c:3}, {a:1, b:2, c:1}]
 */
const variadicEither = (head, ...tail) =>
  R.reduce(R.either, head, tail);
const makeComparator = (prop) =>
  R.comparator((a,b) =>
    R.gt(R.prop(prop, a), R.prop(prop, b)));
const sortByProps = (props, list) =>
  R.sort(variadicEither(...R.map(makeComparator, props)), list);

/**
 * Returns a curried comparator function that can be used with R.sort. Supports any
 * number of sort orders (i.e. property1 ascending, property 2 descending, etc.).
 * It also supports type based sorting (i.e. recognizes Date, Number, etc. and
 * sorts them appropriately).
 *
 * The sort order is speicfied with props as string or an array of strings.
 * Each string signifies a property name to compare. A '+' prefix is used to signify
 * ascending order and a '-' prefix is used to signify descending order.
 *
 * usage: var props = ['-d', '+s', '-n', 'b'];
 *        R.sort(compareProps(props), list);
 *
 */
const compareProps = (props, a, b) => {
  // determine property compare function (lt or gt) based on + or -
  var propCompares = R.map(prop => prop[0] == '-'? R.gt : R.lt, props);
  // remove + and - from property names
  props = R.map(R.replace(/^(-|\+)/, ''), props);
  // determine which properties are equal
  var equalProps = R.map(prop => R.equals(a[prop], b[prop]), props);
  // find first non-equal property
  var index = R.findIndex(R.equals(false), equalProps);
  // if found then compare that property
  if (index >= 0) {
    return R.comparator(propCompares[index])(a[props[index]], b[props[index]]);
  } else {
    return 0; // return all properties equal
  }
};

/**
 * Swaps two elements of `array` having `oldIndex` and `newIndex` indexes.
 */
// :: Number -> Number -> [a] -> [a]
const swap = (oldIndex, newIndex, array) => {
  const len = array.length;
  if (oldIndex >= len || newIndex >= len) {
    throw new Error(
      `Can not swap items that out of an array: ${oldIndex} > ${newIndex}. Array length: ${len}.`
    );
  }

  const oldItem = R.nth(oldIndex, array);
  const newItem = R.nth(newIndex, array);

  return R.pipe(R.update(oldIndex, newItem), R.update(newIndex, oldItem))(
    array
  );
};

/**
 * Gets elements that are unique throughout a given group of arrays.
 *
 * @param {any[][]} a - A group of arrays to get unique elements from.
 * @return {any[]} An array of unique elements.
 */
const uniquesFor = (...a) => [...new Set([].concat(...a))];

/**
 * Returns the list of list of strings.
 * Removes all duplicates from the subsequent list
 * on the basis of already filtered values lists.
 *
 * E.G.
 * [['a', 'b', 'c'], ['b','c','d'], ['a','d','e']]
 * will become
 * [['a', 'b', 'c'], ['d'], ['e']]
 */
// :: [[String]] -> [[String]]
const uniqLists = R.reduce((acc, nextList) =>
  R.append(R.without(R.unnest(acc), nextList), acc), []);

/**
 * Returns a shuffled version of a list, using the
 * [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
 */
const shuffler = R.curry((random, list) => {
  let idx = -1;
  let len = list.length;
  let position;
  let result = [];
  while (++idx < len) {
    position = Math.floor((idx + 1) * random());
    result[idx] = result[position];
    result[position] = list[idx];
  }
  return result;
});
const shuffle = shuffler(Math.random);

module.exports = {
  asArray,
  compact,
  compareProps,
  constant,
  count,
  duplicate,
  findById,
  findByProp,
  flatMap,
  groupByMultiple,
  includes,
  includesAll,
  includesAny,
  includesNone,
  list,
  mapIndexed,
  maptAt,
  match,
  overhead,
  pickFrom,
  pickIndexes,
  pivot,
  pivotWith,
  reduceIndexed,
  replicate,
  separate,
  separateBy,
  shuffle,
  shuffler,
  some,
  sortByProps,
  swap,
  uniqLists,
  uniquesFor,
  unpivot,
  unpivotRest
};