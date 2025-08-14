import React, { useState, useEffect } from 'react';
import { normalizeInput } from '../../utils/asymptoticNotation'; // Import the updated normalizer
import '../../assets/styles/Asymptotic.css';

const AsymptoticControls = ({ input, setInput, onCalculate }) => {
    const [preview, setPreview] = useState('');

    // Update the preview whenever the user types
    useEffect(() => {
        const normalized = normalizeInput(input);
        setPreview(normalized);
    }, [input]);

    return (
        <div className="asymptotic-controls-container">
            <h3>Analyze a Function</h3>
            <p>Enter a function t(n) to find its Big O complexity class. The parser supports standard mathematical operations, including powers (n^2), logarithms (log(n)), and multiplication (2*n or 2n).</p>
            <div className="input-group">
                <input
                    type="text"
                    className="asymptotic-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., t(n) = 3n^2 + 5n*log(n) + 100"
                />
                <button onClick={onCalculate} className="calculate-btn">Calculate</button>
            </div>
            <div className="normalized-preview">
                <strong>Normalized:</strong> <span>{preview || '...'}</span>
            </div>
        </div>
    );
};

export default AsymptoticControls;