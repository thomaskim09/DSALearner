import React from 'react';

const operationsMap = {
    'Singly-Linked': ['insertFirst', 'deleteFirst', 'find', 'delete'],
    'Double-Ended': ['insertFirst', 'insertLast', 'deleteFirst'],
    'Sorted': ['insert', 'remove'],
    'Doubly-Linked': ['insertFirst', 'insertLast', 'insertAfter', 'deleteKey', 'deleteFirst', 'deleteLast']
};

const operationLabels = {
    insertFirst: 'Insert First',
    deleteFirst: 'Delete First',
    find: 'Find',
    delete: 'Delete by Key',
    insertLast: 'Insert Last',
    insert: 'Insert (Sorted)',
    remove: 'Remove First',
    insertAfter: 'Insert After',
    deleteKey: 'Delete by Key',
    deleteLast: 'Delete Last'
};


const LinkedListControls = ({ listType, setListType, setOperation, isAnimating }) => {
    const handleListTypeChange = (e) => {
        const newType = e.target.value;
        setListType(newType);
        // Reset to the first operation of the new type
        setOperation(operationsMap[newType][0]);
    };

    return (
        <div className="controls-panel">
            <div className="control-group">
                <label htmlFor="list-type-select">List Type:</label>
                <select id="list-type-select" value={listType} onChange={handleListTypeChange} disabled={isAnimating}>
                    <option value="Singly-Linked">Singly-Linked</option>
                    <option value="Double-Ended">Double-Ended</option>
                    <option value="Sorted">Sorted</option>
                    <option value="Doubly-Linked">Doubly-Linked</option>
                </select>
            </div>
            <div className="control-group">
                <label>Operations:</label>
                <div className="operation-buttons">
                    {operationsMap[listType].map(op => (
                        <button key={op} onClick={() => setOperation(op)} disabled={isAnimating}>
                            {operationLabels[op] || op}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LinkedListControls;