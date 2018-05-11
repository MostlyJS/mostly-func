import R from 'ramda';

/**
 * merge deep with all
 */
export const mergeDeepAll = R.reduce(R.mergeDeepRight, {});

/**
 * merge with clone and handle the nil
 */
export const assignAll = (...objs) => {
  return mergeDeepAll(R.map(R.clone, R.reject(R.isNil, objs)));
};

/**
 * Returns a copy of second object with omitted
 * fields that are equal to fields from first object.
 * Kind of the reverse of R.merge.
 *
 * usage: subtractObject({ foo: 1, bar: 2 }, { foo: 1, bar: 'not 2', baz: 3 })
 *  // => { bar: "not 2", baz: 3}
 */
// :: Object -> Object -> Object
export const subtractObject = R.uncurryN(2, objToSubstract =>
  R.converge(R.omit, [
    R.compose(
      R.keys,
      R.pickBy(
        R.both((value, key) => R.has(key, objToSubstract),
               (value, key) => R.propEq(key, value, objToSubstract))
      )
    ),
    R.identity,
  ])
);

/**
 * Converts an array of key-value pairs into an object.
 *
 * @param {[string | number, any][]} entries - An array of key-value pairs.
 * @return {Object} An object whose keys are the first elements of the entries
 *     and whose values are the second elements of the entries.
 */
export const arrayAsObject = entries => entries.reduce((o, [k, v]) => (o[k] = v, o), {});

/**
 * Convert object to an array of key-value pairs
 *
 * usage: objArray(["key", "value"], {I: 2, it: 4, that: 1});
 * // [{"key": 2, "value": "I"}, {"key": 4, "value": "it"}, {"key": 1, "value": "that"}]
 */
// :: {a} -> [{ key :: String, value :: a }]
export const objectAsArray = R.curry((keys, obj) =>
  R.compose(R.map(R.zipObj(keys)), R.toPairs)(obj)
);

/**
 * Difference objects (similar to Guava's Maps.Difference)
 *
 * usage: diffObjs({a: 1, c: 5, d: 4 }, {a: 1, b: 2, d: 7});
 * =>
 *  {
 *    "common": { "a": 1 },
 *    "diff": {
 *      "d": { "left": 4, "right": 7 }
 *    },
 *    "left": { "c": 5 },
 *    "right": { "b": 2 }
 *  }
 */
const groupObjBy = R.curry(R.pipe(
  // Call groupBy with the object as pairs, passing only the value to the key function
  R.useWith(R.groupBy, [R.useWith(R.__, [R.last]), R.toPairs]),
  R.map(R.fromPairs)
));

export const diffObjs = R.pipe(
  R.useWith(R.mergeWith(R.merge), [R.map(R.objOf("left")), R.map(R.objOf("right"))]),
  groupObjBy(R.cond([
    [
      R.both(R.has("left"), R.has("right")),
      R.pipe(R.values, R.ifElse(R.apply(R.equals), R.always("common"), R.always("diff")))
    ],
    [R.has("left"), R.always("onlyOnLeft")],
    [R.has("right"), R.always("onlyOnRight")],
  ])),
  R.evolve({
    common: R.map(R.prop("left")),
    onlyOnLeft: R.map(R.prop("left")),
    onlyOnRight: R.map(R.prop("right"))
  })
);

/**
 * Filter an object using keys as well as values
 *
 * usage:
 *   filterWithKeys(
 *     (key, val) => key.length === val,
 *     {red: 3, blue: 5, green: 5, yellow: 2}
 *   ); //=> {red: 3, green: 5}
 */
export const filterWithKeys = R.curry((pred, obj) =>
  R.compose(R.fromPairs, R.filter(R.apply(pred)), R.toPairs)(obj)
);

/**
 * Finds a key that contains specified value.
 * If object contains few properties with this value
 * it will return only one, first matched.
 */
// :: a -> Map b a -> b
export const findKeyOfValue = R.curry((val, obj) =>
  R.compose(
    R.nth(0),
    R.find(R.compose(R.equals(val), R.nth(1))),
    R.toPairs
  )(obj)
);

/**
 * Get object by id
 */
// :: String -> Array -> Object
export const findById = R.converge(
  R.find,
  [R.pipe(R.nthArg(0), R.propEq("id")), R.nthArg(1)]
);

/**
 * Flatten a nested object into dot-separated key / value pairs
 *
 * usage: flattenObj({a:1, b:{c:3}, d:{e:{f:6}, g:[{h:8, i:9}, 0]}})
 * //=> {"a": 1, "b.c": 3, "d.e.f": 6, "d.g.0.h": 8, "d.g.0.i": 9, "d.g.1": 0}
 */
export const flattenObj = function () {
  const go = obj_ => R.chain(([k, v]) => {
    if (typeof v == 'object') {
      return R.map(([k_, v_]) => [`${k}.${k_}`, v_], go(v));
    } else {
      return [[k, v]];
    }
  }, R.toPairs(obj_));

  return R.compose(R.fromPairs, go);
};

/**
 * Checks if a value is a plain object.
 *
 * @param {any} it - The value to check whether or not it's a plain object.
 * @return {boolean} True if it's a plain object.
 */
export const isPlainObject = it => {
  return it !== null
    && typeof it === "object"
    && (!it.constructor || it.constructor === Object)
    && {}.toString.call(it) === "[object Object]";
};

/**
 * Map keys of an object
 *
 * usage: mapKeys(R.toUpper, { a: 1, b: 2, c: 3 }); // { A: 1, B: 2, C: 3 }
 */
export const mapKeys = R.curry((fn, obj) =>
  R.fromPairs(R.map(R.adjust(fn, 0), R.toPairs(obj)))
);

/**
 * Map keys/values of an object
 *
 * usage: mapKeysAndValues(([a, b]) => [b, a], { foo: "bar", baz: "boo" })
 *        // { bar: "foo", boo: "baz" }
 */
// :: ([a] -> [b]) -> Object -> Object
export const mapKeysAndValues = R.useWith(R.compose(R.fromPairs, R.map), [R.identity, R.toPairs]);

/**
 * Map object keys. Mapping functions have both key and value as arguments.
 *
 * uage: mapKeysWithValue((key, value) => value)({ foo: "bar" }) // { bar: "bar" }
 */
// :: ((String, a) -> b) -> Object -> Object
const wrapMapping = R.compose(R.juxt, R.flip(R.prepend)([R.last]), R.apply);
export const mapKeysWithValue = R.useWith(mapKeysAndValues, [wrapMapping, R.identity]);

/**
 * Make an object from an array using a mapper function
 *
 * usage: arr2obj(R.reverse, ['abc', 'def'])
 * // -> { abc: 'cba', def: 'fed' }
 */
export const objOfArray = R.curry((fn, arr) =>
  R.pipe(
    (list) => list.map(k => [k.toString(), fn(k)]),
    R.fromPairs
  )(arr)
);

/**
 * Like `R.objOf` but returns empty object {} if value is `null` or `undefined`
 */
// :: String -> a -> StrMap a
export const optObjOf = R.curry((key, val) => (val == null ? {} : { [key]: val }));

/**
 * Get object size
 */
// :: Object -> Number
export const objSize = R.nAry(1, R.pipe(
  R.when(R.is(Object), R.keys),
  R.when(R.is(Boolean), R.cond([[R.equals(false), R.always(null)], [R.T, R.always(1)]])),
  R.when(R.is(Number), R.toString),
  R.ifElse(R.isNil, R.always(0), R.length)
));

/**
 * Remove a subset of keys from an object whose associated values satisfy a given predicate
 *
 * usage: omitWhen(R.equals(2), ['a', 'c'], { a: 1, b: 1, c: 2, d: 2 });
 * // => { a: 1, b: 1, d: 2 }
 */
export const omitWhen = R.curry((fn, ks, obj) =>
  R.merge(R.omit(ks, obj), R.reject(fn, R.pick(ks, obj))));

/*
 * Like Ramda’s `omit` but works recursively, and never changes the type of
 * an input.
 */
// :: [String] -> a -> a
export const omitRecursively = R.curry((keys, input) => {
  const isPlainObject = R.both(R.is(Object), R.complement(R.is(Array)));

  return R.compose(
    R.map(R.when(R.is(Object), omitRecursively(keys))),
    R.when(isPlainObject, R.omit(keys))
  )(input);
});

/**
 * Returns whether or not an object has an own property with the specified name at a given path.
 *
 * usage:
 *   hasPath(['a', 'b'], { a: { b: 1 } }); //=> true
 *   hasPath([0], [1, 2]); //=> true
 */
// :: [Idx] -> {a} -> Boolean
export const hasPath = R.curryN(2, (path, obj) => {
  const prop = R.head(path);
  // termination conditions
  if (R.length(path) === 0 || !R.is(Object, obj)) {
    return false;
  } else if (R.length(path) === 1) {
    return R.has(prop, obj);
  }
  return hasPath(R.tail(path), R.path([prop], obj)); // base case
});

export const hasDotPath = R.useWith(R.hasPath, [R.split('.')]);

/**
 * pick by path
 */
export const pickPath = R.curry((names, obj) => {
  return R.reduce((acc, path) => {
    path = path.split('.');
    return R.assocPath(path, R.path(path, obj), acc);
  }, {}, names);
});

/**
 * dissoc fields by path
 */
export const dissocPaths = (names, obj) => {
  return R.reduce((acc, path) => {
    path = path.split('.');
    return R.dissocPath(path, acc);
  }, obj, names);
};

/**
 * Get an object's method names
 *
 * usage:
 *   var obj = {
 *     foo: true,
 *     bar: function() {},
 *     baz: function() {},
 *   };
 *   methodNames(obj); // => ['bar', 'baz']
 */
// :: methodNames :: Object -> [String]
export const methodNames = R.compose(R.keys, R.pickBy(R.is(Function)));

/**
 * Convert a list of property-lists (with header) into a list of objects
 *
 * usage:
 *   const tsv = [
 *     ['name',  'age', 'drink'],
 *     ['john',   23,   'wine'],
 *     ['maggie', 45,   'water']
 *   ];
 *   propertyList(tsv);
 *   //[
 *   //  {"age": 23, "drink": "wine", "name": "john"},
 *   //  {"age": 45, "drink": "water", "name": "maggie"}
 *   //]
 */
export const propertyList = R.compose(R.apply(R.lift(R.zipObj)), R.splitAt(1));

export const dotPath = R.useWith(R.path, [R.split('.')]);

export const dotPathEq = R.useWith(R.pathEq, [R.split('.')]);

export const assocDotPath = R.useWith(R.assocPath, [R.split('.')]);

// Derivative of R.props for deep fields with dot path
export const propsPath = R.useWith(R.ap, [R.map(dotPath), R.of]);

/**
 * Get lens for the given keys
 *
 * usage:
 *   const abLens = projectLens(['a', 'b']);
 *   R.set(abLens, { a: 11, b: 22 }, obj) //=> {"a": 11, "b": 22, "c": 3}
 *   R.view(abLens, obj) //=> {"a": 1, "b": 2}
 */
export const projectLens = keys => R.lens(R.pick(R.keys), R.flip(R.merge));

/**
 * assocPath work with arrays too
 *
 * R.assocPath(['a', 0, 'b'], 'hi', { a: [{ b: 'hey' }] })
 * // => { a: { '0': { b: 'hi' } } }
 *
 * R.setPath(['a', 0, 'b'], 'hi', { a: [{ b: 'hey' }] })
 * // => { a: [{ b: 'hi' }] }
 */
export const setPath = R.curry((path, val, obj) => R.compose(
  R.set(R.__, val, obj),
  R.apply(R.compose),
  R.map(R.cond([
    [R.is(Number), R.lensIndex],
    [R.T, R.lensProp]
  ]))
)(path));

export const setDotPath = R.useWith(setPath, [R.split('.')]);

/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to the keysMap object as `{oldKey: newKey}`.
 * When some key is not found in the keysMap, then it's passed as-is.
 *
 * Keep in mind that in the case of keys conflict is behaviour undefined and
 * the result may vary between various JS engines!
 *
 * usage: const input = { firstName: 'Elisia', type: 'human' }
 *        renameKeys({ firstName: 'name', type: 'kind' })(input) // //=> { name: 'Elisia', kind: 'human' }
 */
// :: {a: b} -> {a: *} -> {b: *}
export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce((acc, key) =>
    R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj)));

/**
 * Rename keys of an object by a function
 *
 * usage: renameBy(R.concat('a'), { A: 1, B: 2, C: 3 }) // { aA: 1, aB: 2, aC: 3 }
 */
export const renameKeysBy = R.curry((fn, obj) =>
  R.pipe(R.toPairs, R.map(R.adjust(fn, 0)), R.fromPairs)(obj));

/**
 * Switch keys with values.
 * E.G. { a: 'abc' } will become { abc: 'a' }
 */
// :: Map a b -> Map b a
export const invertMap = R.compose(R.fromPairs, R.map(R.reverse), R.toPairs);

/**
 * Sort object key
 */
export const sortKeys = R.pipe(R.toPairs, R.sortBy(R.prop(0)), R.fromPairs);

/**
 * spread the dissoced object
 *
 * usage:
 * spread("b", { a: 1, b: { c: 3, d: 4 } }); // -> { a: 1, c: 3, d: 4 }
 */
export const spread = R.converge(R.merge, [R.dissoc, R.propOr({})]);

/**
 * An alternative to Ramda's `where` that has the following differences:
 *     1. `whereAll` can take specs that can contain a nested structure.
 *     2. `whereAll` specs can use shorthands for property detection:
 *         `true` - check if the property is present in the test object.
 *         `false` - check if the property is absent in the test object.
 *         `null` - skip the existence check for the property.
 *
 * See also:
 * https://github.com/ramda/ramda/wiki/Cookbook#whereall-sort-of-like-a-recursive-version-of-ramdas-where
 *
 * @param {any} spec - Specification to validate against.
 * @param {any} data - Data to be validated.
 * @return {boolean} True if the data passed the specification.
 */
export const whereAll = (spec, data) => {
  if (typeof data === "undefined") return typeof spec === "boolean" && !spec;
  if (spec === null) return true;
  if (spec === false) return false;
  if (typeof spec === "number") return data === spec;
  if (typeof spec === "string") return data === spec;
  if (typeof spec === "symbol") return data === spec;

  return Object.entries(spec).reduce((valid, [key, value]) => {
    if (typeof value === "function" && !value(data[key])) {
      return false;
    }
    return whereAll(value, data[key]) ? valid : false;
  }, true);
};

/**
 * Makes a shallow clone of an object, overriding the specified property with
 * the supplied function, applied to the previous value. If no previous value
 * exists, the function will be given undefined as it's argument.
 *
 * Note: that this copies and flattens prototype properties onto the new object
 * as well. All non-primitive properties are copied by reference.
 *
 * usage:
 *   R.assocWith(inc, 'b', {a: 1, b: 2}); //=> {a: 1, b: 3 }
 *   R.assocWith(identity, 'c', {a: 1, b: 2}); //=> {a: 1, b: 2, c: undefined}
 */
// :: (v -> w) -> String -> {k: v} -> {k: v}
export const assocWith = R.curryN(3, (fn, prop, obj) => {
  var result = R.is(Array, obj) ? [] : {};
  for (var p in obj) {
    result[p] = obj[p];
  }
  result[prop] = fn(result[prop]);
  return result;
});


/**
 * Makes a shallow clone of an object, setting or overriding the nodes required
 * to create the given path, and applying the given function to the tail end of
 * that path. If no previous value exists, undefined will be supplied to the
 * given function. If the path supplied is an empty list, the whole object will
 * be applied to the given function.
 *
 * Note that this copies and flattens prototype properties onto
 * the new object as well. All non-primitive properties are copied by reference.
 *
 * usage:
 *   R.assocPathWith(always(42), ['a', 'b', 'c'], {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
 *   R.assocPathWith(always(42), ['a', 'b', 'c'], {a: 5}); //=> {a: {b: {c: 42}}}
 *   R.assocPathWith(always(42), [], {a: 5}); //=> 42
 */
// :: (v -> w) -> [String] -> {k: v} -> {k: v}
export const assocPathWith = R.curryN(3, function assocPathWith (fn, path, obj) {
  switch (path.length) {
    case 0: return fn(obj);
    case 1:
      return assocWith(fn, path[0], obj);
    default:
      var idx = path[0];
      var result = Number.isInteger(idx) ? [] : {};
      for (var p in obj) {
        result[p] = obj[p];
      }
      result[idx] = assocPathWith(fn, Array.prototype.slice.call(path, 1), result[idx]);
      return result;
  }
});
