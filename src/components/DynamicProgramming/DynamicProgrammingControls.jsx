import React from 'react';

const DynamicProgrammingControls = ({ onCalculate, visualizationType, setVisualizationType, n, setN, r, setR, algorithm }) => {
    
    const handleAlgoChange = (e) => {
        const newAlgo = e.target.value;
        onCalculate(newAlgo, {n, r});
    }

    return (
        <div className="sort-controls dp-controls">
            <div className="control-group">
                <label>Algorithm:</label>
                <select onChange={handleAlgoChange} value={algorithm.startsWith('binomial') ? 'binomial' : algorithm}>
                    <option value="binomial">Binomial Coefficient</option>
                    <option value="floydWarshall">Floyd-Warshall</option>
                </select>
            </div>
            {algorithm.startsWith('binomial') && (
                <>
                    <div className="control-group">
                        <label>Visualization:</label>
                        <select onChange={(e) => setVisualizationType(e.target.value)} value={visualizationType}>
                            <option value="dp">DP Table</option>
                            <option value="pascal">Pascal's Triangle</option>
                            <option value="recursive">Recursion</option>
                        </select>
                    </div>
                    <div className="control-group">
                        <label>n:</label>
                        <input
                            type="number"
                            value={n}
                            onChange={(e) => setN(parseInt(e.target.value, 10))}
                            placeholder="n"
                        />
                    </div>
                    <div className="control-group">
                        <label>r:</label>
                        <input
                            type="number"
                            value={r}
                            onChange={(e) => setR(parseInt(e.target.value, 10))}
                            placeholder="r"
                        />
                    </div>
                </>
            )}
            <button onClick={onCalculate}>{algorithm === 'floydWarshall' ? 'Run' : 'Calculate'}</button>
        </div>
    );
};

export default DynamicProgrammingControls;