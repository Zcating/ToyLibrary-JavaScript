"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["START_OBJ"] = 0] = "START_OBJ";
    TokenType[TokenType["END_OBJ"] = 1] = "END_OBJ";
    TokenType[TokenType["START_ARRAY"] = 2] = "START_ARRAY";
    TokenType[TokenType["END_ARRAY"] = 3] = "END_ARRAY";
    TokenType[TokenType["NULL"] = 4] = "NULL";
    TokenType[TokenType["NUMBER"] = 5] = "NUMBER";
    TokenType[TokenType["STRING"] = 6] = "STRING";
    TokenType[TokenType["BOOLEAN"] = 7] = "BOOLEAN";
    TokenType[TokenType["COLON"] = 8] = "COLON";
    TokenType[TokenType["COMMA"] = 9] = "COMMA";
    TokenType[TokenType["END_DOC"] = 10] = "END_DOC";
})(TokenType || (TokenType = {}));
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
class Tokenizer {
    constructor(text) {
        this.text = text;
        this.textIndex = 0;
        this.tokens = [];
    }
    tokenize() {
        let token = null;
        this.textIndex = 0;
        do {
            token = this.start();
            this.tokens.push(token);
        } while (token.type !== TokenType.END_DOC);
    }
    read() {
        return this.text.charAt(this.textIndex++);
    }
    unread() {
        this.textIndex--;
    }
    next() {
        return this.tokens.splice(0, 1)[0];
    }
    peek(index) {
        return this.tokens[index];
    }
    hasNext() {
        return this.tokens[0].type !== TokenType.END_DOC;
    }
    start() {
        let cursor = '';
        do {
            cursor = this.read();
        } while (this.isSpace(cursor));
        if (this.isNull(cursor)) {
            return new Token(TokenType.NULL, 'null');
        }
        else if (cursor === ',') {
            return new Token(TokenType.COMMA, ',');
        }
        else if (cursor === ':') {
            return new Token(TokenType.COLON, ':');
        }
        else if (cursor === '{') {
            return new Token(TokenType.START_OBJ, '{');
        }
        else if (cursor === '}') {
            return new Token(TokenType.END_OBJ, '}');
        }
        else if (cursor === '[') {
            return new Token(TokenType.START_ARRAY, '[');
        }
        else if (cursor === ']') {
            return new Token(TokenType.END_ARRAY, ']');
        }
        else if (this.isTrue(cursor)) {
            return new Token(TokenType.BOOLEAN, 'true');
        }
        else if (this.isFalse(cursor)) {
            return new Token(TokenType.BOOLEAN, 'false');
        }
        else if (cursor === '"') {
            cursor = this.read();
            let redString = '';
            while (cursor !== '"') {
                redString += cursor;
                cursor = this.read();
            }
            return new Token(TokenType.STRING, redString);
        }
        else if (this.isNum(cursor)) {
            this.unread();
            return this.readNum();
        }
        else if (this.textIndex >= (this.text.length - 1)) {
            return new Token(TokenType.END_DOC, 'EOF');
        }
        else {
            throw new Error('Invalid JSON input.');
        }
    }
    isSpace(cursor) {
        return cursor === ' ';
    }
    isNull(cursor) {
        if (cursor !== 'n') {
            return false;
        }
        cursor = this.read();
        if (cursor !== 'u') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 'l') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 'l') {
            throw new Error('Invalid JSON input.');
        }
        return true;
    }
    isTrue(cursor) {
        if (cursor !== 't') {
            return false;
        }
        cursor = this.read();
        if (cursor !== 'r') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 'u') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 'e') {
            throw new Error('Invalid JSON input.');
        }
        return true;
    }
    isFalse(cursor) {
        if (cursor !== 'f') {
            return false;
        }
        cursor = this.read();
        if (cursor !== 'a') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 'l') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 's') {
            throw new Error('Invalid JSON input.');
        }
        cursor = this.read();
        if (cursor !== 'e') {
            throw new Error('Invalid JSON input.');
        }
        return true;
    }
    isNum(cursor) {
        const res = cursor.charCodeAt(0);
        return (48 <= res && res <= 57) || cursor === '-';
    }
    readNum() {
        let cursor = this.read();
        let redString = '';
        while (cursor !== ',') {
            if (!this.isNum(cursor)) {
                throw new Error('Invalid JSON input.');
            }
            redString += cursor;
            cursor = this.read();
        }
        return new Token(TokenType.NUMBER, redString);
    }
}
class Parser {
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }
    getObject() {
        this.tokenizer.next();
        let map = {};
        if (this.isToken(TokenType.END_OBJ)) {
            this.tokenizer.next();
            return Object.assign({}, map);
        }
        else if (this.isToken(TokenType.STRING)) {
            map = this.getKeyOf(map);
        }
        return Object.assign({}, map);
    }
    getArray() {
        this.tokenizer.next();
        let list = [];
        let myArr = [];
        if (this.isToken(TokenType.START_ARRAY)) {
            myArr = this.getArray();
            list.push(myArr);
            if (this.isToken(TokenType.COMMA)) {
                this.tokenizer.next();
                list = this.element(list);
            }
        }
        else if (this.isPrimary()) {
            list = this.element(list);
        }
        else if (this.isToken(TokenType.COMMA)) {
            list.push(this.getObject());
            while (this.isToken(TokenType.COMMA)) {
                this.tokenizer.next();
                list.push(this.getObject());
            }
        }
        else if (this.isToken(TokenType.END_ARRAY)) {
            this.tokenizer.next();
            myArr = [...list];
            return myArr;
        }
        this.tokenizer.next();
        myArr = [...list];
        return myArr;
    }
    element(list) {
        list.push(this.parseAsPrimary(this.tokenizer.next().value));
        if (this.isToken(TokenType.COMMA)) {
            // ,
            this.tokenizer.next();
            if (this.isPrimary()) {
                list = this.element(list);
            }
            else if (this.isToken(TokenType.START_OBJ)) {
                list.push(this.getObject());
            }
            else if (this.isToken(TokenType.START_ARRAY)) {
                list.push(this.getArray());
            }
            else {
                throw new Error('Invalid JSON input.');
            }
        }
        else if (this.isToken(TokenType.END_ARRAY)) {
            return list;
        }
        else {
            throw new Error('Invalid JSON input.');
        }
        return list;
    }
    isToken(value) {
        const token = this.tokenizer.peek(0);
        if (typeof value === 'string') {
            return token.value === value;
        }
        else {
            return token.type === value;
        }
    }
    getKeyOf(map) {
        const key = this.tokenizer.next().value;
        if (!this.isToken(TokenType.COLON)) {
            throw new Error('');
        }
        else {
            // :
            this.tokenizer.next();
            if (this.isPrimary()) {
                const token = this.tokenizer.next();
                map[key] = this.parseAsPrimary(token.value);
                console.log(key, token.value);
            }
            else if (this.isToken(TokenType.START_ARRAY)) {
                map[key] = this.getArray();
            }
            if (this.isToken(TokenType.COMMA)) {
                // ,
                this.tokenizer.next();
                if (this.isToken(TokenType.STRING)) {
                    // recursive
                    map = this.getKeyOf(map);
                }
            }
            else if (this.isToken(TokenType.END_OBJ)) {
                // }
                this.tokenizer.next();
                return map;
            }
            else {
                throw new Error('Invalid JSON input.');
            }
        }
        return map;
    }
    isPrimary() {
        const type = this.tokenizer.peek(0).type;
        return type === TokenType.BOOLEAN ||
            type === TokenType.NULL ||
            type === TokenType.NUMBER ||
            type === TokenType.STRING;
    }
    parseAsPrimary(value) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        if (value === 'null') {
            return null;
        }
        const res = parseFloat(value);
        if (!Number.isNaN(res)) {
            return res;
        }
        return value;
    }
}
function parseJson(text) {
    const tokenizer = new Tokenizer(text);
    tokenizer.tokenize();
    const parser = new Parser(tokenizer);
    return parser.getObject();
}
exports.parseJson = parseJson;
//# sourceMappingURL=json-parser.js.map