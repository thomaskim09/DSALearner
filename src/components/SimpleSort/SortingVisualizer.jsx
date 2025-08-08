import React, { useState, useEffect } from 'react';

const SortingVisualizer = ({ history, sortType }) => {
    const [activeMessage, setActiveMessage] = useState('');

    useEffect(() => {
        // When the history prop changes (a new sort starts),
        // set the default message to the message from the final step.
        if (history && history.length > 0) {
            setActiveMessage(history[history.length - 1].message);
        } else {
            setActiveMessage('');
        }
    }, [history]);

    if (!history || history.length === 0) {
        return <div className="visualizer-placeholder">Click "Sort" to begin visualization.</div>;
    }

    // This will be the message displayed when not hovering over a specific row.
    const finalMessage = history.length > 0 ? history[history.length - 1].message : 'Hover over a pass to see details.';

    return (
        <div className="visualizer-wrapper">
            <table className="sorting-table">
                <thead>
                    <tr>
                        <th>No</th>
                        {history[0].array.map((_, index) => (
                            <th key={index}>{index}</th>
                        ))}
                    </tr>
                </thead>
                <tbody onMouseLeave={() => setActiveMessage(finalMessage)}>
                    {history.map((step, passIndex) => {
                        const { array, highlights, message } = step;
                        return (
                            <tr key={passIndex} onMouseEnter={() => setActiveMessage(message)}>
                                <td>{passIndex}</td>
                                {array.map((value, cellIndex) => {
                                    let classNames = 'cell';
                                    
                                    if (sortType === 'bubble' && highlights.sortedStartIndex !== undefined && cellIndex >= highlights.sortedStartIndex) {
                                        classNames += ' sorted-bubble';
                                    } else if (sortType === 'selection' && highlights.sortedEndIndex !== undefined && cellIndex <= highlights.sortedEndIndex) {
                                        classNames += ' sorted-selection';
                                    } else if (sortType === 'insertion' && highlights.sortedEndIndex !== undefined && cellIndex <= highlights.sortedEndIndex) {
                                        classNames += ' sorted-insertion-section';
                                    }
                                    
                                    if (sortType === 'selection') {
                                        if (cellIndex === highlights.minInPass) classNames += ' action-min-found';
                                        if (cellIndex === highlights.swappedFrom) classNames += ' action-swap-target';
                                    }
                                    if (sortType === 'insertion' && cellIndex === highlights.insertedIndex) {
                                        classNames += ' action-inserted';
                                    }

                                    return <td key={cellIndex} className={classNames}>{value}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="visualizer-status-message">
                {activeMessage}
            </div>
        </div>
    );
};

export default SortingVisualizer;