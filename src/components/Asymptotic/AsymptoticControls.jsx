// DSALearner_packaged/src/components/Asymptotic/AsymptoticControls.jsx

import React, { useState, useEffect } from 'react';
import { normalizeInput, analyzeAsymptotic } from '../../utils/asymptoticNotation';
import '../../assets/styles/Asymptotic.css';

const AsymptoticControls = ({ input, setInput, onCalculate }) => {
    const [preview, setPreview] = useState('');
    const [isValid, setIsValid] = useState(true);

    // Update the preview and validity whenever the user types
    useEffect(() => {
        const normalized = normalizeInput(input);
        setPreview(normalized);

        // Check validity by doing a dry run of the analysis
        if (input.trim() === '') {
            setIsValid(true); // Treat empty as valid
        } else {
            // We use the non-normalized input for analysis, as the main function normalizes it again
            const analysisResult = analyzeAsymptotic(input);
            setIsValid(analysisResult.ok);
        }
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
                <button onClick={onCalculate} className="calculate-btn" disabled={!isValid || input.trim() === ''}>Calculate</button>
            </div>
            <div className={`normalized-preview ${!input.trim() ? '' : (isValid ? 'valid' : 'invalid')}`}>
                <strong>Normalized:</strong> <span>{preview || '...'}</span>
            </div>
        </div>
    );
};

export default AsymptoticControls;