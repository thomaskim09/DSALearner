// DSALearner_packaged/src/components/Graphs/GraphsControls.jsx

import React from 'react';

const GraphsControls = ({
    onRun, isAnimating, visualizationMode, setVisualizationMode,
    vertexList, startVertex, setStartVertex, onGraphChange,
    graphType, onGraphTypeChange, graphExamples
}) => {
    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="control-row">
                    <label htmlFor="graph-type-select">Graph Type:</label>
                    <select
                        id="graph-type-select"
                        value={graphType}
                        onChange={(e) => onGraphTypeChange(e.target.value)}
                        disabled={isAnimating}
                    >
                        <option value="unweighted">Unweighted</option>
                        <option value="weighted">Weighted</option>
                    </select>
                </div>
                <div className="control-row">
                    <label htmlFor="graph-select">Example:</label>
                    <select
                        id="graph-select"
                        onChange={(e) => onGraphChange(parseInt(e.target.value, 10))}
                        disabled={isAnimating}
                    >
                        {graphExamples.map((graph, index) => (
                            <option key={index} value={index}>{graph.name}</option>
                        ))}
                    </select>
                </div>
                <div className="control-row">
                    <label htmlFor="start-vertex-select">Start From:</label>
                    <select
                        id="start-vertex-select"
                        value={startVertex}
                        onChange={(e) => setStartVertex(parseInt(e.target.value, 10))}
                        disabled={isAnimating}
                    >
                        {vertexList.map((v, i) => (
                            <option key={i} value={i}>{v.label}</option>
                        ))}
                    </select>
                </div>
                 <div className="control-row">
                    <label htmlFor="vis-mode-select">View As:</label>
                    <select id="vis-mode-select" value={visualizationMode} onChange={(e) => setVisualizationMode(e.target.value)}>
                        <option value="graph">Graph</option>
                        <option value="table">Table</option>
                    </select>
                </div>
                <div className="button-grid">
                    <button onClick={() => onRun('dfs')} disabled={isAnimating}>Run DFS</button>
                    <button onClick={() => onRun('bfs')} disabled={isAnimating}>Run BFS</button>
                    <button onClick={() => onRun('mst')} disabled={isAnimating || graphType === 'unweighted'}>Run MST</button>
                </div>
            </div>
        </div>
    );
};

export default GraphsControls;
