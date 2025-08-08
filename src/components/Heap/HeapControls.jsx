import React, { useState } from 'react';

const HeapControls = ({ onInsert, onRemove, onClear, onRefresh, isAnimating, setOperation }) => {
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
                <div className="control-group" onFocus={() => setOperation('insert')}>
                    <input
                        type="number"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        placeholder="Enter value to insert"
                        disabled={isAnimating}
                    />
                    <button onClick={handleInsert} disabled={isAnimating || insertValue === ''}>Insert</button>
                </div>
                <div className="control-group" onFocus={() => setOperation('remove')}>
                    <button onClick={onRemove} disabled={isAnimating}>Remove Max</button>
                </div>
                <div className="control-group">
                    <button onClick={onRefresh} disabled={isAnimating}>Refresh</button>
                    <button onClick={onClear} disabled={isAnimating}>Clear</button>
                </div>
            </div>
        </div>
    );
};

export default HeapControls;