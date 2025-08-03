import React, { useState } from 'react';

const LinkedListControls = ({
    listType, setListType, onInsertFirst, onDeleteFirst,
    onInsertLast, onDeleteByKey, onFind, isAnimating, onHover
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleAction = (action) => {
        if (inputValue !== '') {
            action(Number(inputValue));
            setInputValue('');
        }
    };

    return (
        <div className="controls-panel" onMouseLeave={() => onHover('insertFirst')}> {/* Default on leaving panel */}
            <div className="control-grid">
                <div className="control-row">
                    <label htmlFor="list-type-select">List Type:</label>
                    <select id="list-type-select" value={listType} onChange={(e) => setListType(e.target.value)} disabled={isAnimating}>
                        <option value="Singly-Linked">Singly-Linked</option>
                        <option value="Double-Ended">Double-Ended</option>
                        <option value="Sorted">Sorted</option>
                        <option value="Doubly-Linked">Doubly-Linked</option>
                    </select>
                </div>
                <div className="control-row">
                    <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter value" disabled={isAnimating} />
                </div>
                <div className="control-row button-grid">
                    <button onMouseEnter={() => onHover('insertFirst')} onClick={() => handleAction(onInsertFirst)} disabled={isAnimating}>Insert First</button>
                    <button onMouseEnter={() => onHover('insertLast')} onClick={() => handleAction(onInsertLast)} disabled={isAnimating}>Insert Last</button>
                    <button onMouseEnter={() => onHover('find')} onClick={() => handleAction(onFind)} disabled={isAnimating}>Find</button>
                    <button onMouseEnter={() => onHover('delete')} onClick={() => handleAction(onDeleteByKey)} disabled={isAnimating}>Delete Key</button>
                    <button onMouseEnter={() => onHover('deleteFirst')} onClick={onDeleteFirst} disabled={isAnimating}>Delete First</button>
                </div>
            </div>
        </div>
    );
};

export default LinkedListControls;