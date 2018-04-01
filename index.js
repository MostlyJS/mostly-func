require = require("esm")(module/*, options*/);
console.time('mostly-func import');
module.exports = require("./src/index").default;
console.timeEnd('mostly-func import');

