import React, { useState, useEffect, useCallback, useMemo } from 'react';

const TraversalControls = ({ onPlayPause, onStep, onRestart, isPlaying, onClose }) => (
    <div className="traversal-controls">
        <button onClick={() => onStep(-1)}>{"<"}</button>
        <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => onStep(1)}>{">"}</button>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onClose} className="close-btn">Close</button>
    </div>
);

const TreeVisualizer = ({ root, getTreeHeight, animationSteps, animationType, stopAnimation }) => {
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [foundNode, setFoundNode] = useState(null);
    const [message, setMessage] = useState('');
    const [traversalOutput, setTraversalOutput] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // --- ✨ NEW & IMPROVED SCALING LOGIC ✨ ---
    
    // These constants control the new exponential decay scaling.
    // You can tweak them easily to change the look of the tree.
    const BASE_RADIUS = 24;          // The size of the root node.
    const MINIMUM_RADIUS = 18;       // The smallest size a node can approach.
    const RADIUS_DECAY_RATE = 0.85;  // How quickly nodes shrink per level (e.g., 0.9 = slower, 0.8 = faster).
    
    const BASE_FONT_SIZE = 14;
    const MINIMUM_FONT_SIZE = 12;
    const FONT_DECAY_RATE = 0.9;
    
    const LEVEL_HEIGHT = 90; // Increased vertical spacing.

    const layout = useMemo(() => {
        const positions = new Map();
        let minX = 0, maxX = 0;
        const treeH = getTreeHeight(root);
        
        function calcPos(node, x, y, level) {
            if (!node) return;
            
            // NEW: Exponential decay for smooth scaling.
            // This formula creates a natural curve, so nodes never "suddenly" become small.
            const radius = MINIMUM_RADIUS + (BASE_RADIUS - MINIMUM_RADIUS) * Math.pow(RADIUS_DECAY_RATE, level);
            const fontSize = MINIMUM_FONT_SIZE + (BASE_FONT_SIZE - MINIMUM_FONT_SIZE) * Math.pow(FONT_DECAY_RATE, level);

            positions.set(node.value, { x, y, radius, fontSize });
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);

            // A more balanced gap calculation for better layout.
            const gap = Math.pow(1.7, treeH - level) * (radius * 0.8);
            if (node.left) calcPos(node.left, x - gap, y + LEVEL_HEIGHT, level + 1);
            if (node.right) calcPos(node.right, x + gap, y + LEVEL_HEIGHT, level + 1);
        }

        if (root) calcPos(root, 0, 50, 0);
        return { positions, minX, maxX };
    }, [root, getTreeHeight]);
    
    // --- ✨ END OF CHANGES ✨ ---

    const treeHeight = getTreeHeight(root);
    const svgHeight = treeHeight * LEVEL_HEIGHT + 60;
    const padding = 40;
    const viewBox = root ? `${layout.minX - padding} 0 ${layout.maxX - layout.minX + padding * 2} ${svgHeight}` : '0 0 100 100';

    const clearState = useCallback(() => {
        setHighlightedNode(null);
        setFoundNode(null);
        setMessage('');
        setTraversalOutput([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, []);

    useEffect(() => {
        if (animationType) {
            clearState();
            setIsPlaying(true);
        }
    }, [animationType, animationSteps, clearState]);

    const runAnimationStep = useCallback((stepIndex) => {
        if (!animationSteps || stepIndex >= animationSteps.length) {
            setIsPlaying(false);
            if (animationType === 'traversal') {
                const lastStep = animationSteps[animationSteps.length - 1];
                if(lastStep) setHighlightedNode(lastStep.nodeValue);
            }
            return;
        }

        const step = animationSteps[stepIndex];
        setHighlightedNode(step.nodeValue);
        setCurrentStep(stepIndex);

        if (animationType === 'traversal') {
            setTraversalOutput(prev => [...prev, step.nodeValue]);
        } else if (animationType === 'find') {
            if (step.type === 'found') {
                setIsPlaying(false);
                setFoundNode(step.nodeValue);
                setMessage(`Node ${step.nodeValue} found!`);
            } else if (step.type === 'not-found') {
                setIsPlaying(false);
                setMessage(`Node ${step.value} not found.`);
            }
        }
    }, [animationSteps, animationType]);

    useEffect(() => {
        if (isPlaying && animationType) {
            const timer = setTimeout(() => runAnimationStep(currentStep + 1), 700);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, animationType, currentStep, runAnimationStep]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleStep = (dir) => {
        setIsPlaying(false);
        runAnimationStep(currentStep + dir);
    };
    const handleRestart = () => {
        clearState();
        setTimeout(() => setIsPlaying(true), 50);
    };

    const renderNodesRecursive = (node) => {
        if (!node || !layout.positions.has(node.value)) return null;
        
        const { x, y, radius, fontSize } = layout.positions.get(node.value);
        const leftChildPos = node.left ? layout.positions.get(node.left.value) : null;
        const rightChildPos = node.right ? layout.positions.get(node.right.value) : null;
        
        let fill = '#4a90e2';
        if (foundNode === node.value) fill = '#2e7d32';
        else if (highlightedNode === node.value) fill = '#f9a825';

        return (
            <g key={node.value}>
                {leftChildPos && <line x1={x} y1={y} x2={leftChildPos.x} y2={leftChildPos.y} stroke="#666" />}
                {rightChildPos && <line x1={x} y1={y} x2={rightChildPos.x} y2={rightChildPos.y} stroke="#666" />}
                {renderNodesRecursive(node.left)}
                {renderNodesRecursive(node.right)}
                <circle cx={x} cy={y} r={radius} fill={fill} stroke="#fff" strokeWidth="2" />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize={`${fontSize}px`} fontWeight="bold">{node.value}</text>
            </g>
        );
    };
  
    return (
        <div className="tree-visualizer-container">
            <div className="svg-wrapper">
                <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMin meet">
                    {root && renderNodesRecursive(root)}
                </svg>
            </div>
            {animationType === 'traversal' && (
                <div className="traversal-footer">
                    <TraversalControls onPlayPause={handlePlayPause} onStep={handleStep} onRestart={handleRestart} isPlaying={isPlaying} onClose={stopAnimation}/>
                    <div className="traversal-output">Traversal Order: {traversalOutput.join(' → ')}</div>
                </div>
            )}
            {animationType === 'find' && (
                 <div className="traversal-footer">
                    <div className="traversal-output">{message}</div>
                    <button onClick={stopAnimation} className="close-btn single-close">Close</button>
                 </div>
            )}
        </div>
    );
};

export default TreeVisualizer;