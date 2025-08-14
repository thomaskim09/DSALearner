import React from 'react';

const AsymptoticBreakdown = ({ analysis }) => {
    if (!analysis) {
        return (
            <div className="code-display">
                <pre>Enter a function and click Calculate to see the breakdown.</pre>
            </div>
        );
    }
    if (!analysis.ok) {
        return <div className="code-display"><pre>{analysis.error}</pre></div>;
    }
    return (
        <div className="code-display">
            <pre>
{`# Step-by-step Breakdown

## Original
${analysis.steps[0]}

## Simplified Terms
${analysis.simplifiedTerms.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Dominant Term
${analysis.dominant}

## Big O
${analysis.bigO}`}
            </pre>
        </div>
    );
};

export default AsymptoticBreakdown;


