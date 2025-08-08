import React, { useState } from 'react';
import { RefreshIcon, TrashIcon } from '../common/Icons';

const StepNavigator = ({ steps, current, isPlaying, onStep, onPlayPause, onRestart, onClose }) => {
    return (
        <div className="step-navigator">
            <button onClick={() => onStep(current - 1)} disabled={current === 0}>{"<"}</button>
            <button onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={() => onStep(current + 1)} disabled={current >= steps.length - 1}>{">"}</button>
            <button onClick={onRestart}>Restart</button>
            <button onClick={onClose} className="close-btn">Close</button>
        </div>
    )
};

const HeapControls = ({
    onInsert, onRemove, onClear, onRefresh, isAnimating, setOperation,
    animationSteps, currentStep, isPlaying, togglePlay, goToStep, onRestart, onClose
}) => {
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
                <div className="utility-buttons">
                    <button onClick={onRefresh} disabled={isAnimating}><RefreshIcon/> Refresh</button>
                    <button onClick={onClear} disabled={isAnimating}><TrashIcon/> Clear</button>
                </div>
                <div className="control-group" onMouseEnter={() => setOperation('insert')}>
                    <input
                        type="number"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        placeholder="Enter value to insert"
                        disabled={isAnimating}
                    />
                    <button onClick={handleInsert} disabled={isAnimating || insertValue === ''}>Insert</button>
                </div>
                <div className="control-group" onMouseEnter={() => setOperation('remove')}>
                    <button onClick={onRemove} disabled={isAnimating}>Remove Max</button>
                </div>

                {isAnimating && (
                    <div className="control-group">
                        <label>Animation Controls:</label>
                        <StepNavigator
                            steps={animationSteps} current={currentStep}
                            isPlaying={isPlaying} onStep={goToStep}
                            onPlayPause={togglePlay} onRestart={onRestart}
                            onClose={onClose}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeapControls;