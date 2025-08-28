import React from 'react';

const DynamicProgrammingCodeDisplay = ({ algorithm, visualizationType }) => {
    const snippets = {
        binomial: {
            name: 'Binomial Coefficient (Dynamic Programming)',
            code: `int binomialCoeff(int n, int r) {
    int C[][] = new int[n + 1][r + 1];
    int i, j;

    // Calculate value of Binomial Coefficient in bottom up manner
    for (i = 0; i <= n; i++) {
        for (j = 0; j <= Math.min(i, r); j++) {
            // Base Cases
            if (j == 0 || j == i)
                C[i][j] = 1;
            // Calculate value using previously stored values
            else
                C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
        }
    }
    return C[n][r];
}`
        },
        binomialRecursive: {
            name: 'Binomial Coefficient (Recursion)',
            code: `int C(int n, int r) {
    if (r == 0 || n == r)
        return 1;
    else
        return C(n - 1, r - 1) + C(n - 1, r);
}`
        },
        floydWarshall: {
            name: 'Floyd-Warshall Algorithm',
            code: `void floydWarshall(int dist[][]) {
    int i, j, k;
    int V = dist.length;

    for (k = 0; k < V; k++) {
        for (i = 0; i < V; i++) {
            for (j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
}`
        }
    };

    const info = snippets[algorithm] || snippets.binomial;

    if (visualizationType === 'recursive' && algorithm.startsWith('binomial')) {
        return (
             <div className="code-display-sort formula-display">
                <h3>Binomial Coefficient Formula</h3>
                <div className="formula-item">
                    <span>C(n,r) = 1</span>
                    <span>if r = 0 or r = n</span>
                </div>
                <div className="formula-item">
                    <span>C(n,r) = C(n-1,r-1) + C(n-1,r)</span>
                     <span>if 0 &lt; r &lt; n</span>
                </div>
                 <div className="formula-item">
                    <span>C(n,r) = 0</span>
                    <span>otherwise</span>
                </div>
            </div>
        )
    }

    return (
        <div className="code-display-sort">
            <h3>{info.name}</h3>
            <pre><code>{info.code}</code></pre>
        </div>
    );
};

export default DynamicProgrammingCodeDisplay;