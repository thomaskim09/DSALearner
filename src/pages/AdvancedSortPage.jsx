import React, { useState, useEffect, useCallback } from 'react';
import { useAdvancedSort } from '../hooks/useAdvancedSort';
import AdvancedSortControls from '../components/AdvancedSort/AdvancedSortControls';
import AdvancedSortVisualizer from '../components/AdvancedSort/AdvancedSortVisualizer';
import AdvancedSortCodeDisplay from '../components/AdvancedSort/AdvancedSortCodeDisplay';
import '../assets/styles/SimpleSort.css'; // Reusing simple sort styles
import '../assets/styles/AdvancedSort.css'; // Adding specific styles for quicksort

const AdvancedSortPage = () => {
    const [sortType, setSortType] = useState('shell');
    const [shellSequence, setShellSequence] = useState('knuth');
    const [arrayInput, setArrayInput] = useState('88, 67, 99, 22, 55, 33, 12, 76, 23, 78, 90, 43, 66, 77');
    const { history, sort } = useAdvancedSort();

    const handleSort = useCallback(() => {
        const array = arrayInput.split(/[,\\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        if (array.length > 0) {
            sort(array, sortType, { shellSequence });
        }
    }, [arrayInput, sortType, shellSequence, sort]);

    useEffect(() => {
        handleSort();
    }, [handleSort]);

    return (
        <div className="chapter-page-sort">
            <header className="sort-header">
                <h1>Chapter 8: Advanced Sorting</h1>
                <p>Visualize Shell Sort and Quick Sort. See how different gap sequences affect Shell Sort and how partitioning works in Quick Sort.</p>
            </header>
            
            <AdvancedSortControls 
                sortType={sortType}
                setSortType={setSortType}
                shellSequence={shellSequence}
                setShellSequence={setShellSequence}
                arrayInput={arrayInput}
                setArrayInput={setArrayInput}
                handleSort={handleSort}
            />

            <div className="sort-content-area">
                <div className="visualizer-container">
                    <AdvancedSortVisualizer history={history} sortType={sortType} />
                </div>
                <div className="code-display-container-sort">
                    <AdvancedSortCodeDisplay sortType={sortType} />
                </div>
            </div>
        </div>
    );
};

export default AdvancedSortPage;