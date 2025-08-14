import React from 'react';

const MultiplicationControls = ({
    algoType, setAlgoType, num1, setNum1, num2, setNum2, onCalculate
}) => {
    return (
        <div className="sort-controls">
            <select onChange={(e) => setAlgoType(e.target.value)} value={algoType}>
                <option value="aLaRusse">À La Russe</option>
                <option value="divideAndConquer">Divide and Conquer</option>
            </select>
            <input
                type="text"
                className="array-input"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder="First number"
            />
            <span>*</span>
            <input
                type="text"
                className="array-input"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder="Second number"
            />
            <button onClick={onCalculate}>Calculate</button>
        </div>
    );
};

export default MultiplicationControls;