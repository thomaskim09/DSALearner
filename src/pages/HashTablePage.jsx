import React, { useState, useEffect, useCallback } from 'react';
import HashTableControls from '../components/HashTable/HashTableControls';
import HashTableVisualizer from '../components/HashTable/HashTableVisualizer';
import HashTableCodeDisplay from '../components/HashTable/HashTableCodeDisplay';
import HashTableCalculationTrace from '../components/HashTable/HashTableCalculationTrace';
import TraceLog from '../components/common/TraceLog';
import { useHashTable } from '../hooks/useHashTable';
import '../assets/styles/HashTable.css';
import { isHash2FormulaValid } from '../utils/formulaValidator'; // Import the validator

const HashTablePage = () => {
    const [tableSize, setTableSize] = useState(11);
    const [prime, setPrime] = useState(7);
    const [collisionStrategy, setCollisionStrategy] = useState('double-hashing');
    const [batchInput, setBatchInput] = useState('148, 498, 224, 212, 156, 138, 36, 448, 669');
    const [chainOrder, setChainOrder] = useState('ascending');
    const [insertedData, setInsertedData] = useState([]);
    const [hash2Formula, setHash2Formula] = useState('prime - (key % prime)');

    const {
        table, runOperation,
        animationSteps, currentStep,
        isPlaying, togglePlay, goToStep, resetAnimation, setTable,
    } = useHashTable(collisionStrategy, tableSize, prime, chainOrder, hash2Formula);

    const [operation, setOperation] = useState('insert');
    const isAnimationPlaying = isPlaying;

    // This is the single, safe evaluator function.
    const evaluateSafeFormula = useCallback((formula, key, p) => {
        if (!isHash2FormulaValid(formula)) return 1; // Safeguard
        try {
            // This is the correct and safe way to evaluate the expression.
            const result = new Function('key', 'prime', `return ${formula}`)(key, p);
            const step = Math.abs(Math.floor(result));
            return step > 0 ? step : 1; // Prevent zero step size, which causes infinite loops.
        } catch (e) {
            console.error("Formula evaluation error:", e);
            return 1; // Default to 1 on any error.
        }
    }, []);

    const populateTableFromValues = useCallback((values, strategy, size, p, order, formula) => {
        const newTable = strategy === 'separate-chaining'
            ? Array.from({ length: size }, () => [])
            : Array(size).fill(null);

        const localHash = (k) => k % size;
        // Use the safe, useCallback-wrapped evaluator here.
        const h2 = (key, primeValue) => evaluateSafeFormula(formula, key, primeValue);

        values.forEach(val => {
            let index = localHash(val);
            if (strategy === 'separate-chaining') {
                if (!newTable[index].some(item => item.key === val)) {
                    newTable[index].push({key: val, isDeleted: false});
                    newTable[index].sort((a, b) => order === 'ascending' ? a.key - b.key : b.key - a.key);
                }
            } else {
                let i = 0;
                while (newTable[index] !== null && i < size) {
                    i++;
                    if (strategy === 'linear-probing') index = (localHash(val) + i) % size;
                    else if (strategy === 'quadratic-probing') index = (localHash(val) + i * i) % size;
                    else index = (localHash(val) + i * h2(val, p)) % size; // Correctly call h2
                }
                if (newTable[index] === null) newTable[index] = {key: val, isDeleted: false};
            }
        });
        setTable(newTable);
    }, [setTable, evaluateSafeFormula]);

    const handleBatchInsert = useCallback(() => {
        // Prevent batch insert if the formula is invalid.
        if (collisionStrategy === 'double-hashing' && !isHash2FormulaValid(hash2Formula)) {
            return;
        }
        resetAnimation();
        const values = batchInput.split(/[,\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        
        const traceData = values.map(key => ({
            key,
            hash: key % tableSize,
            hash2: collisionStrategy === 'double-hashing' ? evaluateSafeFormula(hash2Formula, key, prime) : null
        }));
        
        setInsertedData(traceData);
        populateTableFromValues(values, collisionStrategy, tableSize, prime, chainOrder, hash2Formula);
    }, [batchInput, collisionStrategy, tableSize, prime, chainOrder, hash2Formula, resetAnimation, populateTableFromValues, evaluateSafeFormula]);

    const handleStepHover = (index) => {
        if (animationSteps.length > 0) {
            goToStep(index);
        }
    };

    // This effect runs the batch insert automatically when parameters change.
    useEffect(() => {
        handleBatchInsert();
    }, [collisionStrategy, tableSize, prime, chainOrder, hash2Formula, handleBatchInsert]);


    return (
        <div className="chapter-page hash-table-page">
            <div className="interactive-area">
                <div className="hash-table-control-container">
                    <HashTableControls
                        onInsert={(val) => runOperation(val, 'insert')}
                        onFind={(val) => runOperation(val, 'find')}
                        onDelete={(val) => runOperation(val, 'delete')}
                        onBatchInsert={handleBatchInsert}
                        batchInput={batchInput}
                        setBatchInput={setBatchInput}
                        strategy={collisionStrategy}
                        setStrategy={setCollisionStrategy}
                        prime={prime}
                        setPrime={setPrime}
                        tableSize={tableSize}
                        setTableSize={setTableSize}
                        setOperation={setOperation}
                        isAnimationActive={isAnimationPlaying}
                        onReset={resetAnimation}
                        chainOrder={chainOrder}
                        setChainOrder={setChainOrder}
                        hash2Formula={hash2Formula}
                        setHash2Formula={setHash2Formula}
                    />
                </div>
                <div className="hash-table-calculation-container">
                    <HashTableCalculationTrace insertedData={insertedData} tableSize={tableSize} hash2Formula={hash2Formula} prime={prime} />
                </div>

                <div className="hash-table-visualizer-container">
                    <HashTableVisualizer
                        table={table}
                        animationSteps={animationSteps}
                        currentStep={currentStep}
                        strategy={collisionStrategy}
                    />
                </div>

                <div className="hash-table-tracelog-container">
                    <TraceLog
                        steps={animationSteps}
                        onHover={handleStepHover}
                        currentStep={currentStep}
                    />
                </div>

                <div className="hash-table-code-container">
                    <HashTableCodeDisplay
                        operation={operation}
                        strategy={collisionStrategy}
                        tableSize={tableSize}
                        prime={prime}
                        hash2Formula={hash2Formula}
                    />
                </div>
            </div>
        </div>
    );
};

export default HashTablePage;