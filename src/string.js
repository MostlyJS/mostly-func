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
 * Splits string into list. Delimiter is every sequence of non-alphanumerical values.
 *
 * usage: splitAlphameric('Hello    world/1'); // ['Hello', 'world', '1']
 */
// :: String -> [String]
export const splitAlphameric = R.o(R.reject(R.equals('')), R.split(/[^a-zéçA-ZÉÇ0-9]+/g));

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
 */
// :: String -> String
export const dotCase = R.o(
  R.join('.'),
  R.o(R.map(R.toLower), splitAlphameric)
);

/**
 * Converts string into kebab-case.
 *
 * usage: kebabCase('hello-world')   // 'hello-world'
 *        kebabCase('hello- world')    // 'hello-world'
 *        kebabCase('  hello-/ world/ ') // 'hello-world'
 */
 // :: String -> String
export const kebabCase = R.o(
  R.join('-'),
  R.o(R.map(R.toLower), splitAlphameric)
);

/**
 * Converts string into PascalCase.
 *
 * usage: pascalCase('hello-world')    // 'HelloWorld'
 *        pascalCase('hello- world')   // 'HelloWorld'
 *        pascalCase('  hello-/ world/ ')  // 'HelloWorld'
 */
// :: String -> String
export const pascalCase = R.o(
  R.join(''),
  R.o(R.map(upperFirst), splitAlphameric)
);

