const cjsTsEslint = require("./tseslint.cjs");
const minTsEslint = require("./tseslint.min.js");
const jsTsEslint = require("./tseslint.js");
const {testLinter} = require("./testLinter.js");

testLinter("cjsTsEslint", cjsTsEslint);
testLinter("minTsEslint", minTsEslint);
testLinter("jsTsEslint", jsTsEslint);
