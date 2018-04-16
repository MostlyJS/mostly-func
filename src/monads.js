import R from 'ramda';
import { Maybe, Either } from 'sanctuary';

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
export const catMaybies = R.compose(
  R.map(explodeMaybe('Expected Just, but got Nothing.')),
  R.filter(Maybe.isJust)
);

/**
 * Unwraps Either monad and returns it’s value if it is Right and throws an Error
 * if it is Left.
 */
// :: Either a b -> b
export const explodeEither = Either.fold(err => {
  throw new Error(`Explosion failed: ${err}`);
}, R.identity);
