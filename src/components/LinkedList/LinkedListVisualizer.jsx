import React, { useState, useEffect } from 'react';

const LinkedListVisualizer = ({ head, animationSteps, onAnimationComplete, listType }) => {
    const [nodes, setNodes] = useState([]);
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [message, setMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let current = head;
        const newNodes = [];
        while (current) {
            newNodes.push({ id: current.id, value: current.value });
            current = current.next;
        }
        setNodes(newNodes);
    }, [head]);

    useEffect(() => {
        if (animationSteps && animationSteps.length > 0) {
            setIsPlaying(true);
            let stepIndex = 0;

            const processStep = () => {
                if (stepIndex >= animationSteps.length) {
                    setIsPlaying(false);
                    setHighlightedNodeId(null);
                    setMessage('');
                    if (onAnimationComplete) {
                        setTimeout(onAnimationComplete, 500);
                    }
                    return;
                }

                const step = animationSteps[stepIndex];
                setMessage(step.message || '');

                if (step.type === 'highlight' || step.type === 'found' || step.type === 'delete') {
                    setHighlightedNodeId(step.nodeId);
                } else {
                    setHighlightedNodeId(null);
                }
                
                stepIndex++;
                setTimeout(processStep, 1000); // 1 second per step
            };

            processStep();
        } else {
            setIsPlaying(false);
            setMessage('');
            setHighlightedNodeId(null);
        }
    }, [animationSteps, onAnimationComplete]);

    return (
        <div className="linked-list-visualizer">
            {isPlaying && <div className="animation-message">{message}</div>}
            <div className="list-container">
                {nodes.map((node, index) => (
                    <React.Fragment key={node.id}>
                        <div className={`list-node ${highlightedNodeId === node.id ? 'highlighted' : ''}`}>
                            <div className="node-value">{node.value}</div>
                            <div className="node-pointer-box">
                                <div className="node-pointer next">next</div>
                                {(listType === 'Doubly-Linked') && <div className="node-pointer prev">prev</div>}
                            </div>
                        </div>
                        {index < nodes.length - 1 && (
                            <div className={`list-arrow-container ${listType === 'Doubly-Linked' ? 'double' : ''}`}>
                                <div className="arrow next-arrow"></div>
                                {listType === 'Doubly-Linked' && <div className="arrow prev-arrow"></div>}
                            </div>
                        )}
                    </React.Fragment>
                ))}
                {nodes.length === 0 && <div className="list-node empty">null</div>}
            </div>
        </div>
    );
};

export default LinkedListVisualizer;