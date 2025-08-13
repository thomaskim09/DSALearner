import React from 'react';

const HashTableVisualizer = ({ table, animationSteps, currentStep, strategy }) => {
    const currentAnimation = animationSteps[currentStep];

    const renderCellContent = (entry) => {
        if (entry === null) return <div className="cell-value empty">empty</div>;
        if (entry.isDeleted) return <div className="cell-value deleted">deleted</div>;
        return <div className="cell-value">{entry.key}</div>;
    };

    return (
        <div className="hash-table-visualizer">
            <h3 className="visualizer-header">Hash Table</h3>
            <div className="hash-table-array">
                {Array.isArray(table) && table.map((entry, index) => (
                    <div
                        key={index}
                        className={`hash-table-cell ${currentAnimation?.index === index ? 'highlight' : ''}`}
                    >
                        <div className="cell-index">{index}</div>
                        <div className="cell-content">
                            {strategy === 'separate-chaining' ? (
                                <div className="chain-list">
                                    {(!Array.isArray(entry) || entry.length === 0) ? (
                                        <div className="cell-value empty">empty</div>
                                    ) : (
                                        entry.map((node, nodeIndex) => (
                                            <React.Fragment key={`${node.key}-${nodeIndex}`}>
                                                <div className="chain-node">{node.key}</div>
                                                {nodeIndex < entry.length - 1 && <div className="chain-arrow">-&gt;</div>}
                                            </React.Fragment>
                                        ))
                                    )}
                                </div>
                            ) : (
                                renderCellContent(entry)
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HashTableVisualizer;