import ramda from 'ramda';
import * as func from './function';
import * as future from './future';
import * as list from './list';
import * as logic from './logic';
import * as math from './math';
import * as object from './object.js';
import * as relation from './relation';
import * as string from './string';
import * as type from './type';

export default Object.assign(ramda,
  func, future, list, logic, math, object, relation, string, type
);