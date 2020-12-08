require("babel-core/register");
require("babel-polyfill");

require = require("esm")(module /* , options */);
module.exports = require("./dist/app");
