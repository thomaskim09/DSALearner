import React, { useState, useCallback, useEffect } from 'react';
import { useMultiplication } from '../hooks/useMultiplication';
import MultiplicationControls from '../components/Multiplication/MultiplicationControls';
import MultiplicationVisualizer from '../components/Multiplication/MultiplicationVisualizer';
import MultiplicationCodeDisplay from '../components/Multiplication/MultiplicationCodeDisplay';
import '../assets/styles/Multiplication.css';

const MultiplicationPage = () => {
    const [algoType, setAlgoType] = useState('aLaRusse');
    const [num1, setNum1] = useState('146');
    const [num2, setNum2] = useState('37');
    const { history, calculate, setHistory } = useMultiplication();

    const handleCalculate = useCallback(() => {
        const n1 = num1.replace(/[^0-9]/g, '');
        const n2 = num2.replace(/[^0-9]/g, '');
        if (n1 && n2) {
            calculate(n1, n2, algoType);
        }
    }, [num1, num2, algoType, calculate]);

    useEffect(() => {
        // THE FIX: Clear history when algorithm changes to prevent rendering errors
        setHistory(null); 
        if (algoType === 'divideAndConquer') {
            setNum1('687902358769');
            setNum2('998767346121');
        } else {
            setNum1('146');
            setNum2('37');
        }
    }, [algoType, setHistory]);


    return (
        <div className="chapter-page-sort">
            <MultiplicationControls
                algoType={algoType}
                setAlgoType={setAlgoType}
                num1={num1}
                setNum1={setNum1}
                num2={num2}
                setNum2={setNum2}
                onCalculate={handleCalculate}
            />

            <div className="sort-content-area">
                <div className="visualizer-container">
                    <MultiplicationVisualizer history={history} algoType={algoType} />
                </div>
                <div className="code-display-container-sort">
                    <MultiplicationCodeDisplay algoType={algoType} />
                </div>
            </div>
        </div>
    );
};

export default MultiplicationPage;