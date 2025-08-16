import React, { useState, useEffect } from 'react';

const AdvancedSortVisualizer = ({ history, sortType }) => {
    const [activeMessage, setActiveMessage] = useState('');
    const [hoveredCell, setHoveredCell] = useState({ passIndex: -1, cellIndex: -1 });

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

    const handleMouseOver = (passIndex, cellIndex) => {
        setHoveredCell({ passIndex, cellIndex });
    };

    const handleMouseOut = () => {
        setHoveredCell({ passIndex: -1, cellIndex: -1 });
    };

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
                    <tbody onMouseLeave={() => { setActiveMessage(finalMessage); handleMouseOut(); }}>
                        {history.map((step, passIndex) => (
                            <tr key={passIndex} onMouseEnter={() => setActiveMessage(step.message)}>
                                <td>{step.highlights.gap ? `h=${step.highlights.gap}` : passIndex}</td>
                                {step.array.map((value, cellIndex) => {
                                    let classNames = 'cell';
                                    const { highlights } = step;

                                    if (sortType === 'shell' && highlights.gap) {
                                        const isHovered = hoveredCell.passIndex === passIndex && hoveredCell.cellIndex === cellIndex;
                                        const isCompared = hoveredCell.passIndex === passIndex && (
                                            hoveredCell.cellIndex - highlights.gap === cellIndex ||
                                            hoveredCell.cellIndex + highlights.gap === cellIndex
                                        );
                                        
                                        // Prioritize hover effect
                                        if (isHovered || isCompared) {
                                            classNames += ' highlight-shell-gap';
                                        } else if (highlights.changedIndices?.includes(cellIndex)) {
                                            classNames += ' highlight-changed';
                                        }

                                    } else if (sortType === 'quick') {
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
                                    
                                    return (
                                        <td 
                                            key={cellIndex} 
                                            className={classNames}
                                            onMouseOver={() => handleMouseOver(passIndex, cellIndex)}
                                            onMouseOut={handleMouseOut}
                                        >
                                            {value}
                                        </td>
                                    );
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