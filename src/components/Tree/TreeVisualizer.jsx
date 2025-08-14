import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const TraversalControls = ({ onPlayPause, onStep, onRestart, isPlaying, onClose }) => (
    <div className="traversal-controls">
        <button onClick={() => onStep(-1)}>{"<"}</button>
        <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={() => onStep(1)}>{">"}</button>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onClose} className="close-btn">Close</button>
    </div>
);

const TreeVisualizer = ({ root, getTreeHeight, animationSteps, animationType, stopAnimation, latestNodeId }) => {
    const [viewMatrix, setViewMatrix] = useState({ x: 0, y: 0, zoom: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const viewportRef = useRef(null);

    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [foundNodeId, setFoundNodeId] = useState(null);
    const [message, setMessage] = useState('');
    const [traversalOutput, setTraversalOutput] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const NODE_RADIUS = 25;
    const FONT_SIZE = 14;
    const LEVEL_HEIGHT = 90;
    const HORIZONTAL_GAP_MULTIPLIER = 22; // Increased from 30 to 80 for better spacing

    const layout = useMemo(() => {
        const positions = new Map();
        
        function calcPos(node, x, y, level) {
            if (!node) return;
            positions.set(node.id, { x, y });
            
            // Calculate dynamic gap based on tree depth and level
            const depth = getTreeHeight(root);
            const levelFactor = Math.max(1, depth - level);
            const dynamicGap = Math.pow(1.8, levelFactor) * HORIZONTAL_GAP_MULTIPLIER;
            
            if (node.left) calcPos(node.left, x - dynamicGap, y + LEVEL_HEIGHT, level + 1);
            if (node.right) calcPos(node.right, x + dynamicGap, y + LEVEL_HEIGHT, level + 1);
        }
        
        if (root) calcPos(root, 0, 0, 0);
        return { positions };
    }, [root, getTreeHeight]);

    // ✨ FIX: Center tree on initial load
    useEffect(() => {
        const viewport = viewportRef.current;
        if (viewport && root) {
            const { width, height } = viewport.getBoundingClientRect();
            
            // Calculate tree bounds to center it properly
            let minX = Infinity, maxX = -Infinity;
            layout.positions.forEach(pos => {
                minX = Math.min(minX, pos.x);
                maxX = Math.max(maxX, pos.x);
            });
            
            const treeWidth = maxX - minX;
            const centerX = width / 2 - (minX + maxX) / 2;
            const centerY = height * 0.2; // Start a bit lower from top
            
            // Calculate appropriate zoom level to fit the tree
            const padding = 100; // Extra space around the tree
            const scaleX = (width - padding) / Math.max(treeWidth, 100);
            const scaleY = (height - padding) / (getTreeHeight(root) * LEVEL_HEIGHT);
            const autoZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1x
            
            setViewMatrix({ 
                x: centerX, 
                y: centerY, 
                zoom: Math.max(0.3, autoZoom) // Minimum zoom of 0.3x
            });
        }
    }, [root, layout.positions]);

    const handleMouseDown = (e) => {
        setIsPanning(true);
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setIsPanning(false);

    const handleMouseMove = (e) => {
        if (!isPanning) return;
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
        setViewMatrix(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        const newZoom = e.deltaY < 0 ? viewMatrix.zoom * zoomFactor : viewMatrix.zoom / zoomFactor;
        setViewMatrix(prev => ({...prev, zoom: Math.max(0.1, Math.min(newZoom, 5))}));
    };
    
    useEffect(() => {
        if (latestNodeId) {
            setHighlightedNodeId(latestNodeId);
            setTimeout(() => setHighlightedNodeId(null), 1500);
        }
    }, [latestNodeId]);

    const clearState = useCallback(() => {
        setHighlightedNodeId(null);
        setFoundNodeId(null);
        setMessage('');
        setTraversalOutput([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, []);
    
    // ✨ FIX: Separated step display from step execution
    const displayStep = (stepIndex) => {
        const step = animationSteps[stepIndex];
        if (!step) return;
        setHighlightedNodeId(step.nodeId);
        setMessage(step.message || '');
    };

    const executeStep = (stepIndex) => {
        const step = animationSteps[stepIndex];
        if (!step) return;
        displayStep(stepIndex);
        if (animationType === 'traversal' && step.type === 'visit') {
             setTraversalOutput(prev => [...prev, step.nodeValue]);
        }
        if (step.type === 'found') setFoundNodeId(step.nodeId);
    };
    
    useEffect(() => {
        if (animationType) {
            clearState();
            setIsPlaying(true);
        }
    }, [animationType, animationSteps, clearState]);

    useEffect(() => {
        if (!isPlaying || !animationType) return;
        if (currentStep >= animationSteps.length) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => {
            executeStep(currentStep);
            setCurrentStep(prev => prev + 1);
        }, 700);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, animationSteps, animationType]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);

    const handleStep = (dir) => {
        setIsPlaying(false);
        const nextStep = Math.max(0, Math.min(animationSteps.length - 1, currentStep + dir));
        setCurrentStep(nextStep);
        displayStep(nextStep); // Only display the step, don't execute it
    };

    const handleRestart = () => {
        clearState();
        setTimeout(() => setIsPlaying(true), 50);
    };

    const renderNodesRecursive = (node) => {
        if (!node || !layout.positions.has(node.id)) return null;
        const { x, y } = layout.positions.get(node.id);
        let fill = 'var(--node-primary)';
        if (foundNodeId === node.id) fill = 'var(--node-found)';
        else if (highlightedNodeId === node.id) fill = 'var(--node-highlight)';
    
        return (
            <g key={node.id}>
                {node.left && <line x1={x} y1={y} x2={layout.positions.get(node.left.id).x} y2={layout.positions.get(node.left.id).y} stroke="var(--border-color)" strokeWidth="2" />}
                {node.right && <line x1={x} y1={y} x2={layout.positions.get(node.right.id).x} y2={layout.positions.get(node.right.id).y} stroke="var(--border-color)" strokeWidth="2" />}
                {renderNodesRecursive(node.left)}
                {renderNodesRecursive(node.right)}
                <circle cx={x} cy={y} r={NODE_RADIUS} fill={fill} stroke="var(--bg-content)" strokeWidth="3" />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize={`${FONT_SIZE}px`} fontWeight="bold">{node.value}</text>
            </g>
        );
    };
  
    return (
        <div className={`tree-visualizer-container ${isPanning ? 'is-panning' : ''}`} ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
        >
            <svg className="svg-viewport">
                <g transform={`translate(${viewMatrix.x}, ${viewMatrix.y}) scale(${viewMatrix.zoom})`}>
                    {root && renderNodesRecursive(root)}
                </g>
            </svg>
            
             {animationType && 
                 <div className="traversal-footer">
                    <div className="traversal-message">{message}</div>
                     {animationType === 'traversal' && (
                        <>
                            <div className="traversal-output">Order: {traversalOutput.join(' → ')}</div>
                            <TraversalControls onPlayPause={handlePlayPause} onStep={handleStep} onRestart={handleRestart} isPlaying={isPlaying} onClose={stopAnimation}/>
                        </>
                    )}
                    {(animationType === 'find' || animationType === 'delete') && (
                        <button onClick={stopAnimation} className="close-btn single-close">Close</button>
                    )}
                 </div>
            }
        </div>
    );
};

export default TreeVisualizer;