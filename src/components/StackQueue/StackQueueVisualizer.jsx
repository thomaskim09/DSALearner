import React from 'react';

const StackQueueVisualizer = ({ data }) => {
    const { type, array, top, front, rear, nItems, highlights = {} } = data;

    const renderPointer = (name, index) => (
        <div className={`sq-pointer ${name.toLowerCase()}-pointer`} style={{ left: `calc(${index * 10}% + 5%)` }}>
            {name}
        </div>
    );

    return (
        <div className="stack-queue-visualizer">
            <div className="sq-array">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`sq-cell ${highlights.compare === index ? 'comparing' : ''} ${highlights.shift === index ? 'shifting' : ''} ${highlights.insert === index ? 'inserting' : ''} ${highlights.remove === index ? 'removing' : ''}`}
                    >
                        <div className="sq-cell-value">
                            {value !== null ? value : ''}
                        </div>
                        <div className="sq-cell-index">{index}</div>
                    </div>
                ))}
            </div>
            <div className="sq-pointers">
                {type === 'stack' && top > -1 && renderPointer('Top', top)}
                {type === 'queue' && nItems > 0 && renderPointer('Front', front)}
                {type === 'queue' && nItems > 0 && renderPointer('Rear', rear)}
            </div>
             <div className="visualizer-status-message">
                {data.message}
            </div>
        </div>
    );
};

export default StackQueueVisualizer;