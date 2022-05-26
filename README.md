# Polynomial.js

A simple project I'm working on.

## Features

* Multiplication, Addition, Subtraction, ~~Division~~.
* Fractions
* Calculus: Integration, Differentiation
* String Parsing
* Custom Transformations via the `gen()` method

## Installation

### Yarn

```sh
yarn add polynomials
```

### NPM

```sh
npm install polynomials
```

## Usage

Polynomials is pure-JS, so you can use it in the browser. (I'm working on TypeScript definitions.)

```js
const Polynomial = require('polynomials');

// Create a polynomial

const a = new Polynomial([1, 2, 3]); // array, highest power to lowest
const b = new Polynomial({0: 3, 1: 2, 2: 1}); // order: coefficient
const c = new Polynomial("x^2+2x+3"); // string

// Arithmetic without remainder (addition, subtraction, multiplication)

a.add(b).toString() // 2x^2+4x+6

a.mul(b).toString() // 2x^4+8x^3+20x^2+24x+18

// b = c, so b-c=0
c.sub(b).toString() // 0

// Calculus
const d = new Polynomial("x^2+2x");

// since all operations are self mutating, we can chain them. (will add non-mutating methods later)
d.integral().toString() // 1/3x^3+x^2

const e = new Polynomial("x^2+2x");
e.deriv().toString() // 2x+2

// ... and more!
```

### `Polynomial.gen()` demo

```js
import { Polynomial } from 'polynomials';

const p = new Polynomial("x^2+6x+2", false);

p.gen((coefficients) => {
  coefficients.map((t) => {
    t^2;
  });
});

console.log(t.toString()); // x^2+36x+4
```
