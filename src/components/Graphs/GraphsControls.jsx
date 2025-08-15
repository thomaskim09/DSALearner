import React from 'react';

const GraphsControls = ({ onRun, isAnimating, visualizationMode, setVisualizationMode }) => {
    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="control-group">
                    <label htmlFor="vis-mode-select">View As:</label>
                    <select id="vis-mode-select" value={visualizationMode} onChange={(e) => setVisualizationMode(e.target.value)}>
                        <option value="graph">Graph Visualization</option>
                        <option value="table">Adjacency Matrix</option>
                    </select>
                </div>
                <div className="button-grid">
                    <button onClick={() => onRun('dfs')} disabled={isAnimating}>
                        Run DFS
                    </button>
                     <button onClick={() => onRun('bfs')} disabled={isAnimating}>
                        Run BFS
                    </button>
                     <button onClick={() => onRun('mst')} disabled={isAnimating}>
                        Run MST
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GraphsControls;