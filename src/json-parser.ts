enum TokenType {
    START_OBJ,
    END_OBJ,
    START_ARRAY,
    END_ARRAY,
    NULL,
    NUMBER,
    STRING,
    BOOLEAN,
    COLON,
    COMMA,
    END_DOC
}

class Token {
    constructor(
        public readonly type: TokenType,
        public readonly value: string | null
    ) {}
}

class Tokenizer {
    textIndex = 0;
    tokens: Token[] = [];



    constructor(public readonly text: string) {
    }

    tokenize() {
        let token: Token | null = null;

        do {
            token = this.start();
            this.tokens.push(token);
        } while (token.type !== TokenType.END_DOC);

    }

    start() {
        this.textIndex = 0;

        let cursor = '';
        do {
            cursor = this.read();
        } while (this.isSpace(cursor));

        if (this.isNull(cursor)) {
            return new Token(TokenType.NULL, null);
        } else if (cursor === ',') {
            return new Token(TokenType.COMMA, ',');
        } else if (cursor === ':') {
            return new Token(TokenType.COLON, ':');
        } else if (cursor === '{') {
            return new Token(TokenType.START_OBJ, '{');
        } else if (cursor === '}') {
            return new Token(TokenType.END_OBJ, '}');
        } else if (cursor === '[') {
            return new Token(TokenType.START_ARRAY, '[');
        } else if (cursor === ']') {
            return new Token(TokenType.END_ARRAY, ']');
        } else if (this.isTrue(cursor)) {
            return new Token(TokenType.BOOLEAN, 'true');
        } else if (this.isFalse(cursor)) {
            return new Token(TokenType.BOOLEAN, 'false');
        } else if (cursor === '"') {
            cursor = this.read();
            let redString = '';
            while (cursor !== '"') {
                redString += cursor;
                cursor = this.read();
            }
            return new Token(TokenType.STRING, redString);
        } else if (this.isNum(cursor)) {
            this.unread();
            return this.readNum();
        } else if (cursor === '') {
            return new Token(TokenType.END_DOC, 'EOF');
        } else {
            throw new Error('Invalid JSON input.');
        }
    }

    read() {
        return this.text.charAt(this.textIndex ++);
    }

    unread() {
        this.textIndex--;
    }
    
    next() {
        return this.text.charAt(this.textIndex ++);
    }


    isSpace(cursor: string) {
        return cursor === ' ';
    }

    isNull(cursor: string) {
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

    isTrue(cursor: string) {
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

    isFalse(cursor: string) {
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

    isNum(cursor: string) {
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
    
    peek(index: number) {
        return this.tokens[index];
    }

}


class Parser {
    constructor(private tokenizer: Tokenizer) {}

    object() {
        this.tokenizer.next();
        const map: {[p in string]: any } = {};
        if (this.isToken(TokenType.END_OBJ)) {
            this.tokenizer.next();
        } else if (this.isToken(TokenType.STRING)) {
            map = this.getKeyOf(map);
        }
        return map;
    }

    array() {
        this.tokenizer.next();
        let list: any[] = [];
        let myArr: any[] = [];
        if (this.isToken(TokenType.START_ARRAY)) {
            myArr = this.array();
            list.push(myArr);
            if (this.isToken(TokenType.COMMA)) {
                this.tokenizer.next();
                list = this.element(list);
            }
        } else if (this.isPrimary()) {
            list = this.element(list);
        } else if (this.isToken(TokenType.COMMA)) {
            list.push(this.object());
            while (this.isToken(TokenType.COMMA)) {
                this.tokenizer.next();
                list.push(this.object());
            }
        } else if (this.isToken(TokenType.END_ARRAY)) {
            this.tokenizer.next();
            myArr = [...list];
            return myArr;
        }
        this.tokenizer.next();
        myArr = [...list];
        return myArr;
    }

    element() {

    }

    isToken(type: TokenType): boolean {
        
    }

    getKeyOf(map: {[p in string]: any }) {
        
    }

    isPrimary() {
        return 
    }
}
