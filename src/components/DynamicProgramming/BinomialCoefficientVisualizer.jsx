import React from 'react';

const BinomialCoefficientVisualizer = ({ history, n, r }) => {
    if (!history || history.length === 0 || !history[history.length-1].grid) {
        return <div className="visualizer-placeholder">Enter n and r and click "Calculate".</div>;
    }

    const lastStep = history[history.length - 1];
    const { grid, message } = lastStep;

    return (
        <div className="visualizer-wrapper">
            <table className="sorting-table">
                <thead>
                    <tr>
                        <th>n/r</th>
                        {Array.from({ length: n + 1 }, (_, index) => <th key={index}>{index}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <th>{rowIndex}</th>
                            {Array.from({ length: n + 1 }, (_, colIndex) => (
                                <td key={colIndex} className={lastStep.highlights.row === rowIndex && lastStep.highlights.col === colIndex ? 'sorted-bubble' : ''}>
                                    {row[colIndex] || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="visualizer-status-message">
                {message}
            </div>
        </div>
    );
};

export default BinomialCoefficientVisualizer;