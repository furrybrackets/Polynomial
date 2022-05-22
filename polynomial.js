const { e } = require("mathjs");

class Polynomial {
    constructor(coefficients) {
        // check if coefficients are an array or an object and not a string
        if (typeof coefficients == 'object' && Object.prototype.toString.call(coefficients) !== "[object String]") {
            if (coefficients.length > 0) {
            this.coefficients = coefficients;
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
                this.coefficients = array;
            }
        } else {
           // get an array of coefficients from string (e.g. "x^2+2x-3")
                const ExpArr = coefficients.replace(/\s+/g, '').match(/[+-]?[^+-]+/g);

                console.log(ExpArr);
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
                    const [num, den] = coeff.split('/');
                    coeff = num/den;
                }
                array.push([Number(coeff || 1), this.parsePow(pow)]);
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

        this.coefficients = array1d;
    }
    };

    // Evaluate the polynomial at x using Horner's method (https://en.wikipedia.org/wiki/Horner%27s_method)
    eval(x) {
        let remainder = 0;
        for (let i = 0; i<this.coefficients.length; i++) {
            remainder = remainder*x+this.coefficients[i];
        };
        return remainder;
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
                tempCoeff.unshift(0);
            } else if (poly.coefficients[i] == undefined) {
                poly.coefficients.unshift(0);
            };
        };
        for (let i = 0; i<max; i++) {
            array.push(tempCoeff[i]+poly.coefficients[i]);
        };

        // remove leading zeros
        while (array[0] == 0) {
            array.shift();
        };
        this.coefficients = array;

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
                    string += this.coefficients[order-i];
                } else if (i == 1) {
                    string += this.coefficients[order-i] + 'x';
                } else {
                    string += this.coefficients[order-i] + 'x^' + i;
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
                tempCoeff.unshift(0);
            } else if (poly.coefficients[i] == undefined) {
                poly.coefficients.unshift(0);
            };
        };
        for (let i = 0; i<max; i++) {
            array.push(tempCoeff[i]-poly.coefficients[i]);
        };

        // remove leading zeros
        while (array[0] == 0) {
            array.shift();
        };
        this.coefficients = array;

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
                    array[i+j] = 0;
                };
                array[i+j] += tempCoeff[i]*poly.coefficients[j];
            };
        };

        // remove leading zeros
        while (array[0] == 0) {
            array.shift();
        };
        this.coefficients = array;

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
            array[i] *= i+1;
        };

        this.coefficients = array.reverse();

        return this;
    };
};

module.exports = {
    Polynomial: Polynomial
};