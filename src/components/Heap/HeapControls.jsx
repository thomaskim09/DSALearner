import React, { useState } from 'react';
import { RefreshIcon, TrashIcon } from '../common/Icons';

const HeapControls = ({
    onInsert, onRemove, onClear, onRefresh, isAnimating, setOperation,
    heapsortInput, setHeapsortInput, onHeapsort
}) => {
    const [insertValue, setInsertValue] = useState('');

    const handleInsert = () => {
        if (insertValue !== '') {
            onInsert(Number(insertValue));
            setInsertValue('');
        }
    };

    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="utility-buttons">
                    <button onClick={onRefresh} disabled={isAnimating}><RefreshIcon/> Refresh</button>
                    <button onClick={onClear} disabled={isAnimating}><TrashIcon/> Clear</button>
                </div>
                <div className="control-group" onMouseEnter={() => setOperation('insert')}>
                    <input
                        type="number"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        placeholder="Enter value to insert"
                        disabled={isAnimating}
                    />
                    <button onClick={handleInsert} disabled={isAnimating || insertValue === ''}>Insert</button>
                </div>
                <div className="control-group" onMouseEnter={() => setOperation('remove')}>
                    <button onClick={onRemove} disabled={isAnimating}>Remove Max</button>
                </div>
                <div className="control-group" onMouseEnter={() => setOperation('heapSort')}>
                    <textarea
                        value={heapsortInput}
                        onChange={(e) => setHeapsortInput(e.target.value)}
                        placeholder="Enter comma-separated values for heapsort"
                        rows="3"
                        disabled={isAnimating}
                    />
                    <button onClick={onHeapsort} disabled={isAnimating || heapsortInput.trim() === ''}>Heapsort</button>
                </div>
            </div>
        </div>
    );
};

export default HeapControls;