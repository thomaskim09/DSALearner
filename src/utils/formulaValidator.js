/**
 * Validates a user-provided hash formula.
 *
 * @param {string} formula The formula string to validate.
 * @returns {boolean} True if the formula is syntactically valid and safe, false otherwise.
 */
export const isHash2FormulaValid = (formula) => {
    if (typeof formula !== 'string' || formula.trim() === '') {
        return false;
    }

    // 1. Replace known variables with placeholder values for a syntax check.
    // This allows us to test the structure without needing actual key/prime values.
    const testExpression = formula
        .replace(/\bkey\b/g, '1')
        .replace(/\bprime\b/g, '1');

    // 2. Check for invalid characters. Only allow numbers, operators, parentheses, and whitespace.
    // This is a security measure to prevent injection of arbitrary code.
    const allowedCharsRegex = /^[0-9+\-*/%().\s]+$/;
    if (!allowedCharsRegex.test(testExpression)) {
        return false;
    }

    // 3. Perform a syntax check using the Function constructor in a try-catch block.
    // This is safer than a direct eval() because the code is not executed in the current scope.
    // If the syntax is invalid, the constructor will throw an error.
    try {
        new Function(`return ${testExpression}`);
        return true;
    } catch (error) {
        return false;
    }
};