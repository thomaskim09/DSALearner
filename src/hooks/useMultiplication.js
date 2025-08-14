import { useState, useCallback } from 'react';

// A la Russe multiplication
function aLaRusse(num1Str, num2Str) {
    if (!num1Str || !num2Str) return { steps: [], result: '0', keptValues: [] };
    const steps = [];
    const keptValues = [];
    let n1 = BigInt(num1Str);
    let n2 = BigInt(num2Str);

    while (n1 >= 1n) {
        const isOdd = n1 % 2n === 1n;
        if (isOdd) {
            keptValues.push(n2.toString());
        }
        steps.push({
            left: n1.toString(),
            right: n2.toString(),
            isOdd,
        });
        n1 /= 2n;
        n2 *= 2n;
    }
    
    const finalResult = BigInt(num1Str) * BigInt(num2Str);
    return { steps, result: finalResult.toString(), keptValues };
}

// Divide and Conquer multiplication
function divideAndConquer(num1Str, num2Str) {
    if (!num1Str || !num2Str) return { steps: [], result: '0' };

    const memo = new Map();

    function multiply(xStr, yStr) {
        const key = `${xStr}|${yStr}`;
        if (memo.has(key)) return memo.get(key);

        const n = Math.max(xStr.length, yStr.length);

        if (n <= 4) { // Base case
            const res = BigInt(xStr) * BigInt(yStr);
            const baseStep = { result: res, subProblems: [], left: xStr, right: yStr, terms: [] }; // Ensure terms exists
            memo.set(key, baseStep);
            return baseStep;
        }

        const m = Math.floor(n / 2);

        const a = xStr.slice(0, -m) || '0';
        const b = xStr.slice(-m);
        const c = yStr.slice(0, -m) || '0';
        const d = yStr.slice(-m);

        const ac_res = multiply(a, c);
        const ad_res = multiply(a, d);
        const bc_res = multiply(b, c);
        const bd_res = multiply(b, d);
        
        const term1_ac = ac_res.result;
        const term2_ad = ad_res.result;
        const term3_bc = bc_res.result;
        const term4_bd = bd_res.result;

        const total = (term1_ac * (10n ** BigInt(2 * m))) + ((term2_ad + term3_bc) * (10n ** BigInt(m))) + term4_bd;

        const step = {
            left: xStr, right: yStr, result: total,
            subProblems: [
                { left: b, right: d, result: term4_bd },
                { left: a, right: d, result: term2_ad },
                { left: b, right: c, result: term3_bc },
                { left: a, right: c, result: term1_ac },
            ],
            terms: [
                { value: term4_bd, padding: 0 },
                { value: term2_ad, padding: m },
                { value: term3_bc, padding: m },
                { value: term1_ac, padding: 2 * m },
            ]
        };
        memo.set(key, step);
        return step;
    }
    
    const root = multiply(num1Str, num2Str);
    
    const steps = [];
    const q = [root];
    const seen = new Set();
    while (q.length > 0) {
        const curr = q.shift();
        if (!curr) continue; 
        const currentKey = `${curr.left}|${curr.right}`;
        if (seen.has(currentKey)) continue;
        seen.add(currentKey);

        if (curr.subProblems && curr.subProblems.length > 0) {
            steps.push({
                ...curr,
                result: curr.result.toString(),
                subProblems: curr.subProblems.map(sp => ({...sp, result: sp.result.toString()})),
                terms: curr.terms.map(t => ({...t, value: t.value.toString()}))
            });
            for (const sp of curr.subProblems) {
                const subproblemKey = `${sp.left}|${sp.right}`;
                if (memo.has(subproblemKey)) q.push(memo.get(subproblemKey));
            }
        }
    }
    // Reverse the steps for a bottom-up display flow
    return { steps: steps.reverse(), result: root.result.toString() };
}

export const useMultiplication = () => {
    const [history, setHistory] = useState(null);

    const calculate = useCallback((num1, num2, type) => {
        let result;
        if (type === 'aLaRusse') {
            result = aLaRusse(num1, num2);
        } else {
            result = divideAndConquer(num1, num2);
        }
        setHistory(result);
    }, []);

    return { history, calculate, setHistory };
};