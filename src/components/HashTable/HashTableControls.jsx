import React, { useState } from 'react';

const StepNavigator = ({ steps, current, isPlaying, onStep, onPlayPause, onReset }) => {
    return (
        <div className="step-navigator">
            <button onClick={() => onStep(current - 1)} disabled={current === 0}>{"<"}</button>
            <span>{current + 1} / {steps.length}</span>
            <button onClick={() => onStep(current + 1)} disabled={current >= steps.length - 1}>{">"}</button>
            <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={onReset}>Done</button>
        </div>
    )
};


const HashTableControls = ({ 
    onInsert, onFind, strategy, setStrategy, setOperation, 
    isAnimating, isAnimationActive, onReset,
    animationSteps, currentStep, isPlaying, togglePlay, goToStep
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleInsert = () => {
        if (isAnimationActive) onReset();
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            onInsert(value);
            setInputValue('');
        }
    };
    
    return (
        <div className="controls-panel">
            <div className="control-grid">
                <div className="control-row">
                    <label htmlFor="strategy-select">Collision Strategy:</label>
                    <select id="strategy-select" value={strategy} onChange={(e) => setStrategy(e.target.value)} disabled={isAnimationActive}>
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
                        disabled={isAnimationActive}
                    />
                </div>
                <div className="control-row action-buttons">
                    <button onClick={handleInsert} onFocus={() => setOperation('insert')} disabled={inputValue === ''}>Insert</button>
                    <button onClick={() => {}} onFocus={() => setOperation('find')} disabled={true}>Find</button>
                </div>
                 {isAnimationActive && (
                    <div className="control-row">
                        <StepNavigator 
                            steps={animationSteps} 
                            current={currentStep}
                            isPlaying={isPlaying}
                            onStep={goToStep} 
                            onPlayPause={togglePlay}
                            onReset={onReset}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HashTableControls;