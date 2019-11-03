import {parseJson} from './json-parser';

console.log('start test!');
const value = parseJson('{"first": "world", "second": {"third" : "world"}}');
console.log(value);
