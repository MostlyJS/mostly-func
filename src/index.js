const ramda = require('ramda');
const func = require('./function');
const future = require('./future');
const list = require('./list');
const logic = require('./logic');
const math = require('./math');
const monads = require('./monads');
const object = require('./object');
const promise = require('./promise');
const relation = require('./relation');
const string = require('./string');
const type = require('./type');

module.exports = Object.assign(ramda,
  func, future, list, logic, math, monads, object, promise, relation, string, type
);