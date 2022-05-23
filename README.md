# Polynomial.js

A simple project I'm working on.

## Features

* Multiplication, Addition, Subtraction, ~~Division~~.
* Fractions
* Calculus: Integration, Differentiation
* String Parsing
* Custom Transformations via the `gen()` method

### `Polynomial.gen()` demo

```js
import { Polynomial } from 'poly.js';

const p = new Polynomial("x^2+6x+2", false);

p.gen((coefficients) => {
  coefficients.map((t) => {
    t^2;
  });
});

console.log(t.toString()); // x^2+36x+4
```
