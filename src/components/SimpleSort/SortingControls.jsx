import React from 'react';

const SortingControls = ({ sortType, setSortType, arrayInput, setArrayInput, handleSort }) => {
    return (
        <div className="sort-controls">
            <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
                <option value="bubble">Bubble Sort</option>
                <option value="selection">Selection Sort</option>
                <option value="insertion">Insertion Sort</option>
            </select>
            <input
                type="text"
                className="array-input"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="e.g., 5, 3, 8, 1"
            />
            <button onClick={handleSort}>Sort</button>
        </div>
    );
};

export default SortingControls;