const token = require('./tokenize');
const Scanner = token.Scanner;
const Tokens = token.Tokens;
const END = Tokens.END;
const ast = require('./ast');
const { Binary, Unary, ConstantLiteral, Paren,  VariableLiteral, FunctionLiteral } = ast;

// Parser Class
class Parser {
    constructor(input) {
        this.tokens = new Scanner(input).scan();
        this.index = 0;
        this.ast = [];
        this.stack = [];
    };

    // peek on the next token
    peek() {
        return this.tokens[this.index + 1];
    };

    // get the next token
    advance() {
        this.index++;
    };

    // current
    current() {
        return this.tokens[this.index];
    };

    // parse expression and then return the ast
    parse() {
        while (this.current().type !== END) {
            console.log(`current token: [${this.current().type}, ${this.current().value}]`);
            const expr = this.add();
            this.ast.push(expr);
        }
        return this.ast;
    };

    // PEMDAS
    /* 
    Creates an AST with the following precedence:
    0. unary operators
    1. function calls
    2. parentheses
    3. exponentiation
    4. multiplication and division
    5. addition and subtraction
    */
    add() {
        const node = this.multiply();
        while (this.current().type === Tokens.PLUS || this.current().type === Tokens.MINUS) {
            const operator = this.current().type;
            this.advance();
            const right = this.multiply();
            node.right = right;
            node.operator = operator;
        }
        return node;
    };

    // PEMDAS
    /* 
    Creates an AST with the following precedence:
    0. unary operators
    1. function calls
    2. parentheses
    3. exponentiation
    4. multiplication and division
    5. addition and subtraction
    */
    multiply() {
        const node = this.unary();
        while (this.current().type === Tokens.STAR || this.current().type === Tokens.SLASH) {
            const operator = this.current().type;
            this.advance();
            const right = this.unary();
            node.right = right;
            node.operator = operator;
        }
        return node;
    };

    // PEMDAS
    /* 
    Creates an AST with the following precedence:
    0. unary operators
    1. function calls
    2. parentheses
    3. exponentiation
    4. multiplication and division
    5. addition and subtraction
    */
    unary() {
        if (this.current().type === Tokens.MINUS || this.current().type === Tokens.PLUS) {
            const operator = this.current().type;
            this.advance();
            const right = this.unary();
            return new Unary(operator, right);
        }
        return this.call() || this.primary();
    };

    // PEMDAS
    /* 
    Creates an AST with the following precedence:
    0. unary operators
    1. function calls
    2. parentheses
    3. exponentiation
    4. multiplication and division
    5. addition and subtraction
    */
    call() {
        const node = new FunctionLiteral();
        node.name = this.current().value;
        this.advance();
        if (this.current().type === Tokens.LPAREN) {
            this.advance();
            if (this.current().type !== Tokens.RPAREN) {
                node.args = this.arguments();
            }
            this.consume(Tokens.RPAREN, "Expect ')' after arguments.");
        }
        return node;
    };

    args() {
        const args = [];
        if (this.current().type !== Tokens.RPAREN) {
            args.push(this.expression());
            while (this.current().type === Tokens.COMMA) {
                this.advance();
                args.push(this.expression());
            }
        }
        return args;
    };

    // PEMDAS
    /* 
    Creates an AST with the following precedence:
    0. unary operators
    1. function calls
    2. parentheses
    3. exponentiation
    4. multiplication and division
    5. addition and subtraction
    */
    primary() {
        if (this.current().type === Tokens.LPAREN) {
            this.advance();
            const node = this.expression();
            this.consume(Tokens.RPAREN, "Expect ')' after expression.");
            return node;
        } else if (this.current().type === Tokens.NUMBER) {
            return new ConstantLiteral(parseFloat(this.current().value));
        } else if (this.current().type === Tokens.VARIABLE) {
            return new VariableLiteral(this.current().value);
        } else if (this.current().type === Tokens.STRING) {
            return new ConstantLiteral(this.current().value);
        } else {
            this.error(`Unexpected token ${this.current()}`);
        }
    };

    consume(type, message) {
        if (this.current().type === type) {
            this.advance();
            return true;
        } else {
            this.error(message);
        }
    };

    error(message) {
        throw message;
    };
}

const P = new Parser('func(x,y,z)');

console.log(P.parse());