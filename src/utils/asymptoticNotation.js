// DSALearner_packaged/src/utils/asymptoticNotation.js
// Utilities for parsing, simplifying, and classifying asymptotic growth of t(n)
const MULTIPLY_SIGNS = /[×·]/g;

export function analyzeAsymptotic(inputRaw) {
    const steps = [];
    if (!inputRaw || typeof inputRaw !== 'string') {
        return {
            ok: false,
            error: 'Please enter a function like t(n)=3n^2 + 5nlog(n) + 2^n.',
        };
    }

    steps.push(`Original input: ${sanitizeForMarkdown(inputRaw)}`);

    const exprString = stripFunctionLhs(inputRaw);
    if (exprString !== inputRaw) {
        steps.push(`After stripping t(n)=: ${sanitizeForMarkdown(exprString)}`);
    }

    const input = normalizeInput(exprString);
    steps.push(`After normalization: ${sanitizeForMarkdown(input)}`);

    let tokens;
    try {
        tokens = tokenize(input);
    } catch (e) {
        return { ok: false, error: 'Tokenization error: ' + e.message };
    }

    let ast;
    try {
        ast = parseExpressionFromTokens(tokens);
    } catch (e) {
        return { ok: false, error: 'Parse error: ' + e.message };
    }

    const expanded = expandAstToTerms(ast);

    if (expanded.length > 20) { // Increased limit slightly
        return { ok: false, error: 'Too many terms after expansion (more than 20). Please simplify the input.' };
    }

    const simplified = expanded.map(simplifyTermProduct);
    const simplifiedTermStrings = simplified.map(formatCanonicalTerm);
    steps.push('Simplified terms:');
    simplifiedTermStrings.forEach((s, i) => steps.push(`  ${i + 1}. ${s}`));

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

function normalizeSuperscripts(s) {
    const map = {
        '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n',
    };
    return s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ]/g, (ch) => map[ch] || ch);
}

export function normalizeInput(s) {
    if (!s || typeof s !== 'string') return '';
    let out = s.trim();

    // Step 1: Pre-processing and token separation
    out = out.replace(/\s*x\s*/gi, '*');
    out = out.replace(MULTIPLY_SIGNS, '*');
    out = normalizeSuperscripts(out);
    out = out.replace(/([*+^()/-])/g, ' $1 ');
    out = out.replace(/(\d)([a-zA-Z])/g, '$1 $2');
    out = out.replace(/([a-zA-Z])(\d)/g, '$1 $2');

    // Step 2: Normalize shorthands on spaced tokens
    out = out.replace(/\s+/g, ' ').trim();
    
    // This regex order is important
    out = out.replace(/\b(logn) (\d+)\b/g, '( log ( n ) ) ^ $2');
    out = out.replace(/\b(n) (\d+)\b/g, 'n ^ $2');
    out = out.replace(/\b(log) (\d+)\b/g, 'log_$2');
    out = out.replace(/\b(ln)\b/g, 'log_e');
    out = out.replace(/\b(logn)\b/g, 'log ( n )');

    // Additional robust handling for log terms:
    //  - "log n" => "log ( n )"
    //  - "log^k n" => "( log ( n ) ) ^ k"
    //  - "log n^k" => "( log ( n ) ) ^ k" (interpreted as (log n)^k which is common in CS notation)
    //  - Same for log bases like log_2 and log_e
    // Work on a token/spaces aware string created above.
    // 2.1 log^k n  (covers log_2^k n and log_e^k n too)
    out = out.replace(/\b(log(?:_[a-zA-Z0-9]+)?)\s*\^\s*(\d+)\s*n\b/g, '( $1 ( n ) ) ^ $2');
    // 2.2 log n^k  (covers log_2 n^k and log_e n^k)
    out = out.replace(/\b(log(?:_[a-zA-Z0-9]+)?)\s*n\s*\^\s*(\d+)\b/g, '( $1 ( n ) ) ^ $2');
    // 2.3 plain "log n" (or with base)
    out = out.replace(/\b(log(?:_[a-zA-Z0-9]+)?)\s+n\b/g, '$1 ( n )');
    
    out = out.replace(/\s+/g, ' ').trim();

    // Step 3: Insert implicit multiplication and finalize
    const parts = out.split(' ');
    const newParts = [];
    for (let i = 0; i < parts.length; i++) {
        const current = parts[i];
        if (current) { newParts.push(current); }
        if (i < parts.length - 1) {
            const next = parts[i + 1];
            if (!current || !next) continue;
            const isCurrentFactor = !['+', '-', '*', '/', '^', '('].includes(current);
            const isNextFactor = !['+', '-', '*', '/', '^', ')'].includes(next);
            if (isCurrentFactor && isNextFactor) { newParts.push('*'); }
        }
    }
    out = newParts.join('');
    out = out.replace(/\*\*+/g, '*');

    return out;
}

export function stripFunctionLhs(s) {
    const m = s.match(/^[tT]\s*\(\s*[nN]\s*\)\s*=\s*(.*)$/);
    return m ? m[1].trim() : s;
}

// Tokenizer (no changes needed from original)
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
    return tokens;
}


// --- The rest of the file remains the same ---
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
        if (isLogNode(baseNode) && baseNode.arg.kind === 'pow' && isNumberNode(baseNode.arg.base)) {
            const a = baseNode.arg.base.value;
            const x = baseNode.arg.exp;
            multiplyCoefficient(Math.log(a) / Math.log(baseNode.base));
            applyFactor(x);
            return;
        }
        if (isNumberNode(expNode)) {
            const simplifiedBase = simplifySingleFactor(baseNode);
            if (!simplifiedBase.valid) { term.valid = false; return; }
            term.coefficient *= simplifiedBase.coefficient;
            term.nExponent += simplifiedBase.nExponent * expNode.value;
            term.logExponent += simplifiedBase.logExponent * expNode.value;
            if (simplifiedBase.exponential) {
                addExponential(Math.pow(simplifiedBase.exponential.base, simplifiedBase.exponential.nMultiplier), expNode.value);
            }
            return;
        }
        term.valid = false;
    }

    function addExponential(base, nMultiplier) {
        if (!term.exponential) {
            term.exponential = { base, nMultiplier };
            return;
        }
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
                const base = node.base;
                const arg = node.arg;
                if (arg.kind === 'pow' && arg.base.kind === 'n' && isNumberNode(arg.exp)) {
                    multiplyCoefficient(arg.exp.value);
                    target.logExponent += 1;
                } else if (arg.kind === 'pow' && isNumberNode(arg.base)) {
                    const c = Math.log(arg.base.value) / Math.log(base);
                    multiplyCoefficient(c);
                    applyFactor(arg.exp);
                } else if (arg.kind === 'n') {
                    target.logExponent += 1;
                } else {
                    target.logExponent += 1;
                }
                break;
            }
            case 'add':
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
    if (parts.length === 0 && t.coefficient === 1) return '1';
    if (parts.length === 0) return `${formatNumber(t.coefficient)}`;
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
    let best = null;
    let why = '';
    for (const t of terms) {
        if (!t.valid) continue;
        if (!best) { best = t; continue; }
        const cmp = compareTerms(t, best);
        if (cmp > 0) best = t;
    }

    if (!best) {
        return { dominant: { ...makeCanonical(), valid: false }, reason: 'Could not determine dominant term from invalid terms.'}
    }

    if (best.exponential) {
        const eff = Math.pow(best.exponential.base, best.exponential.nMultiplier);
        why = `exponential growth with effective base ${formatNumber(eff)} per n dominates polynomial/logarithmic terms`;
    } else {
        why = `higher exponents dominate: n^${formatNumber(best.nExponent)} then (log n)^${formatNumber(best.logExponent)}`;
    }
    return { dominant: best, reason: why };
}

function compareTerms(a, b) {
    const aExp = a.exponential ? Math.pow(a.exponential.base, a.exponential.nMultiplier) : 1;
    const bExp = b.exponential ? Math.pow(b.exponential.base, b.exponential.nMultiplier) : 1;
    if (aExp > 1 && bExp === 1) return 1;
    if (bExp > 1 && aExp === 1) return -1;
    if (aExp !== bExp) return aExp > bExp ? 1 : -1;
    
    if (a.nExponent !== b.nExponent) return a.nExponent > b.nExponent ? 1 : -1;
    if (a.logExponent !== b.logExponent) return a.logExponent > b.logExponent ? 1 : -1;
    return 0;
}
