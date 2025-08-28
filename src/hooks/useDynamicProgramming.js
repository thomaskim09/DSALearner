import { useState, useCallback } from 'react';

export const useDynamicProgramming = () => {
    const [history, setHistory] = useState([]);
    const [algorithm, setAlgorithm] = useState('binomial');

    const calculate = useCallback((algo, params) => {
        setAlgorithm(algo);
        let sortedHistory = [];
        if (algo === 'binomial') {
            sortedHistory = binomialCoefficient(params.n, params.r);
        } else if (algo === 'floydWarshall') {
            sortedHistory = floydWarshall();
        } else if (algo === 'binomialRecursive') {
            sortedHistory = binomialExpansionTrace(params.n, params.r);
        }
        setHistory(sortedHistory);
    }, []);

    return { history, calculate, algorithm };
};

function binomialCoefficient(n, r) {
    if (r < 0 || r > n) {
        return [{
            grid: [],
            message: "Invalid input: r must be between 0 and n."
        }];
    }

    const grid = Array(n + 1).fill(null).map((_, i) => Array(i + 1).fill(0));
    const history = [];

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (j === 0 || j === i) {
                grid[i][j] = 1;
            } else {
                if(grid[i-1] && grid[i-1][j-1] !== undefined && grid[i-1][j] !== undefined) {
                   grid[i][j] = grid[i - 1][j - 1] + grid[i - 1][j];
                } else {
                   grid[i][j] = 1;
                }
            }
        }
    }
    
    const finalValue = (grid[n] && grid[n][r] !== undefined) ? grid[n][r] : 'N/A';
    const message = `C(${n},${r}) = ${finalValue}`;
    history.push({
        grid: JSON.parse(JSON.stringify(grid)),
        message,
        highlights: { row: n, col: r }
    });

    return history;
}


function floydWarshall() {
    const INF = Infinity;
    const dist = [
        [0, 5, INF, INF],
        [50, 0, 15, 5],
        [30, INF, 0, 15],
        [15, INF, 5, 0]
    ];

    const n = dist.length;
    const history = [{
        dist: JSON.parse(JSON.stringify(dist)),
        message: 'Initial distance matrix (D0)'
    }];

    for (let k = 0; k < n; k++) {
        const newDist = JSON.parse(JSON.stringify(history[history.length - 1].dist));
        let changed = false;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (newDist[i][k] + newDist[k][j] < newDist[i][j]) {
                    newDist[i][j] = newDist[i][k] + newDist[k][j];
                    changed = true;
                }
            }
        }
        if(changed) {
            history.push({
                dist: newDist,
                message: `After considering vertex ${k+1} as an intermediate vertex (D${k+1})`
            });
        }
    }

    return history;
}

function binomialExpansionTrace(n, r) {
    if (r < 0 || r > n) return [];

    const history = [];
    let currentLevel = [{ type: 'term', n, r, highlight: true }];
    history.push(currentLevel);

    let hasTermsToExpend = true;
    while(hasTermsToExpend) {
        hasTermsToExpend = false;
        const nextLevel = [];
        let somethingChanged = false;

        currentLevel.forEach(term => {
            if (term.type === 'term') {
                if (term.r === 0 || term.n === term.r) {
                    nextLevel.push({ type: 'base', value: 1 });
                    somethingChanged = true;
                } else {
                    hasTermsToExpend = true;
                    nextLevel.push({ type: 'term', n: term.n - 1, r: term.r - 1, highlight: true });
                    nextLevel.push({ type: 'operator', value: '+' });
                    nextLevel.push({ type: 'term', n: term.n - 1, r: term.r, highlight: true });
                }
            } else {
                nextLevel.push({ ...term, highlight: false });
            }
        });

        if (somethingChanged || hasTermsToExpend) {
             history.push(nextLevel);
        }
        currentLevel = nextLevel;
    }

    // Final sum step
    const finalSum = history[history.length-1].reduce((acc, term) => {
        return term.type === 'base' ? acc + term.value : acc;
    }, 0);
    history.push([{ type: 'sum', value: finalSum }]);

    return history;
}