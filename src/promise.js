import R from 'ramda';

/**
 * Like `R.tap` but works with Promises.
 * @param {Function} promiseFn Function that returns Promise
 * @returns {Function} Run promiseFn with argument and returns the same argument on resolve
 */
export const tapP = promiseFn => arg => promiseFn(arg).then(R.always(arg));

// :: ERROR_CODE -> Error -> Promise.Reject Error
export const rejectWithCode = R.curry((code, err) =>
  Promise.reject(Object.assign(err, { errorCode: code }))
);

// :: [Promise a] -> Promise a
export const allP = promises => Promise.all(promises);

// :: Number -> Promise.Resolved ()
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

