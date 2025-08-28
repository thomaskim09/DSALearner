import React from 'react';

const FloydWarshallVisualizer = ({ history }) => {
    if (!history || history.length === 0) {
        return <div className="visualizer-placeholder">Click "Run" to see the Floyd-Warshall algorithm in action.</div>;
    }

    const lastStep = history[history.length - 1];
    const { dist, message } = lastStep;
    const n = dist.length;

    return (
        <div className="visualizer-wrapper">
            {history.map((step, index) => (
                <div key={index} className="floyd-warshall-step">
                    <h4>{step.message}</h4>
                    <table className="sorting-table">
                        <thead>
                            <tr>
                                <th></th>
                                {Array.from({ length: n }, (_, i) => <th key={i}>{i + 1}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {step.dist.map((row, i) => (
                                <tr key={i}>
                                    <th>{i + 1}</th>
                                    {row.map((val, j) => (
                                        <td key={j}>{val === Infinity ? '∞' : val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default FloydWarshallVisualizer;