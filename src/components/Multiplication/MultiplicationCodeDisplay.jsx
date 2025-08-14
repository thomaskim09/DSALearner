import React from 'react';

const MultiplicationCodeDisplay = ({ algoType }) => {
    const snippets = {
        aLaRusse: {
            name: 'À La Russe Multiplication',
            code: `function aLaRusse(a, b) {
    let result = 0;
    while (a > 0) {
        // If 'a' is odd, add 'b' to the result
        if (a % 2 !== 0) {
            result = result + b;
        }
        // Halve 'a' and double 'b'
        a = Math.floor(a / 2);
        b = b * 2;
    }
    return result;
}`
        },
        divideAndConquer: {
            name: 'Divide and Conquer Multiplication',
            code: `// Based on Karatsuba's algorithm
function multiply(x, y) {
    // n = number of digits in the larger number
    const n = Math.max(String(x).length, String(y).length);

    // Base case for recursion
    if (n < 2) {
        return x * y;
    }

    // Split numbers into two halves
    const m = Math.floor(n / 2);
    const high1 = Math.floor(x / 10**m);
    const low1 = x % 10**m;
    const high2 = Math.floor(y / 10**m);
    const low2 = y % 10**m;
    
    // Recursive calls for the subproblems
    const z0 = multiply(low1, low2);
    const z1 = multiply((low1 + high1), (low2 + high2));
    const z2 = multiply(high1, high2);

    // Combine results using the formula
    // (z2 * 10^(2*m)) + ((z1 - z2 - z0) * 10^m) + z0
    return (z2 * 10**(2*m)) + ((z1 - z2 - z0) * 10**m) + z0;
}`
        }
    };

    const info = snippets[algoType];

    return (
        <div className="code-display-sort">
            <h3>{info.name}</h3>
            <pre><code>{info.code}</code></pre>
        </div>
    );
};

export default MultiplicationCodeDisplay;