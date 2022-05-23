const Fraction = require('fraction.js');

// converts every element of an array to a Fraction class
function Complicate(array) {
    return array.map(function(element) {
        return new Fraction(element);
    });
};

function Normalize(array) {
    return array.map(function(element) {
        return Number(element.toString());
    });
};


class Polynomial {
    constructor(coefficients, remainder) {
        if (remainder) {
            this.remainder = {
                // get the remainder of the polynomial when divided by another polynomial
                n: new Fraction(0),
                d: new Polynomial("0", false),
                isActive: false,
                stringify() {
                    if (this.isActive) {
                        return `${this.n.toString()}/${this.d.toString()}`;
                    } else {
                        return '';
                    }
                }
            }
        };
        // check if coefficients are an array or an object and not a string
        if (typeof coefficients == 'object' && Object.prototype.toString.call(coefficients) !== "[object String]") {
            if (coefficients.length > 0) {
            this.coefficients = Complicate(coefficients);
            } else {
               // check for key pair like:
               // {1: 2, 4: 6} and convert into standard array  
                let maxKey = 0;
                for (let key in coefficients) {
                    if (key > maxKey) {
                        maxKey = key;
                    }
                };
                let array = [];
                for (let i = 0; i<=maxKey; i++) {
                    array.push(0);
                }
                for (let key in coefficients) {
                    array[maxKey-key] = coefficients[key];
                };
                this.coefficients = Complicate(array);
            };
            return;
        } else {
            
           // get an array of coefficients from string (e.g. "x^2+2x-3")
            const ExpArr = coefficients.replace(/\s+/g, '').match(/[+-]?[^+-]+/g);


            let array = [];
            for (let i = 0; i<ExpArr.length; i++) {
                // split each term into coefficient and exponent
                let [coeff, pow] = ExpArr[i].split('x');
                if (coeff == "-") {
                    coeff = "-1";
                } else if (coeff == "+") {
                    coeff = "1";
                    // check if coefficient is a fraction
                } else if (coeff.includes('/')) {
                    coeff = coeff.split('/');
                    if (coeff.length > 2) {
                        throw new Error('Invalid fraction! Fractions should be a/b, not' + coeff);
                    };
                }
                array.push([new Fraction(coeff || 1), new Fraction(this.parsePow(pow))]);
        };


        // convert 2d array into 1d array
        
        // find highest order
        let maxOrder = 0;
        for (let i = 0; i<array.length; i++) {
            if (array[i][1] > maxOrder) {
                maxOrder = array[i][1];
            }
        };

        // create 1d array with zeros
        let array1d = [];
        for (let i = 0; i<=maxOrder; i++) {
            array1d.push(0);
        };
        // fill 1d array with coefficients
        for (let i = 0; i<array.length; i++) {
            array1d[maxOrder-array[i][1]] += array[i][0];
        };

        this.coefficients = Complicate(array1d);
    };
};

    // Evaluate the polynomial at x using Horner's method (https://en.wikipedia.org/wiki/Horner%27s_method)
    eval(x, isFrac) {
        let remainder = Fraction(0);
        for (let i = 0; i<this.coefficients.length; i++) {
            remainder = remainder.mul(x).add(this.coefficients[i]);
        };
        if (isFrac) {
            return remainder.toFraction(true);
        }
        return remainder.toString();
    };

    parsePow(pow) {
        switch (pow) {
            case undefined:
                return 0;
            case '':
                return 1;
            default:
                return Number(pow.replace('^', ''));
        }
    };

    add(polynomial) {
        let poly;
        if (!(polynomial instanceof Polynomial)) {
            poly = new Polynomial(polynomial);
        } else {
            poly = polynomial;
        };

        let tempCoeff = this.coefficients;

        // add coefficients of both polynomials
        let max = Math.max(this.coefficients.length, poly.coefficients.length);
        let array = [];
        // match up coefficients
        for (let i = 0; i<max; i++) {
            if (this.coefficients[i] == undefined) {
                tempCoeff.unshift(Fraction(0));
            } else if (poly.coefficients[i] == undefined) {
                poly.coefficients.unshift(Fraction(0));
            };
        };
        for (let i = 0; i<max; i++) {
            array.push(tempCoeff[i].add(poly.coefficients[i]));
        };

        // remove leading zeros
        while (array[0] == Fraction(0)) {
            array.shift();
        };
        this.coefficients = Complicate(array);

        return this;
    };

    toString() {
        let string = '';
        const order = this.coefficients.length-1;
        for (let i = order; i>=0; i--) {
            if (this.coefficients[order-i] != 0) {
                if (this.coefficients[order-i] > 0 && i != order) {
                    string += '+';
                }
                if (this.coefficients[order-i] == -1) {

                    if (i == 0) {
                        string += '-1';
                    } else if (i == 1) {
                        string += '-' + 'x';
                    } else {
                        string += '-' + 'x^' + i;
                    }
                } else if (this.coefficients[order-i] == 1) {
                    if (i == 0) {
                        string += '1';
                    } else if (i == 1) {
                        string += 'x';
                    } else {
                        string += 'x^' + i;
                    }
                } else {
                if (i == 0) {
                    string += this.coefficients[order-i].toFraction(true);
                } else if (i == 1) {
                    string += this.coefficients[order-i].toFraction(true) + 'x';
                } else {
                    string += this.coefficients[order-i].toFraction(true) + 'x^' + i;
                }
            }
        }
        };

        if (string == '') {
            string = '0';
        };

        return string;
    };

    sub(polynomial) {
        let poly;
        if (!(polynomial instanceof Polynomial)) {
            poly = new Polynomial(polynomial);
        } else {
            poly = polynomial;
        };

        let tempCoeff = this.coefficients;

        // add coefficients of both polynomials
        let max = Math.max(this.coefficients.length, poly.coefficients.length);
        let array = [];
        // match up coefficients
        for (let i = 0; i<max; i++) {
            if (this.coefficients[i] == undefined) {
                tempCoeff.unshift(Fraction(0));
            } else if (poly.coefficients[i] == undefined) {
                poly.coefficients.unshift(Fraction(0));
            };
        };
        for (let i = 0; i<max; i++) {
            array.push(tempCoeff[i].sub(poly.coefficients[i]));
        };

        // remove leading zeros
        while (array[0] == 0) {
            array.shift();
        };
        this.coefficients = Complicate(array);

        return this;
    };

    mul(polynomial) {
        // check for instance of polynomial
        let poly;
        if (!(polynomial instanceof Polynomial)) {
            poly = new Polynomial(polynomial);
        } else {
            poly = polynomial;
        };

        let tempCoeff = this.coefficients;
        let array = [];

        // multiply polynomials via distributive property (a*(b+c) = ab+ac)
        for (let i = 0; i<this.coefficients.length; i++) {
            for (let j = 0; j<poly.coefficients.length; j++) {
                if (array[i+j] == undefined) {
                    array[i+j] = Fraction(0);
                };
                array[i+j] = array[i+j].add(tempCoeff[i].mul(poly.coefficients[j]));
            };
        };

        // remove leading zeros
        while (array[0] == 0) {
            array.shift();
        };
        this.coefficients = Complicate(array);

        return this;
    }

    gen(func) {
        return func(this.coefficients);
    };

    deriv() {
        let array = this.coefficients.reverse();

        // apply derivative rule, remove constant term
        array.shift();


        // x^n -> nx^(n-1)
        for (let i = 0; i<array.length; i++) {
            array[i] = array[i].mul(i+1);
        };

        this.coefficients = Complicate(array.reverse());

        return this;
    };

    integral() {
        let array = this.coefficients.reverse();

        // apply integral rule x^n = x^n+1/(n+1)
        
        // fix coefficients
        for (let i = 0; i<array.length; i++) {
            array[i] = array[i].div(i+1);
        };

        // add constant term of 0
        array.unshift(Fraction(0));

        array.reverse();

        // remove leading zeros
        while (array[0] == 0) {
            array.shift();
        };

        this.coefficients = Complicate(array);

        return this;
    };

    derivN(n) {
        for (let i = 0; i<n; i++) {
            this.deriv();
        };
        return this;
    };

    intergralN(n) {
        for (let i = 0; i<n; i++) {
            this.integral();
        };
        return this;
    };

    div(polynomial) {
         return this;
    };

    getCoefficients() {
        return Normalize(this.coefficients);
    }
};

module.exports = {
    Polynomial: Polynomial
};