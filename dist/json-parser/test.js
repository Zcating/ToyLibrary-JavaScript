"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_parser_1 = require("./json-parser");
console.log('start test!');
const value = json_parser_1.parseJson('{"first": "world", "second": {"third" : "world"}}');
console.log(value);
//# sourceMappingURL=test.js.map