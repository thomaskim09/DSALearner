import React, { useState, useEffect } from 'react';

const LinkedListVisualizer = ({ head, animationSteps, onAnimationComplete }) => {
    const [nodes, setNodes] = useState([]);
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const generatedNodes = [];
        let current = head;
        while (current) {
            generatedNodes.push({ id: current.id, value: current.value, next: current.next ? current.next.id : null });
            current = current.next;
        }
        setNodes(generatedNodes);
    }, [head]);

    useEffect(() => {
        if (animationSteps && animationSteps.length > 0) {
            setCurrentStep(0);
            setIsPlaying(true);
        }
    }, [animationSteps]);

    useEffect(() => {
        if (!isPlaying || !animationSteps || currentStep >= animationSteps.length) {
            if (isPlaying) {
                onAnimationComplete();
                setIsPlaying(false);
                setHighlightedNodeId(null);
            }
            return;
        }

        const step = animationSteps[currentStep];
        const timer = setTimeout(() => {
            if (step.type === 'highlight' || step.type === 'update-head') {
                setHighlightedNodeId(step.nodeId);
            }
             if (step.type === 'create'){
                setNodes(prev => [...prev, step.node]);
                setHighlightedNodeId(step.node.id);
            }
            setMessage(step.message);
            setCurrentStep(prev => prev + 1);
        }, 800);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, animationSteps, onAnimationComplete]);


    return (
        <div className="linked-list-visualizer">
            <div className="list-container">
                {nodes.map((node, index) => (
                    <React.Fragment key={node.id}>
                        <div className={`list-node ${highlightedNodeId === node.id ? 'highlighted' : ''}`}>
                            {node.value}
                        </div>
                        {index < nodes.length - 1 && <div className="list-arrow">→</div>}
                    </React.Fragment>
                ))}
                {nodes.length === 0 && <div className="list-node empty">null</div>}
            </div>
            {isPlaying && <div className="animation-message">{message}</div>}
        </div>
    );
};

export default LinkedListVisualizer;