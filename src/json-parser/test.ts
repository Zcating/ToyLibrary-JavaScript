import {parseJson} from './json-parser';

console.log('start test!');
const value = parseJson('{"hello": "world"}');
console.log(value);
