import React, { useState } from 'react';

const LinkedListControls = ({ listType, setListType, onInsertFirst, onDeleteFirst, onInsertLast, onDeleteByKey, onFind, isAnimating }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAction = (action) => {
        if (inputValue !== '') {
            action(Number(inputValue));
            setInputValue('');
        }
    };
    
    const handleKeyDown = (e, action) => {
        if (e.key === 'Enter') {
          handleAction(action);
        }
    };

    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="control-row">
                    <label htmlFor="list-type-select">List Type:</label>
                    <select id="list-type-select" value={listType} onChange={(e) => setListType(e.target.value)} disabled={isAnimating}>
                        <option value="Singly-Linked">Singly-Linked</option>
                        <option value="Doubly-Linked">Doubly-Linked</option>
                    </select>
                </div>
                <div className="control-row">
                    <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => handleKeyDown(e, onInsertFirst)} placeholder="Enter value" disabled={isAnimating} />
                    <button onClick={() => handleAction(onInsertFirst)} disabled={isAnimating || inputValue === ''}>Insert First</button>
                    <button onClick={() => handleAction(onInsertLast)} disabled={isAnimating || inputValue === ''}>Insert Last</button>
                    <button onClick={() => handleAction(onFind)} disabled={isAnimating || inputValue === ''}>Find</button>
                    <button onClick={() => handleAction(onDeleteByKey)} disabled={isAnimating || inputValue === ''}>Delete Key</button>
                    <button onClick={onDeleteFirst} disabled={isAnimating}>Delete First</button>
                </div>
            </div>
        </div>
    );
};

export default LinkedListControls;