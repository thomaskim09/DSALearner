import React from 'react';

const AsymptoticTrace = ({ steps }) => {
    return (
        <div className="tracelog-container">
            <h3 className="tracelog-header">Calculation Steps</h3>
            <div className="tracelog-list-container">
                {steps && steps.length > 0 ? (
                    <ul className="tracelog-list">
                        {steps.map((s, i) => (
                            <li key={i} className="tracelog-item">
                                <span className="step-number">{i + 1}.</span>
                                <span className="step-message">{s.message}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="tracelog-placeholder">
                        Enter t(n) and click Calculate to view steps.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AsymptoticTrace;


