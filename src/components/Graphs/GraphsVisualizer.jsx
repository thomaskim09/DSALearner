import React, { useEffect, useState, useRef } from 'react';

const AdjacencyMatrix = ({ graph, animationStep }) => {
    const currentVertex = animationStep?.vertexIndex ?? animationStep?.from ?? animationStep?.to;
    const fromVertex = animationStep?.from;

    return (
        <div className="adjacency-matrix-container">
            <table className="adjacency-matrix">
                <thead>
                    <tr>
                        <th></th>
                        {graph.vertexList.map((v, i) => (
                            <th key={v.label} className={currentVertex === i ? 'highlight-header' : ''}>
                                {v.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {graph.adjMat.slice(0, graph.nVerts).map((row, i) => (
                        <tr key={i} className={currentVertex === i ? 'highlight-row' : ''}>
                            <th className={currentVertex === i ? 'highlight-header' : ''}>{graph.vertexList[i].label}</th>
                            {row.slice(0, graph.nVerts).map((cell, j) => {
                                const isBeingChecked = (fromVertex === i && animationStep?.type !== 'backtrack') || (currentVertex === i && animationStep?.type === 'dequeue');
                                return (
                                    <td key={j} className={isBeingChecked ? 'highlight-cell' : ''}>
                                        {cell}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const GraphsVisualizer = ({ graph, animationSteps, currentStep, setCurrentStep, isPlaying, setIsPlaying, visualizationMode, operation }) => {
    // ... (The rest of the component remains the same)
    const { vertexList, adjMat } = graph;
    const [viewMatrix, setViewMatrix] = useState({ x: 200, y: 250, zoom: 1 });
    const [isPanning, setIsPanning] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const viewportRef = useRef(null);

    useEffect(() => {
        let timer;
        if (isPlaying && currentStep < animationSteps.length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800);
        } else if (isPlaying && currentStep >= animationSteps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, animationSteps.length, setCurrentStep, setIsPlaying]);

    // Panning and Zooming handlers
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
        setViewMatrix(prev => ({...prev, zoom: Math.max(0.2, Math.min(newZoom, 3))}));
    };


    const positions = [
        { x: 50, y: 200 }, { x: 150, y: 100 }, { x: 150, y: 200 },
        { x: 150, y: 300 }, { x: 150, y: 400 }, { x: 250, y: 100 },
        { x: 250, y: 300 }, { x: 350, y: 100 }, { x: 350, y: 300 }
    ];

    const currentAnimationStep = animationSteps[currentStep];
    const visitedIndices = new Set(
        animationSteps.slice(0, currentStep + 1)
                      .filter(step => step.type === 'visit' || step.type === 'add_edge' || step.type === 'start')
                      .map(step => step.vertexIndex ?? step.to)
    );
     const mstEdges = new Set(
        animationSteps.slice(0, currentStep + 1)
                      .filter(step => step.type === 'add_edge')
                      .map(step => `${Math.min(step.from, step.to)}-${Math.max(step.from, step.to)}`)
    );

    if (visualizationMode === 'table') {
        return <AdjacencyMatrix graph={graph} animationStep={currentAnimationStep} />;
    }

    return (
        <div
            className={`graphs-visualizer-container ${isPanning ? 'is-panning' : ''}`}
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
        >
            <svg width="100%" height="100%">
                <g transform={`translate(${viewMatrix.x}, ${viewMatrix.y}) scale(${viewMatrix.zoom})`}>
                    {adjMat.map((row, i) =>
                        row.map((col, j) => {
                            if (col === 1 && i < j) {
                                const isTraversalEdge = currentAnimationStep &&
                                    ((currentAnimationStep.from === i && (currentAnimationStep.vertexIndex === j || currentAnimationStep.to === j)) ||
                                     (currentAnimationStep.from === j && (currentAnimationStep.vertexIndex === i || currentAnimationStep.to === i)));
                                const isMstEdge = operation === 'mst' && mstEdges.has(`${i}-${j}`);

                                return (
                                    <line
                                        key={`${i}-${j}`}
                                        x1={positions[i].x} y1={positions[i].y}
                                        x2={positions[j].x} y2={positions[j].y}
                                        className={`graph-edge ${isTraversalEdge ? 'active' : ''} ${isMstEdge ? 'mst-edge' : ''}`}
                                    />
                                );
                            }
                            return null;
                        })
                    )}
                    {vertexList.map((vertex, index) => {
                        const isCurrent = currentAnimationStep?.vertexIndex === index || currentAnimationStep?.to === index;
                        const isVisited = visitedIndices.has(index);
                        return (
                            <g key={index}>
                                <circle cx={positions[index].x} cy={positions[index].y} r="20"
                                    className={`graph-vertex ${isVisited ? 'visited' : ''} ${isCurrent ? 'current' : ''}`}
                                />
                                <text x={positions[index].x} y={positions[index].y + 5} className="graph-vertex-label">
                                    {vertex.label}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
             <div className="visualizer-status-message">
                {currentAnimationStep?.message || 'Select an algorithm to run.'}
            </div>
        </div>
    );
};

export default GraphsVisualizer;