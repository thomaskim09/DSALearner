import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const Connectors = ({ nodes, nodeRefs, listType, visualizerRect }) => {
    const [paths, setPaths] = useState([]);

    useLayoutEffect(() => {
        if (!visualizerRect || !nodes.length) {
            setPaths([]);
            return;
        }

        const newPaths = [];
        const getRelativeRect = (element) => {
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            // Adjust coordinates to be relative to the visualizer container
            return {
                top: rect.top - visualizerRect.top,
                left: rect.left - visualizerRect.left,
                right: rect.right - visualizerRect.left,
                bottom: rect.bottom - visualizerRect.top,
                width: rect.width,
                height: rect.height,
            };
        };

        const firstLabelRect = getRelativeRect(nodeRefs.current.get('first-label'));
        const lastLabelRect = getRelativeRect(nodeRefs.current.get('last-label'));
        const firstNodeWrapperRect = getRelativeRect(nodeRefs.current.get(nodes[0].id));
        const lastNodeWrapperRect = nodes.length > 0 ? getRelativeRect(nodeRefs.current.get(nodes[nodes.length - 1].id)) : null;

        // Arrow from "First" label with 90-degree turns
        if (firstLabelRect && firstNodeWrapperRect) {
            const fromX = firstLabelRect.right;
            const fromY = firstLabelRect.top + firstLabelRect.height / 2;
            const toX = firstNodeWrapperRect.left;
            const toY = firstNodeWrapperRect.top + firstNodeWrapperRect.height / 2;
            const midX = fromX + (toX - fromX) / 2;
            newPaths.push({ id: 'path-first', d: `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`, type: 'next' });
        }
        
        // Arrow from "Last" label with 90-degree turns
        if (lastLabelRect && lastNodeWrapperRect && (listType === 'Double-Ended' || listType === 'Doubly-Linked')) {
            const fromX = lastLabelRect.right;
            const fromY = lastLabelRect.top + lastLabelRect.height / 2;
            const toX = lastNodeWrapperRect.left + lastNodeWrapperRect.width / 2;
            const toY = lastNodeWrapperRect.bottom;
            const cornerY = lastNodeWrapperRect.bottom + 40;
            newPaths.push({ id: 'path-last', d: `M ${fromX} ${fromY} H ${fromX + 20} V ${cornerY} H ${toX} V ${toY}`, type: 'next' });
        }

        // Arrows between nodes
        for (let i = 0; i < nodes.length - 1; i++) {
            const sourceWrapperRect = getRelativeRect(nodeRefs.current.get(nodes[i].id));
            const targetWrapperRect = getRelativeRect(nodeRefs.current.get(nodes[i + 1].id));

            if (sourceWrapperRect && targetWrapperRect) {
                // Next pointer arrow
                const nextFromX = sourceWrapperRect.right;
                const nextFromY = sourceWrapperRect.top + sourceWrapperRect.height * 0.45;
                const nextToX = targetWrapperRect.left;
                const nextToY = targetWrapperRect.top + targetWrapperRect.height * 0.45;
                newPaths.push({ id: `path-next-${nodes[i].id}`, d: `M ${nextFromX} ${nextFromY} L ${nextToX} ${nextToY}`, type: 'next' });

                // Prev pointer for Doubly-Linked (Right-to-Left)
                if (listType === 'Doubly-Linked') {
                    // Path is from the node on the right (target) to the node on the left (source)
                    const prevFromX = targetWrapperRect.left; 
                    const prevFromY = targetWrapperRect.top + targetWrapperRect.height * 0.8;
                    const prevToX = sourceWrapperRect.right; 
                    const prevToY = sourceWrapperRect.top + sourceWrapperRect.height * 0.8;
                    newPaths.push({ id: `path-prev-${nodes[i].id}`, d: `M ${prevFromX} ${prevFromY} L ${prevToX} ${prevToY}`, type: 'prev' });
                }
            }
        }
        setPaths(newPaths);
    }, [nodes, nodeRefs, listType, visualizerRect]);

    return (
        <svg className="connector-svg">
            <defs>
                {/* Arrowhead for NEXT pointers (points right) */}
                <marker id="arrowhead-next" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-secondary)" />
                </marker>
                {/* Arrowhead for PREV pointers (points left). Removing orient="auto" fixes the direction issue. */}
                <marker id="arrowhead-prev" markerWidth="10" markerHeight="7" refX="1" refY="3.5">
                    <polygon points="10 0, 0 3.5, 10 7" fill="var(--accent-color)" />
                </marker>
            </defs>
            {paths.map(path => (
                 <path key={path.id} d={path.d} className={`connector-path ${path.type}`}
                    markerEnd={
                        path.type === 'next' ? "url(#arrowhead-next)" : 
                        path.type === 'prev' ? "url(#arrowhead-prev)" : ""
                    }
                />
            ))}
        </svg>
    );
};


const LinkedListVisualizer = ({ head, animationSteps, onAnimationComplete, listType }) => {
    const [nodes, setNodes] = useState([]);
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [message, setMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [visualizerRect, setVisualizerRect] = useState(null);
    
    const nodeRefs = useRef(new Map());
    const visualizerRef = useRef(null);

    useEffect(() => {
        let current = head;
        const newNodes = [];
        while (current) {
            newNodes.push({ id: current.id, value: current.value });
            current = current.next;
        }
        setNodes(newNodes);
    }, [head]);

    useLayoutEffect(() => {
        const updateRect = () => {
            if (visualizerRef.current) {
                setVisualizerRect(visualizerRef.current.getBoundingClientRect());
            }
        };
        updateRect();
        const resizeObserver = new ResizeObserver(updateRect);
        if (visualizerRef.current) {
            resizeObserver.observe(visualizerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [nodes]);

    useEffect(() => {
        if (animationSteps?.length > 0) {
            setIsPlaying(true);
            let stepIndex = 0;
            const processStep = () => {
                if (stepIndex >= animationSteps.length) {
                    setIsPlaying(false);
                    setHighlightedNodeId(null);
                    setMessage('');
                    if (onAnimationComplete) setTimeout(onAnimationComplete, 500);
                    return;
                }
                const step = animationSteps[stepIndex];
                setMessage(step.message || '');
                setHighlightedNodeId(step.nodeId || null);
                stepIndex++;
                setTimeout(processStep, 1000);
            };
            processStep();
        } else {
            setIsPlaying(false);
            setMessage('');
            setHighlightedNodeId(null);
        }
    }, [animationSteps, onAnimationComplete]);

    return (
        <div className="linked-list-visualizer" ref={visualizerRef}>
            <div className="visualizer-content">
                <div className="list-info-box">
                    <div className="list-info-label" ref={el => nodeRefs.current.set('first-label', el)}>First</div>
                    {(listType === 'Double-Ended' || listType === 'Doubly-Linked') &&
                        <div className="list-info-label" ref={el => nodeRefs.current.set('last-label', el)}>Last</div>
                    }
                </div>

                <div className="list-container">
                    {nodes.map((node) => (
                         <div className="node-wrapper" key={node.id} ref={el => nodeRefs.current.set(node.id, el)}>
                            <div className={`list-node ${highlightedNodeId === node.id ? 'highlighted' : ''}`}>
                                <div className="node-value">{node.value}</div>
                                <div className="node-pointer-box">
                                    <div className="node-pointer next">next</div>
                                    {(listType === 'Doubly-Linked') && <div className="node-pointer prev">prev</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {nodes.length === 0 && <div className="list-node empty">null</div>}
                </div>
            </div>
            
            <Connectors nodes={nodes} nodeRefs={nodeRefs} listType={listType} visualizerRect={visualizerRect}/>

            {isPlaying && <div className="animation-message">{message}</div>}
        </div>
    );
};

export default LinkedListVisualizer;