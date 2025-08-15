import React, { useState, useEffect } from 'react';

const AdvancedSortVisualizer = ({ history, sortType }) => {
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
            <div className="sort-tables-container">
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
                                    const { highlights } = step;

                                    if (highlights.sorted) {
                                        classNames += ' sorted-bubble';
                                    } else if (sortType === 'shell' && highlights.gap) {
                                        if (cellIndex % highlights.gap === (passIndex % highlights.gap)) {
                                        classNames += ' highlight-shell-gap';
                                        }
                                    }  else if (sortType === 'quick') {
                                        if (Array.isArray(highlights.sortedIndices) && highlights.sortedIndices.includes(cellIndex)) {
                                            classNames += ' sorted-bubble';
                                        }
                                        if (highlights.newlySortedIndex === cellIndex) {
                                            classNames += ' highlight-new-sorted';
                                        }
                                        if (cellIndex === highlights.pivot) {
                                            classNames += ' highlight-pivot';
                                        }
                                        if (cellIndex === highlights.leftPtr) classNames += ' highlight-left-ptr';
                                        if (cellIndex === highlights.rightPtr) classNames += ' highlight-right-ptr';
                                        if (highlights.swapping?.includes(cellIndex)) classNames += ' highlight-swap';
                                    }
                                    
                                    return <td key={cellIndex} className={classNames}>{value}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {sortType === 'quick' && (
                    <table className="pivot-table">
                        <thead>
                            <tr><th>Pivot</th></tr>
                        </thead>
                        <tbody onMouseLeave={() => setActiveMessage(finalMessage)}>
                            {history.map((step, passIndex) => (
                                <tr key={passIndex} onMouseEnter={() => setActiveMessage(step.message)}>
                                    <td className="pivot-cell">
                                        {step.highlights.pivotValue !== undefined ? step.highlights.pivotValue : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            <div className="visualizer-status-message">
                {activeMessage}
            </div>
        </div>
    );
};

export default AdvancedSortVisualizer;