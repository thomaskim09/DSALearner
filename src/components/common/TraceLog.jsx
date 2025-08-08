import React from 'react';
import '../../assets/styles/TraceLog.css';

const TraceLog = ({ steps, onHover, currentStep }) => {
    return (
        <div className="tracelog-container">
            <h3 className="tracelog-header">Animation Trace</h3>
            <div className="tracelog-list-container">
                {steps.length > 0 ? (
                    <ul className="tracelog-list">
                        {steps.map((step, index) => (
                            <li
                                key={index}
                                onMouseEnter={() => onHover(index)}
                                className={`tracelog-item ${currentStep === index ? 'active' : ''}`}
                            >
                                <span className="step-number">{index + 1}.</span>
                                <span className="step-message">{step.message}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="tracelog-placeholder">
                        Perform an operation to see the trace.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TraceLog;