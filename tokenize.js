const END = '-1';

// Tokens used in polynomials
const tokens = {
    // Single-character tokens.
    LEFT_PAREN: '(',
    RIGHT_PAREN: ')',
    VAR: 'VAR',
    PLUS: '+',
    MINUS: '-',
    MUL: '*',
    DIV: '/',
    EXP: '^',
    COMPLEX: 'i',
    // Multi-character tokens.
    NUMBER: 'NUMBER',
    NAME: 'NAME',
    END: 'END',
    COMMA: ',',
};

class Scanner {
    constructor(input) {
        this.input = input;
        this.pos = 0;
        this.char = this.input[this.pos];
        // list of tokens
        this.stream = [];
    };

    next() {
        if (this.pos == this.input.length-1) {
            this.char = END;
        } else {
            this.pos++;
            this.char = this.input[this.pos];
        }
    };

    peek() {
        return this.input[this.pos + 1] || END;
    };

    isDigit(char) {
        return /\d/.test(char) && char != END;
    };

    isAlpha(char) {
        return /[a-z]/i.test(char) && char != END;
    };

    genToken(type, value) {
        return {
            type: type,
            value: value
        };
    };

    getNumber() {
        let number = '';
        while (this.isDigit(this.char)) {
            number += this.char;
            this.next();
        }
        return this.genToken(tokens.NUMBER, Number(number));
    };

    getFunction() {
        let name = '';
        while (this.isAlpha(this.char)) {
            name += this.char;
            this.next();
        }
        return this.genToken(tokens.NAME, name);
    };

    // actual scanner
    scan() {
        while (this.char !== END) {
            let token;
            if (this.isDigit(this.char)) {
                token = this.getNumber();
            }
            else if (this.isAlpha(this.char)) {
                // check if it is a single-letter name or multi-letter
                if (this.isAlpha(this.peek())) {
                    token = this.getFunction();
                } else {
                    token = this.genToken(tokens.VAR, this.char);
                    this.next();
                }
            } else {
                switch (this.char) {
                    case '+':
                        token = this.genToken(tokens.PLUS, '+');
                        break;
                    case '-':
                        token = this.genToken(tokens.MINUS, '-');
                        break;
                    case '*':
                        token = this.genToken(tokens.MUL, '*');
                        break;
                    case '/':
                        token = this.genToken(tokens.DIV, '/');
                        break;
                    case '^':
                        token = this.genToken(tokens.EXP, '^');
                        break;
                    case '(':
                        token = this.genToken(tokens.LEFT_PAREN, '(');
                        break;
                    case ')':
                        token = this.genToken(tokens.RIGHT_PAREN, ')');
                        break;
                    case 'i':
                        token = this.genToken(tokens.COMPLEX, 'i');
                        break;
                    case ',':
                        token = this.genToken(tokens.COMMA, ',');
                        break;
                    default:
                        throw new Error('Unexpected character: ' + this.char);
                        break;
                };
                this.next();
            }
        this.stream.push(token);
    }
        this.stream.push(this.genToken(tokens.END, END));
        return this.stream;
    };
};

module.exports = {
    Scanner: Scanner,
    Tokens: tokens,
    END: END
};