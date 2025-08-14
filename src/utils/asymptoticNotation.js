// Utilities for parsing, simplifying, and classifying asymptotic growth of t(n)
// Supported constructs:
// - Numbers: 2, 10, 1000
// - Variable: n
// - Powers: n^k, 2^n, (expr)^k
// - Multiplication: *, ×, implicit (e.g., 2n, nlog(n))
// - Addition/Subtraction: +, -
// - Parentheses: ( ... )
// - Logarithms: log(n), log_2(n), log2(n), ln(n), log_b(n^k), log_b(b^x)
// - Up to 10 top-level additive terms (after expansion)

const MULTIPLY_SIGNS = /[×·]/g;

export function analyzeAsymptotic(inputRaw) {
    const steps = [];
    if (!inputRaw || typeof inputRaw !== 'string') {
        return {
            ok: false,
            error: 'Please enter a function like t(n)=3n^2 + 5nlog(n) + 2^n.',
        };
    }

    const input = normalizeInput(inputRaw);
    steps.push(`Original input: ${sanitizeForMarkdown(inputRaw)}`);

    // Strip optional leading t(n)=
    const exprString = stripFunctionLhs(input);

    let tokens;
    try {
        tokens = tokenize(exprString);
    } catch (e) {
        return { ok: false, error: 'Tokenization error: ' + e.message };
    }

    let ast;
    try {
        ast = parseExpressionFromTokens(tokens);
    } catch (e) {
        return { ok: false, error: 'Parse error: ' + e.message };
    }

    // Expand to a flat sum of term products
    const expanded = expandAstToTerms(ast);

    if (expanded.length > 10) {
        return { ok: false, error: 'Too many terms after expansion (more than 10). Please simplify the input.' };
    }

    // Simplify each term into canonical growth components
    const simplified = expanded.map(simplifyTermProduct);

    const simplifiedTermStrings = simplified.map(formatCanonicalTerm);
    steps.push('Simplified terms:');
    simplifiedTermStrings.forEach((s, i) => steps.push(`  ${i + 1}. ${s}`));

    // Determine dominant term
    const { dominant, reason } = pickDominantTerm(simplified);
    steps.push(`Dominant term: ${formatCanonicalTerm(dominant)}${reason ? ` — ${reason}` : ''}`);

    const bigO = formatBigO(dominant);
    steps.push(`Final Big O: ${bigO}`);

    return {
        ok: true,
        steps,
        bigO,
        simplifiedTerms: simplifiedTermStrings,
        dominant: formatCanonicalTerm(dominant),
    };
}

function sanitizeForMarkdown(s) {
    return String(s).replace(/\*/g, '\\*').replace(/_/g, '\\_');
}

export function normalizeInput(s) {
    if (!s) return '';
    let out = s.trim();
    
    // Convert "n" followed by a number to "n^number"
    out = out.replace(/n(\d+)/g, 'n^$1');

    // Treat 'x' as a multiplication sign
    out = out.replace(/(\d+)\s*x\s*(\d+)/g, '$1*$2');
    out = out.replace(/(\d+)\s*x\s*n/g, '$1*n');
    out = out.replace(/n\s*x\s*(\d+)/g, 'n*$1');
    
    out = out.replace(MULTIPLY_SIGNS, '*');
    out = normalizeSuperscripts(out);

    // Insert implicit multiplication before log, n, or parens
    out = out.replace(/(\d+|n|\))([a-zA-Z(])/g, '$1*$2');

    out = out.replace(/\s+/g, '');
    out = out.replace(/log(\d+)\(/g, 'log_$1(');
    out = out.replace(/\bln\(/g, 'log_e(');
    out = out.replace(/\*\*+/g, '*');
    return out;
}

function normalizeSuperscripts(s) {
    // Handle common superscript digits and n
    const map = {
        '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
        'ⁿ': 'n',
    };
    return s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]/g, (ch) => map[ch] || ch)
        .replace(/\)\s*\^\s*\(/g, ')^(');
}

function stripFunctionLhs(s) {
    const m = s.match(/^t\s*\(\s*n\s*\)\s*=\s*(.*)$/i);
    return m ? m[1] : s;
}

// Tokenizer
function tokenize(s) {
    const tokens = [];
    let i = 0;
    const push = (type, value = null) => tokens.push({ type, value });
    while (i < s.length) {
        const ch = s[i];
        if (/[0-9]/.test(ch)) {
            let j = i + 1;
            while (j < s.length && /[0-9.]/.test(s[j])) j++;
            push('number', parseFloat(s.slice(i, j)));
            i = j;
            continue;
        }
        if (/[a-zA-Z_]/.test(ch)) {
            let j = i + 1;
            while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j++;
            const ident = s.slice(i, j);
            if (ident === 'log' || ident.startsWith('log_') || ident === 'log_e') {
                push('log', ident);
            } else if (ident === 'n') {
                push('n');
            } else if (ident === 'e') {
                // Euler's number as constant
                push('number', Math.E);
            } else {
                throw new Error(`Unknown identifier: ${ident}`);
            }
            i = j;
            continue;
        }
        if (ch === '+') { push('plus'); i++; continue; }
        if (ch === '-') { push('minus'); i++; continue; }
        if (ch === '*') { push('mul'); i++; continue; }
        if (ch === '^') { push('pow'); i++; continue; }
        if (ch === '(') { push('lparen'); i++; continue; }
        if (ch === ')') { push('rparen'); i++; continue; }
        throw new Error(`Unexpected character: ${ch}`);
    }
    // Insert implicit multiplications: number n, n log, ) n, ) log, n n (rare), number ( ...
    const withImplicit = [];
    for (let k = 0; k < tokens.length; k++) {
        withImplicit.push(tokens[k]);
        if (k < tokens.length - 1) {
            const a = tokens[k], b = tokens[k + 1];
            const aType = a.type, bType = b.type;
            const implicit = (
                (aType === 'number' && (bType === 'n' || bType === 'log' || bType === 'lparen')) ||
                (aType === 'n' && (bType === 'n' || bType === 'log' || bType === 'lparen' || bType === 'number')) ||
                (aType === 'rparen' && (bType === 'n' || bType === 'log' || bType === 'lparen' || bType === 'number')) ||
                (aType === 'log' && (bType === 'n' || bType === 'log' || bType === 'lparen' || bType === 'number'))
            );
            if (implicit) withImplicit.push({ type: 'mul' });
        }
    }
    return withImplicit;
}

// Parser (recursive descent)
function parseExpressionFromTokens(tokens) {
    let idx = 0;
    function peek() { return tokens[idx]; }
    function consume(type) {
        const t = tokens[idx];
        if (!t || t.type !== type) throw new Error(`Expected ${type}`);
        idx++;
        return t;
    }
    function tryConsume(type) { if (peek() && peek().type === type) { idx++; return true; } return false; }

    function parsePrimary() {
        const t = peek();
        if (!t) throw new Error('Unexpected end');
        if (t.type === 'number') { idx++; return { kind: 'number', value: t.value }; }
        if (t.type === 'n') { idx++; return { kind: 'n' }; }
        if (t.type === 'lparen') {
            consume('lparen');
            const e = parseExpr();
            consume('rparen');
            return e;
        }
        if (t.type === 'log') {
            idx++;
            const base = parseLogBase(t.value);
            consume('lparen');
            const arg = parseExpr();
            consume('rparen');
            return { kind: 'log', base, arg };
        }
        throw new Error(`Unexpected token: ${t.type}`);
    }

    function parsePower() {
        let left = parsePrimary();
        if (tryConsume('pow')) {
            const right = parsePower(); // right-assoc
            return { kind: 'pow', base: left, exp: right };
        }
        return left;
    }

    function parseTerm() {
        let node = parsePower();
        while (peek() && (peek().type === 'mul')) {
            consume('mul');
            const rhs = parsePower();
            node = { kind: 'mul', left: node, right: rhs };
        }
        return node;
    }

    function parseExpr() {
        let node = parseTerm();
        while (peek() && (peek().type === 'plus' || peek().type === 'minus')) {
            if (tryConsume('plus')) {
                const rhs = parseTerm();
                node = { kind: 'add', left: node, right: rhs };
            } else if (tryConsume('minus')) {
                const rhs = parseTerm();
                node = { kind: 'add', left: node, right: { kind: 'mul', left: { kind: 'number', value: -1 }, right: rhs } };
            }
        }
        return node;
    }

    const root = parseExpr();
    if (idx !== tokens.length) throw new Error('Unexpected trailing tokens');
    return root;
}

function parseLogBase(ident) {
    if (ident === 'log' || ident === 'log_e') return ident === 'log' ? Math.E : Math.E;
    if (ident.startsWith('log_')) {
        const base = ident.slice(4);
        if (base === 'e') return Math.E;
        const val = parseFloat(base);
        if (!isFinite(val) || val <= 0 || val === 1) return Math.E; // treat invalid as natural log
        return val;
    }
    return Math.E;
}

// Expand AST into sum of products (array of arrays of factors)
function expandAstToTerms(ast) {
    // Returns array of FactorNodes[] where a FactorNode is AST node for multiplication
    function expand(node) {
        if (node.kind === 'add') {
            return [...expand(node.left), ...expand(node.right)];
        }
        if (node.kind === 'mul') {
            const leftTerms = expand(node.left);
            const rightTerms = expand(node.right);
            const result = [];
            for (const lt of leftTerms) {
                for (const rt of rightTerms) {
                    result.push([...lt, ...rt]);
                }
            }
            return result;
        }
        return [[node]]; // single-factor term
    }
    return expand(ast);
}

// Canonical term representation
function makeCanonical() {
    return {
        coefficient: 1,
        nExponent: 0,
        logExponent: 0,
        exponential: null, // { base: number, nMultiplier: number } means (base^(nMultiplier*n))
        valid: true,
        notes: [],
    };
}

function simplifyTermProduct(factors) {
    const term = makeCanonical();

    function multiplyCoefficient(x) {
        if (!isFinite(x)) { term.valid = false; return; }
        term.coefficient *= x;
    }

    function handlePower(baseNode, expNode) {
        // Cases: n^k, const^n, (const)^const etc.
        if (baseNode.kind === 'n' && isNumberNode(expNode)) {
            term.nExponent += expNode.value;
            return;
        }
        if (isNumberNode(baseNode) && isVariableN(expNode)) {
            const base = baseNode.value;
            if (base <= 0) { term.valid = false; return; }
            addExponential(base, 1);
            return;
        }
        if (isNumberNode(baseNode) && isMulOfNumberAndN(expNode)) {
            const { factor } = extractNumberTimesN(expNode);
            const base = baseNode.value;
            if (base <= 0) { term.valid = false; return; }
            addExponential(base, factor);
            return;
        }
        // log simplifications: log_b(a^x) = x*log_b(a)
        if (isLogNode(baseNode) && baseNode.arg.kind === 'pow' && isNumberNode(baseNode.arg.base)) {
            const a = baseNode.arg.base.value;
            const x = baseNode.arg.exp;
            // log_b(a^x) => x * log_b(a)
            multiplyCoefficient(Math.log(a) / Math.log(baseNode.base));
            applyFactor(x);
            return;
        }
        // Fallback: if exponent is number -> evaluate base growth approximately if possible
        if (isNumberNode(expNode)) {
            // (anything)^constant — treat via multiplication of log/power where possible
            const simplifiedBase = simplifySingleFactor(baseNode);
            if (!simplifiedBase.valid) { term.valid = false; return; }
            // Multiply base simplified exp times
            term.coefficient *= simplifiedBase.coefficient;
            term.nExponent += simplifiedBase.nExponent * expNode.value;
            term.logExponent += simplifiedBase.logExponent * expNode.value;
            if (simplifiedBase.exponential) {
                addExponential(Math.pow(simplifiedBase.exponential.base, simplifiedBase.exponential.nMultiplier), expNode.value);
            }
            return;
        }
        // If base is number and exponent is log(n) like k*log(n): base^{k*log(n)} = n^{k*log_base(e)} but this is advanced; skip for now
        term.valid = false;
    }

    function addExponential(base, nMultiplier) {
        if (!term.exponential) {
            term.exponential = { base, nMultiplier };
            return;
        }
        // Combine: (a^{k1 n})*(b^{k2 n}) = (a^{k1} * b^{k2})^{n}
        const effectiveBase = Math.pow(term.exponential.base, term.exponential.nMultiplier) * Math.pow(base, nMultiplier);
        term.exponential = { base: effectiveBase, nMultiplier: 1 };
    }

    function isNumberNode(node) { return node && node.kind === 'number'; }
    function isVariableN(node) { return node && node.kind === 'n'; }
    function isLogNode(node) { return node && node.kind === 'log'; }
    function isMulOfNumberAndN(node) {
        if (!node || node.kind !== 'mul') return false;
        const leftNum = isNumberNode(node.left) && isVariableN(node.right);
        const rightNum = isNumberNode(node.right) && isVariableN(node.left);
        return leftNum || rightNum;
    }
    function extractNumberTimesN(node) {
        if (isNumberNode(node.left) && isVariableN(node.right)) return { factor: node.left.value };
        if (isNumberNode(node.right) && isVariableN(node.left)) return { factor: node.right.value };
        return { factor: NaN };
    }

    function simplifySingleFactor(node) {
        const single = makeCanonical();
        applyFactorTo(single, node);
        return single;
    }

    function applyFactor(node) {
        applyFactorTo(term, node);
    }

    function applyFactorTo(target, node) {
        if (!target.valid) return;
        switch (node.kind) {
            case 'number':
                multiplyCoefficient(node.value);
                break;
            case 'n':
                target.nExponent += 1;
                break;
            case 'mul':
                applyFactor(node.left);
                applyFactor(node.right);
                break;
            case 'pow':
                handlePower(node.base, node.exp);
                break;
            case 'log': {
                // Simplify common forms: log_b(n^k) = k*log_b(n); log_b(b^x) = x
                const base = node.base;
                const arg = node.arg;
                if (arg.kind === 'pow' && arg.base.kind === 'n' && isNumberNode(arg.exp)) {
                    // k * log_b(n)
                    multiplyCoefficient(arg.exp.value);
                    target.logExponent += 1;
                } else if (arg.kind === 'pow' && isNumberNode(arg.base)) {
                    // log_b(a^x) = x * log_b(a) -> constant * x
                    const c = Math.log(arg.base.value) / Math.log(base);
                    multiplyCoefficient(c);
                    applyFactor(arg.exp);
                } else if (arg.kind === 'n') {
                    target.logExponent += 1;
                } else {
                    // log of something else: treat as O(log n) if arg grows with n, otherwise constant
                    // Very conservative: assume log(arg) contributes at most log n
                    target.logExponent += 1;
                }
                break;
            }
            case 'add':
                // Should not happen inside a factor in product because we expand first
                target.valid = false;
                break;
            default:
                target.valid = false;
        }
    }

    for (const f of factors) {
        if (!term.valid) break;
        applyFactor(f);
    }

    return term;
}

function formatCanonicalTerm(t) {
    if (!t.valid) return 'Unsupported term';
    const parts = [];
    if (t.coefficient !== 1) parts.push(`${formatNumber(t.coefficient)}`);
    if (t.exponential) {
        if (t.exponential.nMultiplier === 1) parts.push(`${formatNumber(t.exponential.base)}^n`);
        else parts.push(`${formatNumber(t.exponential.base)}^(${formatNumber(t.exponential.nMultiplier)}n)`);
    }
    if (t.nExponent !== 0) parts.push(`n${formatPower(t.nExponent)}`);
    if (t.logExponent !== 0) parts.push(`(log n)${formatPower(t.logExponent)}`);
    if (parts.length === 0) return '1';
    return parts.join(' * ');
}

function formatBigO(t) {
    if (!t.valid) return 'O(unsupported)';
    const parts = [];
    if (t.exponential) {
        const baseEff = t.exponential.nMultiplier === 1
            ? `${formatNumber(t.exponential.base)}^n`
            : `${formatNumber(t.exponential.base)}^(${formatNumber(t.exponential.nMultiplier)}n)`;
        parts.push(baseEff);
    }
    if (t.nExponent !== 0) parts.push(`n${formatPower(t.nExponent)}`);
    if (t.logExponent !== 0) parts.push(`(log n)${formatPower(t.logExponent)}`);
    if (parts.length === 0) return 'O(1)';
    return `O(${parts.join(' ')})`;
}

function formatPower(p) {
    if (p === 1) return '';
    return `^${Number.isInteger(p) ? p : formatNumber(p)}`;
}

function formatNumber(x) {
    if (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-4) return x.toExponential(2);
    return Number.parseFloat(x.toFixed(6)).toString();
}

function pickDominantTerm(terms) {
    if (terms.length === 0) return { dominant: makeCanonical(), reason: '' };
    // Compare terms with the following precedence:
    // 1) Exponential with base^(k n) dominates non-exponential. Among exponentials, compare base^k.
    // 2) Higher n exponent dominates.
    // 3) Higher log exponent dominates.
    let best = null;
    let why = '';
    for (const t of terms) {
        if (!best) { best = t; continue; }
        const cmp = compareTerms(t, best);
        if (cmp > 0) best = t;
    }
    // Reasoning
    if (best.exponential) {
        const eff = Math.pow(best.exponential.base, best.exponential.nMultiplier);
        why = `exponential growth with effective base ${formatNumber(eff)} per n dominates polynomial/logarithmic terms`;
    } else {
        why = `higher exponents dominate: n^${formatNumber(best.nExponent)} then (log n)^${formatNumber(best.logExponent)}`;
    }
    return { dominant: best, reason: why };
}

function compareTerms(a, b) {
    // return positive if a > b
    const aExp = a.exponential ? Math.pow(a.exponential.base, a.exponential.nMultiplier) : 1;
    const bExp = b.exponential ? Math.pow(b.exponential.base, b.exponential.nMultiplier) : 1;
    if (aExp !== bExp) return aExp > bExp ? 1 : -1;
    if (!!a.exponential !== !!b.exponential) return a.exponential ? 1 : -1;
    if (a.nExponent !== b.nExponent) return a.nExponent > b.nExponent ? 1 : -1;
    if (a.logExponent !== b.logExponent) return a.logExponent > b.logExponent ? 1 : -1;
    // Coefficients ignored in Big O
    return 0;
}