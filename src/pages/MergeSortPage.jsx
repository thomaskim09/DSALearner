import React, { useState, useEffect, useCallback } from 'react';
import { useMergeSort } from '../hooks/useMergeSort';
import MergeSortVisualizer from '../components/MergeSort/MergeSortVisualizer';
import MergeSortCodeDisplay from '../components/MergeSort/MergeSortCodeDisplay';
import '../assets/styles/SimpleSort.css'; // Using similar styles

const MergeSortPage = () => {
    // Updated to match the array from your provided image
    const [arrayInput, setArrayInput] = useState('40, 19, 8, 56, 22, 46, 77, 34, 66, 23, 97, 63');
    const { history, sort } = useMergeSort();

    const handleSort = useCallback(() => {
        const array = arrayInput.split(/[,\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        if (array.length > 0) {
            sort(array);
        }
    }, [arrayInput, sort]);

    useEffect(() => {
        handleSort();
    }, [handleSort]);

    return (
        <div className="chapter-page-sort">
            <div className="sort-controls">
                <input
                    type="text"
                    className="array-input"
                    value={arrayInput}
                    onChange={(e) => setArrayInput(e.target.value)}
                    placeholder="e.g., 5, 3, 8, 1 or 5 3 8 1"
                />
                <button onClick={handleSort}>Sort</button>
            </div>

            <div className="sort-content-area">
                <div className="visualizer-container">
                    <MergeSortVisualizer history={history} />
                </div>
                <div className="code-display-container-sort">
                    <MergeSortCodeDisplay />
                </div>
            </div>
        </div>
    );
};

export default MergeSortPage;