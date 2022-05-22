// ast.js

class Binary {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    };
};

class Unary {
    constructor(operator, argument) {
        this.operator = operator;
        this.argument = argument;
    };
};

class ConstantLiteral {
    constructor(value) {
        this.value = value;
    };
}

class VariableLiteral {
    constructor(name) {
        this.name = name;
    };
};

class Paren {
    constructor(expression) {
        this.expression = expression;
    };
};

class FunctionLiteral {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    };
};

module.exports = {
    Binary: Binary,
    Unary: Unary,
    ConstantLiteral: ConstantLiteral,
    Paren: Paren,
    VariableLiteral: VariableLiteral,
    FunctionLiteral: FunctionLiteral
};