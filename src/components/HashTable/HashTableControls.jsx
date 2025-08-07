import React, { useState } from 'react';

const HashTableControls = ({ onInsert, onFind, strategy, setStrategy, setOperation }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInsert = () => {
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            onInsert(value);
            setInputValue('');
        }
    };
    
    const handleFind = () => {
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            onFind(value);
            setInputValue('');
        }
    };
    
    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="control-row">
                    <label htmlFor="strategy-select">Collision Strategy:</label>
                    <select id="strategy-select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                        <option value="linear-probing">Linear Probing</option>
                        <option value="quadratic-probing">Quadratic Probing</option>
                        <option value="double-hashing">Double Hashing</option>
                        <option value="separate-chaining">Separate Chaining</option>
                    </select>
                </div>
                <div className="control-row">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter a number"
                    />
                </div>
                <div className="control-row button-grid">
                    <button onClick={handleInsert} onFocus={() => setOperation('insert')}>Insert</button>
                    <button onClick={handleFind} onFocus={() => setOperation('find')}>Find</button>
                </div>
            </div>
        </div>
    );
};

export default HashTableControls;