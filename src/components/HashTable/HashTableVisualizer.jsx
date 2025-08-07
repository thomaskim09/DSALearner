import React from 'react';

const HashTableVisualizer = ({ table, animationSteps, currentStep, strategy }) => {
    const currentAnimation = animationSteps[currentStep];

    return (
        <div className="hash-table-visualizer">
            <div className="hash-table-array">
                {Array.isArray(table) && table.map((entry, index) => {
                    const chain = strategy === 'separate-chaining' && Array.isArray(entry) ? entry : [];
                    return (
                        <div
                            key={index}
                            className={`hash-table-cell ${currentAnimation?.index === index ? 'highlight' : ''}`}
                        >
                            <div className="cell-index">{index}</div>
                            <div className="cell-content">
                                {strategy === 'separate-chaining' ? (
                                    <div className="chain-list">
                                        {chain.map((node, nodeIndex) => (
                                            <React.Fragment key={nodeIndex}>
                                                <div className="chain-node">{node}</div>
                                                {nodeIndex < chain.length - 1 && <div className="chain-arrow">→</div>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`cell-value ${entry === null ? 'empty' : ''}`}>
                                        {entry !== null ? entry : 'empty'}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
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