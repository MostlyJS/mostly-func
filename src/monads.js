import R from 'ramda';
import { default as S, Maybe, Either } from 'sanctuary';

/*
 * Shortcuts for easier ReasonML interop
 */
export const eitherLeft = S.Left;
export const eitherRight = S.Right;

/**
 * adapter function to extract value from `Either` by providing a function
 * to handle the types of values contained in both `Left` and `Right`.
 */
export const foldEither = S.either;

/**
 * adapter function to extract value from `Maybe` by providing
 * a default value for `Nothing` and function to handle `Just`.
 */
export const foldMaybe = S.maybe;

/**
 * Function to rapidly extract a value from Maybe.Just
 * or throw a defined error message on Maybe.Nothing
 */
// :: String -> Maybe a -> a
export const explodeMaybe = (errorMessage, maybeObject) => {
  if (maybeObject.isJust) return maybeObject.value;
  throw new Error(errorMessage);
};

// :: [Maybe a] -> [a]
export const catMaybies = (maybeObjects) => R.compose(
  R.map(explodeMaybe('Expected Just, but got Nothing.')),
  R.filter(Maybe.isJust)
)(maybeObjects);

/**
 * Unwraps Either monad and returns it’s value if it is Right and throws an Error
 * if it is Left.
 */
// :: Either a b -> b
export const explodeEither = foldEither(err => {
  throw new Error(`Explosion failed: ${err}`);
}, R.identity);

// :: Either a b -> Promise a b
export const eitherToPromise = foldEither(
  Promise.reject.bind(Promise),
  Promise.resolve.bind(Promise)
);

// :: (() -> b) -> (a -> a) -> Maybe a -> Promise a b
export const maybeToPromise = R.curry((nothingFn, justFn, maybe) =>
  new Promise((resolve, reject) =>
    (maybe.isJust ? resolve(maybe.value) : reject())
  ).then(justFn, nothingFn)
);

/**
 * Returns a result of calling iterator function over argument list.
 * Use this function if iterator function returns some Monad.
 * Monad constructor should be passed as first argument, cause
 * we haven't got type deduction in JS. :-(
 * E.G.
 * assocLink :: Link -> Patch -> Either Error Patch
 * upsertLinks = reduceEither(assocLink, patch, [link0, link1, link2]);
 */
// :: (b -> m b) -> (b -> a -> m b) -> b -> [a] -> m c
export const reduceM = R.curry((m, fn, initial, list) =>
  R.reduce((acc, a) => R.chain(val => fn(val, a), acc), m(initial), list)
);

/**
 * Returns a result of calling iterator function over argument list.
 * Use this function if iterator function returns Either.
 * @see reduceM for more details
 */
// :: (b -> a -> Either c b) -> b -> [a] -> Either c b
export const reduceEither = reduceM(S.of(Either));

/**
 * Returns a result of calling iterator function over argument list.
 * Use this function if iterator function returns Either.
 * @see reduceM for more details
 */
// :: (b -> a -> Maybe b) -> b -> [a] -> Maybe b
export const reduceMaybe = reduceM(S.of(Maybe));
