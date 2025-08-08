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
                                    {entry.map((node, nodeIndex) => (
                                        <React.Fragment key={node.key}>
                                            <div className="chain-node">{node.key}</div>
                                            {nodeIndex < entry.length - 1 && <div className="chain-arrow">→</div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                renderCellContent(entry)
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {currentAnimation && (
                <div className="animation-footer">
                    <div className="animation-message">{currentAnimation.message}</div>
                </div>
            )}
        </div>
    );
};

export default HashTableVisualizer;