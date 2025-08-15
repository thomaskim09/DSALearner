import React, { useState, useEffect, useMemo, useRef } from 'react';

const HeapVisualizer = ({ heap, getHeapHeight, operationType, sortedCount, highlights, visualizationMode, history }) => {
    const [positions, setPositions] = useState(new Map());
    const [viewMatrix, setViewMatrix] = useState({ x: 0, y: 50, zoom: 0.9 });
    const [isPanning, setIsPanning] = useState(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const viewportRef = useRef(null);

    const NODE_RADIUS = 25;
    const LEVEL_HEIGHT = 90;
    const HORIZONTAL_GAP_MULTIPLIER = 22;
    const HEAP_END_INDEX = heap.length - (sortedCount || 0);


    const layout = useMemo(() => {
        const pos = new Map();
        const heapHeight = getHeapHeight(0);

        function calcPos(index, x, y, level) {
            if (index >= HEAP_END_INDEX) return;
            pos.set(index, { x, y, isHeap: true });
            const levelFactor = Math.max(1, heapHeight - level);
            const dynamicGap = Math.pow(1.8, levelFactor) * HORIZONTAL_GAP_MULTIPLIER;
            calcPos(2 * index + 1, x - dynamicGap, y + LEVEL_HEIGHT, level + 1);
            calcPos(2 * index + 2, x + dynamicGap, y + LEVEL_HEIGHT, level + 1);
        }

        if (heap.length > 0) {
            calcPos(0, 0, 0, 0);

            // Layout for the sorted part of the array
            for (let i = HEAP_END_INDEX; i < heap.length; i++) {
                const x = (i - HEAP_END_INDEX + 1) * (NODE_RADIUS * 2 + 20) - (heap.length - HEAP_END_INDEX) * (NODE_RADIUS + 10);
                pos.set(i, { x, y: LEVEL_HEIGHT * (heapHeight + 1), isHeap: false });
            }
        }
        return pos;
    }, [heap, getHeapHeight, HEAP_END_INDEX]);

    useEffect(() => {
        const viewport = viewportRef.current;
        if (viewport) {
            const { width } = viewport.getBoundingClientRect();
            setViewMatrix(prev => ({ ...prev, x: width / 2 }));
        }
        setPositions(layout);
    }, [layout]);

    // FIX: Handle wheel event with useEffect to set passive: false
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleWheel = (e) => {
            e.preventDefault();
            const zoomFactor = 1.1;
            setViewMatrix(prev => {
                const newZoom = e.deltaY < 0 ? prev.zoom * zoomFactor : prev.zoom / zoomFactor;
                return {...prev, zoom: Math.max(0.1, Math.min(newZoom, 5))};
            });
        };

        viewport.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            viewport.removeEventListener('wheel', handleWheel);
        };
    }, []); // Empty dependency array means this effect runs once on mount

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

    const handleZoom = (direction) => {
        const zoomFactor = 1.2;
        const newZoom = direction === 'in' ? viewMatrix.zoom * zoomFactor : viewMatrix.zoom / zoomFactor;
        setViewMatrix(prev => ({...prev, zoom: Math.max(0.1, Math.min(newZoom, 5))}));
    };


    const renderNode = (index) => {
        if (index >= heap.length) return null;
        const pos = positions.get(index);
        if (!pos) return null;

        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;

        let fill = 'var(--node-primary)';
        if (highlights?.swapping?.includes(index)) fill = 'orange';
        else if (highlights?.comparing?.includes(index)) fill = 'lightblue';
        else if (highlights?.swapped?.includes(index)) fill = 'lightgreen';
        else if (highlights?.final === index) fill = 'green';
        else if (highlights?.processing === index) fill = 'yellow';
        else if (!pos.isHeap) fill = 'purple';


        return (
            <g key={index}>
                {pos.isHeap && leftChildIndex < HEAP_END_INDEX && positions.has(leftChildIndex) && (
                    <line x1={pos.x} y1={pos.y} x2={positions.get(leftChildIndex).x} y2={positions.get(leftChildIndex).y} stroke="var(--border-color)" strokeWidth="2" />
                )}
                {pos.isHeap && rightChildIndex < HEAP_END_INDEX && positions.has(rightChildIndex) && (
                    <line x1={pos.x} y1={pos.y} x2={positions.get(rightChildIndex).x} y2={positions.get(rightChildIndex).y} stroke="var(--border-color)" strokeWidth="2" />
                )}
                <circle cx={pos.x} cy={pos.y} r={NODE_RADIUS} fill={fill} stroke="var(--bg-content)" strokeWidth="3" />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="14px" fontWeight="bold">{heap[index]}</text>

                {pos.isHeap && renderNode(leftChildIndex)}
                {pos.isHeap && renderNode(rightChildIndex)}
            </g>
        );
    };

    if (visualizationMode === 'table') {
        return (
            <div className="visualizer-wrapper">
                <table className="sorting-table">
                    <thead>
                        <tr>
                            <th>Pass</th>
                            {history.length > 0 && history[0].heap.map((_, index) => (
                                <th key={index}>{index}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((step, passIndex) => (
                            <tr key={passIndex}>
                                <td>{passIndex}</td>
                                {step.heap.map((value, cellIndex) => {
                                    let classNames = 'cell';
                                    if (step.sortedCount > 0 && cellIndex >= step.heap.length - step.sortedCount) {
                                        classNames += ' sorted-bubble';
                                    }
                                    return <td key={cellIndex} className={classNames}>{value}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div
            className={`heap-visualizer-container ${isPanning ? 'is-panning' : ''}`}
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            // onWheel is now handled by useEffect
        >
            <svg className="svg-viewport" style={{ width: '100%', height: '100%' }}>
                <g transform={`translate(${viewMatrix.x}, ${viewMatrix.y}) scale(${viewMatrix.zoom})`}>
                    {heap.map((_, index) => renderNode(index))}
                </g>
            </svg>
            <div className="zoom-controls">
                <button onClick={() => handleZoom('in')}>+</button>
                <button onClick={() => handleZoom('out')}>-</button>
            </div>
        </div>
    );
};


export default HeapVisualizer;