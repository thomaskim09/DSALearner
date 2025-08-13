import React, { useState, useEffect, useCallback } from 'react';
import HashTableControls from '../components/HashTable/HashTableControls';
import HashTableVisualizer from '../components/HashTable/HashTableVisualizer';
import HashTableCodeDisplay from '../components/HashTable/HashTableCodeDisplay';
import CalculationTrace from '../components/HashTable/CalculationTrace';
import TraceLog from '../components/common/TraceLog';
import { useHashTable } from '../hooks/useHashTable';
import '../assets/styles/HashTable.css';

const HashTablePage = () => {
    const [tableSize, setTableSize] = useState(11);
    const [prime, setPrime] = useState(7);
    const [collisionStrategy, setCollisionStrategy] = useState('linear-probing');
    const [batchInput, setBatchInput] = useState('148, 498, 224, 212, 156, 138, 36, 448, 669');
    const [chainOrder, setChainOrder] = useState('ascending');
    const [insertedData, setInsertedData] = useState([]);

    const {
        table, runOperation,
        animationSteps, currentStep,
        isPlaying, togglePlay, goToStep, resetAnimation, setTable,
    } = useHashTable(collisionStrategy, tableSize, prime, chainOrder);

    const [operation, setOperation] = useState('insert');
    const isAnimationPlaying = isPlaying;

    const populateTableFromValues = useCallback((values, strategy, size, p, order = 'ascending') => {
        const newTable = strategy === 'separate-chaining'
            ? Array.from({ length: size }, () => [])
            : Array(size).fill(null);

        const localHash = (k) => k % size;
        const h2 = (primeConst) => (k) => primeConst - (k % primeConst);
        const doubleHashStep = h2(p);

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
                    else index = (localHash(val) + i * doubleHashStep(val)) % size;
                }
                if (newTable[index] === null) newTable[index] = {key: val, isDeleted: false};
            }
        });
        setTable(newTable);
    }, [setTable]);

    const handleBatchInsert = useCallback(() => {
        resetAnimation();
        const values = batchInput.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        const traceData = values.map(key => ({ key, hash: key % tableSize }));
        setInsertedData(traceData);
        populateTableFromValues(values, collisionStrategy, tableSize, prime, chainOrder);
    }, [batchInput, collisionStrategy, tableSize, prime, chainOrder, resetAnimation, populateTableFromValues]);

    const handleStepHover = (index) => {
        if (animationSteps.length > 0) {
            goToStep(index);
        }
    };
    
    useEffect(() => {
        handleBatchInsert();
    }, [collisionStrategy, tableSize, prime, chainOrder, handleBatchInsert]);


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
                    />
                </div>
                {collisionStrategy === 'double-hashing' && (
                    <div className="hash-table-calculation-container">
                        <CalculationTrace insertedData={insertedData} tableSize={tableSize}/>
                    </div>
                )}

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
                    />
                </div>
            </div>
        </div>
    );
};

export default HashTablePage;