import R from 'ramda';

/**
 * is hexadecimal
 */
export const isHex = R.test(/^[0-9A-F]+$/i);

/**
 * is mongo objectId
 */
export const isObjectId = (str) => {
  return isHex(str) && str.length === 24;
};

