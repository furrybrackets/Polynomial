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
    
}

const P = new Parser('func(x,y,z)');

console.log(P.parse());