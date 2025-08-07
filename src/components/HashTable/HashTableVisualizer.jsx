import React from 'react';

const HashTableVisualizer = ({ table, animationStep, strategy }) => {
    return (
        <div className="hash-table-visualizer">
            <div className="hash-table-array">
                {/* Ensure table is always an array before mapping */}
                {Array.isArray(table) && table.map((entry, index) => {
                    // This is the key fix: Ensure `entry` is an array when using separate chaining
                    const chain = strategy === 'separate-chaining' && Array.isArray(entry) ? entry : [];

                    return (
                        <div
                            key={index}
                            className={`hash-table-cell ${animationStep?.index === index ? 'highlight' : ''}`}
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
            {animationStep && (
                <div className="animation-message hash-message">
                    {animationStep.message}
                </div>
            )}
        </div>
    );
};

export default HashTableVisualizer;