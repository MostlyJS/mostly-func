import ramda from 'ramda';
import * as sanctuary from './sanctuary';
import * as func from './function';
import * as future from './future';
import * as list from './list';
import * as logic from './logic';
import * as math from './math';
import * as monads from './monads';
import * as object from './object';
import * as promise from './promise';
import * as relation from './relation';
import * as string from './string';
import * as type from './type';

export default Object.assign(ramda, sanctuary,
  func, future, list, logic, math, monads, object, promise, relation, string, type
);