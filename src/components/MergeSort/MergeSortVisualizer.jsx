import React, { useState, useEffect } from 'react';

const MergeSortVisualizer = ({ history }) => {
    const [activeMessage, setActiveMessage] = useState('');

    useEffect(() => {
        if (history && history.length > 0) {
            setActiveMessage(history[history.length - 1].message);
        } else {
            setActiveMessage('');
        }
    }, [history]);

    if (!history || history.length === 0) {
        return <div className="visualizer-placeholder">Click "Sort" to begin visualization.</div>;
    }

    const finalMessage = history.length > 0 ? history[history.length - 1].message : 'Hover over a pass to see details.';

    return (
        <div className="visualizer-wrapper">
            <table className="sorting-table">
                <thead>
                    <tr>
                        <th>Pass</th>
                        {history[0].array.map((_, index) => (
                            <th key={index}>{index}</th>
                        ))}
                    </tr>
                </thead>
                <tbody onMouseLeave={() => setActiveMessage(finalMessage)}>
                    {history.map((step, passIndex) => (
                        <tr key={passIndex} onMouseEnter={() => setActiveMessage(step.message)}>
                            <td>{passIndex}</td>
                            {step.array.map((value, cellIndex) => {
                                let classNames = 'cell';
                                const { mergedRange, sorted } = step.highlights;

                                if (sorted) {
                                    classNames += ' sorted-bubble'; // Green background for the final sorted array
                                } else if (mergedRange && cellIndex >= mergedRange[0] && cellIndex <= mergedRange[1]) {
                                    classNames += ' sorted-insertion-section'; // Blueish background for the merged range
                                }

                                if (step.highlights.singleHighlight === cellIndex) {
                                    classNames += ' highlight-third'; // You can style this in CSS
                                }
                                
                                return <td key={cellIndex} className={classNames}>{value}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="visualizer-status-message">
                {activeMessage}
            </div>
        </div>
    );
};

export default MergeSortVisualizer;