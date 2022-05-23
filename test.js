const Polynomial = require('./polynomial').Polynomial;

const p = new Polynomial("6x^2+3x-2", false);

console.log(p.mul("6x").toString());