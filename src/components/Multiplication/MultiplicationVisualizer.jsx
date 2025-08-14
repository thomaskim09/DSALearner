import React from 'react';

const AlaRusseVisualizer = ({ steps, result, keptValues }) => (
    <div className="ala-russe-container">
        <p className="algo-explanation">
            Keep the right-hand value for the sum whenever the left-hand value is <strong>odd</strong>.
        </p>
        <table className="multiplication-table">
            <thead>
                <tr>
                    <th>Halve</th>
                    <th>Double</th>
                    <th>Odd? Keep</th>
                </tr>
            </thead>
            <tbody>
                {steps.map((step, index) => (
                    <tr key={index} className={step.isOdd ? 'odd-row' : ''}>
                        <td>{new Intl.NumberFormat().format(BigInt(step.left))}</td>
                        <td>{new Intl.NumberFormat().format(BigInt(step.right))}</td>
                        <td>{step.isOdd ? '✔️' : ''}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="sum-equation">
            {keptValues.map(v => new Intl.NumberFormat().format(BigInt(v))).join(' + ')} = <strong>{new Intl.NumberFormat().format(BigInt(result))}</strong>
        </div>
    </div>
);

const DivideAndConquerVisualizer = ({ steps, result }) => {
    const formatTermLine = (termValue, padding) => {
        const formattedVal = new Intl.NumberFormat().format(BigInt(termValue));
        const dashes = '-'.repeat(padding);
        return `${formattedVal}${dashes}`;
    };

    return (
        <div className="divide-conquer-container">
            {steps.map((step, index) => (
                <div key={index} className="dc-step-container">
                    {/* Left Column */}
                    <div className="dc-left-column">
                        <p className="dc-main-problem">
                           Solving: {new Intl.NumberFormat().format(BigInt(step.left))} * {new Intl.NumberFormat().format(BigInt(step.right))}
                        </p>
                        <div className="dc-sub-problems">
                            {step.subProblems?.map((sub, subIndex) => (
                                <p key={subIndex}>
                                    {new Intl.NumberFormat().format(BigInt(sub.left))} * {new Intl.NumberFormat().format(BigInt(sub.right))} = {new Intl.NumberFormat().format(BigInt(sub.result))}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (with bug fix) */}
                    <div className="dc-right-column">
                        {step.terms && step.terms.length > 0 && (
                            <pre className="dc-adding-equation">
                                {formatTermLine(step.terms[0].value, step.terms[0].padding)}
                                <br />
                                {formatTermLine(step.terms[1].value, step.terms[1].padding)}
                                <br />
                                {formatTermLine(step.terms[2].value, step.terms[2].padding)}
                                <br />
                                + {formatTermLine(step.terms[3].value, step.terms[3].padding)}
                                <hr className="dc-hr" />
                                {new Intl.NumberFormat().format(BigInt(step.result))}
                            </pre>
                        )}
                    </div>
                </div>
            ))}
            <div className="final-result large">
                <strong>Final Result: {new Intl.NumberFormat().format(BigInt(result))}</strong>
            </div>
        </div>
    );
};


const MultiplicationVisualizer = ({ history, algoType }) => {
    if (!history || !history.steps || history.steps.length === 0) {
        return <div className="visualizer-placeholder">Click "Calculate" to see the steps.</div>;
    }

    if (algoType === 'aLaRusse') {
        return <AlaRusseVisualizer steps={history.steps} result={history.result} keptValues={history.keptValues} />;
    }

    if (algoType === 'divideAndConquer') {
        return <DivideAndConquerVisualizer steps={history.steps} result={history.result} />;
    }

    return null;
};

export default MultiplicationVisualizer;