import React, { useState, useEffect, useMemo, useRef } from 'react';

const HeapVisualizer = ({ heap, getHeapHeight, animation, onAnimationComplete }) => {
    const [positions, setPositions] = useState(new Map());
    const [viewMatrix, setViewMatrix] = useState({ x: 0, y: 50, zoom: 1 });
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [message, setMessage] = useState('');
    const viewportRef = useRef(null);

    const NODE_RADIUS = 25;
    const LEVEL_HEIGHT = 90;

    const layout = useMemo(() => {
        const pos = new Map();
        const treeHeight = getHeapHeight(0);
        function calcPos(index, x, y, level) {
            if (index >= heap.length) return;
            pos.set(index, { x, y });
            const dynamicGap = Math.pow(1.6, treeHeight - level) * 20;
            calcPos(2 * index + 1, x - dynamicGap, y + LEVEL_HEIGHT, level + 1);
            calcPos(2 * index + 2, x + dynamicGap, y + LEVEL_HEIGHT, level + 1);
        }
        if (heap.length > 0) {
            calcPos(0, 0, 0, 0);
        }
        return pos;
    }, [heap, getHeapHeight]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (viewport) {
            const { width } = viewport.getBoundingClientRect();
            setViewMatrix(prev => ({ ...prev, x: width / 2 }));
        }
        setPositions(layout);
    }, [layout]);

    useEffect(() => {
        if (animation) {
            let stepIndex = 0;
            const animateStep = () => {
                if (stepIndex >= animation.steps.length) {
                    onAnimationComplete();
                    setHighlightedNode(null);
                    setMessage('');
                    return;
                }
                const step = animation.steps[stepIndex];
                setHighlightedNode(step.nodeIndex);
                setMessage(step.message);
                stepIndex++;
                setTimeout(animateStep, 800);
            };
            animateStep();
        }
    }, [animation, onAnimationComplete]);

    const renderNode = (index) => {
        if (index >= heap.length) return null;
        const pos = positions.get(index);
        if (!pos) return null;

        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;

        return (
            <g key={index}>
                {leftChildIndex < heap.length && positions.has(leftChildIndex) && (
                    <line x1={pos.x} y1={pos.y} x2={positions.get(leftChildIndex).x} y2={positions.get(leftChildIndex).y} stroke="var(--border-color)" strokeWidth="2" />
                )}
                {rightChildIndex < heap.length && positions.has(rightChildIndex) && (
                    <line x1={pos.x} y1={pos.y} x2={positions.get(rightChildIndex).x} y2={positions.get(rightChildIndex).y} stroke="var(--border-color)" strokeWidth="2" />
                )}
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS} fill={highlightedNode === index ? 'var(--node-highlight)' : 'var(--node-primary)'} stroke="var(--bg-content)" strokeWidth="3" />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="14px" fontWeight="bold">{heap[index]}</text>
                {renderNode(leftChildIndex)}
                {renderNode(rightChildIndex)}
            </g>
        );
    };

    return (
        <div className="heap-visualizer-container" ref={viewportRef}>
            <svg className="svg-viewport" style={{ width: '100%', height: '100%' }}>
                <g transform={`translate(${viewMatrix.x}, ${viewMatrix.y}) scale(${viewMatrix.zoom})`}>
                    {heap.length > 0 && renderNode(0)}
                </g>
            </svg>
            {message && <div className="animation-message">{message}</div>}
        </div>
    );
};

export default HeapVisualizer;