import React, { useState, useEffect, useCallback } from 'react';
import { useSorting } from '../hooks/useSorting';
import SortingControls from '../components/SimpleSort/SortingControls';
import SortingVisualizer from '../components/SimpleSort/SortingVisualizer';
import SortingCodeDisplay from '../components/SimpleSort/SortingCodeDisplay';
import '../assets/styles/SimpleSort.css';

const SimpleSortPage = () => {
    const [sortType, setSortType] = useState('bubble');
    const [arrayInput, setArrayInput] = useState('44, 78, 30, 88, 3, 20, 72, 99, 17, 55, 66');
    const { history, sort } = useSorting();

    // Memoize handleSort to prevent re-creation on every render
    const handleSort = useCallback(() => {
        const array = arrayInput.split(/[,\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        if (array.length > 0) {
            sort(array, sortType);
        }
    }, [arrayInput, sortType, sort]);

    // This useEffect hook runs the sort automatically when the page loads
    // and whenever the handleSort function is updated (due to input or sort type change).
    useEffect(() => {
        handleSort();
    }, [handleSort]);

    return (
        <div className="chapter-page-sort">
            <header className="sort-header">
                <h1>Chapter 4: Simple Sorting</h1>
                <p>Visualize classic O(N²) sorting algorithms. Enter a comma-separated list of numbers and press "Sort" to see how they work step by step.</p>
            </header>
            
            <SortingControls 
                sortType={sortType}
                setSortType={setSortType}
                arrayInput={arrayInput}
                setArrayInput={setArrayInput}
                handleSort={handleSort}
            />

            <div className="sort-content-area">
                <div className="visualizer-container">
                    <SortingVisualizer history={history} sortType={sortType} />
                </div>
                <div className="code-display-container-sort">
                    <SortingCodeDisplay sortType={sortType} />
                </div>
            </div>
        </div>
    );
};

export default SimpleSortPage;