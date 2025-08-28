import React from 'react';

const BinomialCoefficientRecursiveVisualizer = ({ history }) => {
    if (!history || history.length === 0) {
        return <div className="visualizer-placeholder">Enter n and r and click "Calculate".</div>;
    }

    const formatTerm = (term) => {
        if (term.type === 'term') return `C(${term.n},${term.r})`;
        return term.value;
    }

    return (
        <div className="binomial-recursive-visualizer">
            {history.map((level, index) => (
                <div key={index} className="recursion-equation-line">
                    {index > 0 && <span>= </span>}
                    {Array.isArray(level) && level.map((term, i) => (
                        <span key={i} className={`recursion-term ${term.type} ${term.highlight ? 'highlight' : ''}`}>
                            {formatTerm(term)}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BinomialCoefficientRecursiveVisualizer;