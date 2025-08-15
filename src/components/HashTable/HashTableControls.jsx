import React, { useState, useEffect } from 'react';
import { isHash2FormulaValid } from '../../utils/formulaValidator';

const HashTableControls = ({
    onInsert, onFind, onDelete, onBatchInsert, batchInput, setBatchInput, strategy, setStrategy,
    prime, setPrime, tableSize, setTableSize, setOperation,
    isAnimationActive, onReset, chainOrder, setChainOrder,
    hash2Formula, setHash2Formula
}) => {
    const [insertValue, setInsertValue] = useState('');
    const [findValue, setFindValue] = useState('');
    const [deleteValue, setDeleteValue] = useState('');
    const [isFormulaValid, setIsFormulaValid] = useState(true);

    useEffect(() => {
        if (strategy === 'double-hashing') {
            setIsFormulaValid(isHash2FormulaValid(hash2Formula));
        } else {
            setIsFormulaValid(true);
        }
    }, [hash2Formula, strategy]);

    const handleAction = (action, value, setValue) => {
        if (isAnimationActive || !isFormulaValid) return;
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
                    <>
                        <div className="control-group">
                            <label htmlFor="prime-input">Double Hash Prime:</label>
                            <input id="prime-input" type="number" min="1" value={prime} onChange={(e) => setPrime(parseInt(e.target.value, 10) || 1)} disabled={isAnimationActive}/>
                        </div>
                        <div className="control-group">
                            <label htmlFor="hash2-formula-input">Hash Function 2 (hashFunc2):</label>
                            <input
                                id="hash2-formula-input"
                                type="text"
                                value={hash2Formula}
                                onChange={(e) => setHash2Formula(e.target.value)}
                                disabled={isAnimationActive}
                                placeholder="e.g., prime - (key % prime)"
                                className={isFormulaValid ? 'valid-formula' : 'invalid-formula'}
                            />
                        </div>
                    </>
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
                    <textarea id="batch-input" className="batch-input-textarea" value={batchInput} onChange={(e) => setBatchInput(e.target.value)} rows="3" disabled={isAnimationActive} placeholder="e.g., 88 67 99 22 or 88, 67, 99, 22"/>
                </div>

                <div className="control-group">
                    <label>Animate Operations:</label>
                    <div className="input-with-button" onFocus={() => setOperation('insert')}>
                        <input id="insert-input" type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Enter value..." disabled={isAnimationActive}/>
                        <button className="action-btn" onClick={() => handleAction(onInsert, insertValue, setInsertValue)} disabled={insertValue === '' || isAnimationActive || !isFormulaValid}>Insert</button>
                    </div>
                     <div className="input-with-button" onFocus={() => setOperation('find')}>
                        <input id="find-input" type="number" value={findValue} onChange={(e) => setFindValue(e.target.value)} placeholder="Enter value..." disabled={isAnimationActive}/>
                        <button className="action-btn" onClick={() => handleAction(onFind, findValue, setFindValue)} disabled={findValue === '' || isAnimationActive || !isFormulaValid}>Find</button>
                    </div>
                     <div className="input-with-button" onFocus={() => setOperation('delete')}>
                        <input id="delete-input" type="number" value={deleteValue} onChange={(e) => setDeleteValue(e.target.value)} placeholder="Enter value..." disabled={isAnimationActive}/>
                        <button className="action-btn" onClick={() => handleAction(onDelete, deleteValue, setDeleteValue)} disabled={deleteValue === '' || isAnimationActive || !isFormulaValid}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HashTableControls;