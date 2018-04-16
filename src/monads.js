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
