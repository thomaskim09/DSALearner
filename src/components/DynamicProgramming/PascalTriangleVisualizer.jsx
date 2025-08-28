import React from 'react';

const getTerm = (coeff, n, k) => {
    if (coeff === 0) return '';
    if (n === 0) return '1';
    
    let term = '';

    if (coeff > 1) {
        term += coeff;
    }
    
    const xPower = n - k;
    const yPower = k;

    if (xPower > 0) {
        term += `x${xPower > 1 ? `^${xPower}` : ''}`;
    }
    if (yPower > 0) {
        term += `y${yPower > 1 ? `^${yPower}` : ''}`;
    }
    
    return term;
}


const BinomialExpansion = ({ n, row }) => {
    if (n < 0 || !row) return null;
    let expansion = row.map((coeff, k) => getTerm(coeff, n, k)).filter(Boolean).join(' + ');
    
    return <div className="equation-line">{`(x + y)^${n} = ${expansion}`}</div>;
}


const PascalTriangleVisualizer = ({ history }) => {
    if (!history || history.length === 0 || !history[history.length-1].grid) {
        return <div className="visualizer-placeholder">Enter n and r and click "Calculate".</div>;
    }

    const { grid, message, highlights } = history[history.length - 1];

    return (
        <div className="pascal-visualizer-container">
            <div className="pascal-equations">
                <h3>Binomial Expansions</h3>
                 {grid.map((row, i) => (
                    <BinomialExpansion key={i} n={i} row={row} />
                ))}
            </div>
            <div className="pascal-triangle-container">
                <h3>Pascal's Triangle</h3>
                {grid.map((row, i) => (
                    <div className="pascal-row" key={i}>
                        {row.map((val, j) => (
                            <div
                                key={j}
                                className={`pascal-cell ${i === highlights.row && j === highlights.col ? 'highlight-cell' : ''}`}
                            >
                                {val > 0 ? val : ''}
                            </div>
                        ))}
                    </div>
                ))}
                 <div className="visualizer-status-message">{message}</div>
            </div>
        </div>
    );
};

export default PascalTriangleVisualizer;