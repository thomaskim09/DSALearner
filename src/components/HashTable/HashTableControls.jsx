import React, { useState } from 'react';

const HashTableControls = ({ 
    onInsert, onFind, onDelete, onBatchInsert, batchInput, setBatchInput, strategy, setStrategy, 
    prime, setPrime, tableSize, setTableSize, setOperation, 
    isAnimationActive, onReset, chainOrder, setChainOrder
}) => {
    const [insertValue, setInsertValue] = useState('');
    const [findValue, setFindValue] = useState('');
    const [deleteValue, setDeleteValue] = useState('');

    const handleAction = (action, value, setValue) => {
        if (isAnimationActive) onReset();
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            action(numValue);
            setValue('');
        }
    };
    
    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="control-group">
                    <label htmlFor="strategy-select">Collision Strategy:</label>
                    <select id="strategy-select" value={strategy} onChange={(e) => setStrategy(e.target.value)} disabled={isAnimationActive}>
                        <option value="linear-probing">Linear Probing</option>
                        <option value="quadratic-probing">Quadratic Probing</option>
                        <option value="double-hashing">Double Hashing</option>
                        <option value="separate-chaining">Separate Chaining</option>
                    </select>
                </div>
                <div className="control-group">
                    <label htmlFor="tablesize-input">Table Size (Modulus):</label>
                    <input id="tablesize-input" type="number" min="1" value={tableSize} onChange={(e) => setTableSize(Math.max(1, parseInt(e.target.value, 10) || 1))} disabled={isAnimationActive}/>
                </div>
                {strategy === 'double-hashing' && (
                    <div className="control-group">
                        <label htmlFor="prime-input">Double Hash Prime:</label>
                        <input id="prime-input" type="number" min="1" value={prime} onChange={(e) => setPrime(parseInt(e.target.value, 10) || 1)} disabled={isAnimationActive}/>
                    </div>
                )}
                {strategy === 'separate-chaining' && (
                    <div className="control-group">
                        <label htmlFor="order-select">Chain Order:</label>
                        <select id="order-select" value={chainOrder} onChange={(e) => setChainOrder(e.target.value)} disabled={isAnimationActive}>
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </div>
                )}
                <div className="control-group">
                    <label htmlFor="batch-input">Batch Insert:</label>
                    <textarea id="batch-input" className="batch-input-textarea" value={batchInput} onChange={(e) => setBatchInput(e.target.value)} rows="3" disabled={isAnimationActive}/>
                    <button onClick={onBatchInsert} disabled={isAnimationActive} className="batch-insert-btn">Insert All</button>
                </div>

                <div className="control-group">
                    <label>Animate Operations:</label>
                    <div className="input-with-button" onFocus={() => setOperation('insert')}>
                        <input id="insert-input" type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Enter value..." disabled={isAnimationActive}/>
                        <button className="action-btn" onClick={() => handleAction(onInsert, insertValue, setInsertValue)} disabled={insertValue === '' || isAnimationActive}>Insert</button>
                    </div>
                     <div className="input-with-button" onFocus={() => setOperation('find')}>
                        <input id="find-input" type="number" value={findValue} onChange={(e) => setFindValue(e.target.value)} placeholder="Enter value..." disabled={isAnimationActive}/>
                        <button className="action-btn" onClick={() => handleAction(onFind, findValue, setFindValue)} disabled={findValue === '' || isAnimationActive}>Find</button>
                    </div>
                     <div className="input-with-button" onFocus={() => setOperation('delete')}>
                        <input id="delete-input" type="number" value={deleteValue} onChange={(e) => setDeleteValue(e.target.value)} placeholder="Enter value..." disabled={isAnimationActive}/>
                        <button className="action-btn" onClick={() => handleAction(onDelete, deleteValue, setDeleteValue)} disabled={deleteValue === '' || isAnimationActive}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HashTableControls;