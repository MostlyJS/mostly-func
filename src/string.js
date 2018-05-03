import R from 'ramda';

/**
 * Split path to get head or tail
 */
export const splitHead = R.compose(R.head, R.split('.'));
export const splitTail = R.compose(R.join('.'), R.tail, R.split('.'));
export const capitalize = R.replace(/^./, R.toUpper);

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
 * parse 'null' or 'undefined' string as null
 */
export const parseNil = R.cond([
  [R.equals('null'), R.always(null)],
  [R.equals('undefined'), R.always(null)],
  [R.equals('0'), R.always(null)],
  [R.equals('false'), R.always(null)],
  [R.equals('NaN'), R.always(null)],
  [R.T, R.identity]
]);

/**
 * truncate string to length
 */
// :: String -> String
export const truncate = lenth => R.when(
  R.propSatisfies(R.gt(R.__, lenth), 'length'),
  R.pipe(R.take(lenth), R.append('…'), R.join(''))
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
 * Testing string if ends with some suffix.
 *
 * usage: suffixWith('o', 'hello')     // true
 *        suffixWith('ello', 'hello')  // true
 *        suffixWith('y', 'good bye')  // false
 */
// :: a -> b -> Boolean
const reEnds = R.useWith(R.flip(regExp)('gi'), [R.flip(R.concat)('$')]);
const suffixWith = R.useWith(R.test, [reEnds, R.identity]);

/**
 * Splits string into list. Delimiter is every sequence of non-alphanumerical values.
 *
 * usage: splitAlphameric('Hello    world/1'); // ['Hello', 'world', '1']
 */
// :: String -> [String]
export const splitAlphameric = R.o(R.reject(R.equals('')), R.split(/[^a-zA-Z0-9]+/g));

/**
 * Split string on caplital letters
 */
// :: String -> [String]
export const splitCapital = R.split(/(?=[A-Z])/); // positive lookahead to split by the capital letters

/**
 * Split string on caplital letters and non-alphanumerical values
 */
// :: String -> [String]
export const splitCapitalAlphameric = R.o(R.chain(splitCapital), splitAlphameric);

/**
 * Decapitalize first letter.
 *
 * usage: lowerFirst('HELLO WORLD') // 'hELLO WORLD'
 */
// :: String -> String
export const lowerFirst = R.o(R.join(''), R.adjust(R.toLower, 0));

/**
 * Capitalize first letter.
 * uage: upperFirst('hello world') // 'Hello world'
 */
// :: String -> String
export const upperFirst = R.o(R.join(''), R.adjust(R.toUpper, 0));

/**
 * Converts string into dot.case.
 *
 * usage: dotCase('hello-world')   // 'hello.world'
 *        dotCase('hello/*? world')    // 'hello.world'
 *        dotCase('  hello -/ world/ ')  // 'hello.world'
 *        dotCase('helloWorld/ ')  // 'hello.world'
 */
// :: String -> String
export const dotCase = R.o(
  R.join('.'),
  R.o(R.map(R.toLower), splitCapitalAlphameric)
);

/**
 * Converts string into kebab-case.
 *
 * usage: kebabCase('hello-world')   // 'hello-world'
 *        kebabCase('hello- world')    // 'hello-world'
 *        kebabCase('  hello-/ world/ ') // 'hello-world'
 *        kebabCase('helloWorld/ ')  // 'hello-world'
 */
 // :: String -> String
export const kebabCase = R.o(
  R.join('-'),
  R.o(R.map(R.toLower), splitCapitalAlphameric)
);

/**
 * Converts string into PascalCase.
 *
 * usage: pascalCase('hello-world')    // 'HelloWorld'
 *        pascalCase('hello- world')   // 'HelloWorld'
 *        pascalCase('  hello-/ world/ ')  // 'HelloWorld'
 *        pascalCase('helloWorld/ ')  // 'HelloWorld'
 */
// :: String -> String
export const pascalCase = R.o(
  R.join(''),
  R.o(R.map(upperFirst), splitCapitalAlphameric)
);

/**
 * Converts string into camelCase.
 *
 * usage: camelCase('hello-world')   // 'helloWorld'
 *        camelCase('hello- world')    // 'helloWorld'
 *        camelCase('  hello-/ world/ ') // 'helloWorld'
 *        camelCase('HelloWorld/ ')  // 'helloWorld'
 */
 // :: String -> String
export const camelCase = R.o(lowerFirst, pascalCase);

/**
 * Converts string into snake_case.
 *
 * usage: snakeCase('hello-world')   // 'hello_world'
 *        snakeCase('hello- world')    // 'hello_world'
 *        snakeCase('  hello-/ world/ ') // 'hello_world'
 *        snakeCase('HelloWorld/ ')  // 'hello_world'
 */
// :: String -> String
export const snakeCase = R.o(
  R.join('_'),
  R.o(R.map(R.toLower), splitCapitalAlphameric)
);
