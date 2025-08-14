import React from 'react';

const AdvancedSortControls = ({ 
    sortType, setSortType, shellSequence, setShellSequence, 
    arrayInput, setArrayInput, handleSort 
}) => {
    return (
        <div className="sort-controls">
            <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
                <option value="shell">Shell Sort</option>
                <option value="quick">Quick Sort</option>
            </select>
            
            {sortType === 'shell' && (
                <select onChange={(e) => setShellSequence(e.target.value)} value={shellSequence}>
                    <option value="knuth">Knuth Sequence</option>
                    <option value="shell">Original Shell Sequence (N/2)</option>
                </select>
            )}

            <input
                type="text"
                className="array-input"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="e.g., 88, 67, 99, 22"
            />
            <button onClick={handleSort}>Sort</button>
        </div>
    );
};

export default AdvancedSortControls;