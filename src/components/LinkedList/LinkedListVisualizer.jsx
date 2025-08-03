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
        if (animationSteps.length > 0) {
            setIsPlaying(true);
            let stepIndex = 0;
            const interval = setInterval(() => {
                const step = animationSteps[stepIndex];
                setMessage(step.message);
                if (step.type === 'highlight' || step.type === 'found' || step.type === 'delete') {
                    setHighlightedNodeId(step.nodeId);
                }
                stepIndex++;
                if (stepIndex >= animationSteps.length) {
                    clearInterval(interval);
                    setHighlightedNodeId(null);
                    setTimeout(onAnimationComplete, 500);
                }
            }, 1000); // 1 second per step
        } else {
            setIsPlaying(false);
            setMessage('');
        }
    }, [animationSteps, onAnimationComplete]);

    return (
        <div className="linked-list-visualizer">
            {isPlaying && <div className="animation-message">{message}</div>}
            <div className="list-container">
                {nodes.map((node, index) => (
                    <React.Fragment key={node.id}>
                        <div className={`list-node ${highlightedNodeId === node.id ? 'highlighted' : ''}`}>
                            {(listType === 'Doubly-Linked' || listType === 'Sorted') &&
                                <div className="node-pointer prev">{index === 0 ? 'Null' : '•'}</div>
                            }
                            <div className="node-value">{node.value}</div>
                            <div className="node-pointer next">{index === nodes.length - 1 ? 'Null' : '•'}</div>
                        </div>
                        {index < nodes.length - 1 && <div className={`list-arrow ${listType === 'Doubly-Linked' ? 'double' : ''}`}></div>}
                    </React.Fragment>
                ))}
                {nodes.length === 0 && <div className="list-node empty">null</div>}
            </div>
        </div>
    );
};

export default LinkedListVisualizer;