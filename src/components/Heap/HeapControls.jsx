import React, { useState } from 'react';
import { RefreshIcon, TrashIcon } from '../common/Icons';

const HeapControls = ({
    onInsert, onRemove, onClear, onRefresh, isAnimating, setOperation,
    heapsortInput, setHeapsortInput, onHeapsort, onChange,
    visualizationMode, setVisualizationMode, onHeapify
}) => {
    const [insertValue, setInsertValue] = useState('');
    const [oldValue, setOldValue] = useState('');
    const [newValue, setNewValue] = useState('');

    const handleInsert = () => {
        if (insertValue !== '') {
            onInsert(Number(insertValue));
            setInsertValue('');
        }
    };

    const handleChange = () => {
        if (oldValue !== '' && newValue !== '') {
            onChange(Number(oldValue), Number(newValue));
            setOldValue('');
            setNewValue('');
        }
    };

    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="utility-buttons">
                    <button onClick={onRefresh} disabled={isAnimating}><RefreshIcon/> Refresh</button>
                    <button onClick={onClear} disabled={isAnimating}><TrashIcon/> Clear</button>
                </div>
                <div className="control-group">
                    <label htmlFor="vis-mode-select">Visualization Mode:</label>
                    <select id="vis-mode-select" value={visualizationMode} onChange={(e) => setVisualizationMode(e.target.value)}>
                        <option value="tree">Tree</option>
                        <option value="table">Table</option>
                    </select>
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
                <div className="control-group" onMouseEnter={() => setOperation('change')}>
                    <input
                        type="number"
                        value={oldValue}
                        onChange={(e) => setOldValue(e.target.value)}
                        placeholder="Old value"
                        disabled={isAnimating}
                    />
                    <input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="New value"
                        disabled={isAnimating}
                    />
                    <button onClick={handleChange} disabled={isAnimating || oldValue === '' || newValue === ''}>Change</button>
                </div>
                 <div className="control-group">
                    <button onClick={onHeapify} disabled={isAnimating}>Rearrange to Heap</button>
                </div>
                <div className="control-group" onMouseEnter={() => setOperation('heapSort')}>
                    <textarea
                        value={heapsortInput}
                        onChange={(e) => setHeapsortInput(e.target.value)}
                        placeholder="e.g., 88 67 99 22 or 88, 67, 99, 22"
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