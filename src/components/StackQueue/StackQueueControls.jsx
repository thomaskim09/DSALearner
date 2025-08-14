import React, { useState } from 'react';
import { RefreshIcon, TrashIcon } from '../common/Icons';

const StackQueueControls = ({
    type, onTypeChange, onPush, onPop, onEnqueue, onDequeue,
    onPEnqueue, onPDequeue, onClear, onReset, isAnimating, setHoveredOperation
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleAction = (action) => {
        if (inputValue.trim() !== '') {
            action(Number(inputValue));
            setInputValue('');
        }
    };

    const renderControls = () => {
        switch (type) {
            case 'stack':
                return (
                    <>
                        <button onMouseEnter={() => setHoveredOperation('push')} onClick={() => handleAction(onPush)} disabled={isAnimating || inputValue === ''}>Push</button>
                        <button onMouseEnter={() => setHoveredOperation('pop')} onClick={onPop} disabled={isAnimating}>Pop</button>
                    </>
                );
            case 'queue':
                return (
                    <>
                        <button onMouseEnter={() => setHoveredOperation('insert')} onClick={() => handleAction(onEnqueue)} disabled={isAnimating || inputValue === ''}>Enqueue</button>
                        <button onMouseEnter={() => setHoveredOperation('remove')} onClick={onDequeue} disabled={isAnimating}>Dequeue</button>
                    </>
                );
            case 'priorityQueue':
                 return (
                    <>
                        <button onMouseEnter={() => setHoveredOperation('insert')} onClick={() => handleAction(onPEnqueue)} disabled={isAnimating || inputValue === ''}>Insert</button>
                        <button onMouseEnter={() => setHoveredOperation('remove')} onClick={onPDequeue} disabled={isAnimating}>Remove Min</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="utility-buttons">
                    <button onClick={onReset} disabled={isAnimating}><RefreshIcon/> Reset</button>
                    <button onClick={onClear} disabled={isAnimating}><TrashIcon/> Clear</button>
                </div>
                <div className="control-group">
                    <label>Data Structure:</label>
                    <select value={type} onChange={(e) => onTypeChange(e.target.value)} disabled={isAnimating}>
                        <option value="stack">Stack</option>
                        <option value="queue">Queue</option>
                        <option value="priorityQueue">Priority Queue</option>
                    </select>
                </div>
                 <div className="control-group">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter a value"
                        disabled={isAnimating}
                    />
                </div>
                <div className="button-grid">
                    {renderControls()}
                </div>
            </div>
        </div>
    );
};

export default StackQueueControls;