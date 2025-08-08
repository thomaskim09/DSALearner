import { useState, useEffect, useRef, useCallback } from 'react';

// A constant representing a deleted item in the hash table
const DELETED_ITEM = { key: -1, isDeleted: true };

const createTable = (strategy, size) => {
    if (strategy === 'separate-chaining') {
        return Array.from({ length: size }, () => []);
    }
    return Array(size).fill(null);
};

export const useHashTable = (strategy, tableSize, prime) => {
    const [table, setTable] = useState(() => createTable(strategy, tableSize));
    const [animationSteps, setAnimationSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const initialTableState = useRef(createTable(strategy, tableSize));
    const timeoutRef = useRef(null);

    // This effect now correctly resets the table state only when parameters change.
    useEffect(() => {
        setTable(createTable(strategy, tableSize));
        resetAnimation();
    }, [strategy, tableSize]);

    // Animation player effect
    useEffect(() => {
        if (!isPlaying || currentStep >= animationSteps.length) {
            setIsPlaying(false);
            return;
        }
        const step = animationSteps[currentStep];
        const delay = step.tableState ? 1200 : 900;
        timeoutRef.current = setTimeout(() => {
            if (step.tableState) {
                setTable(step.tableState);
            }
            setCurrentStep(prev => prev + 1);
        }, delay);
        return () => clearTimeout(timeoutRef.current);
    }, [isPlaying, currentStep, animationSteps]);
    
    const hash = (key) => key % tableSize;
    const hash2 = (key) => prime - (key % prime);

    const startAnimation = (steps) => {
        initialTableState.current = JSON.parse(JSON.stringify(table));
        setAnimationSteps(steps);
        setCurrentStep(0);
        setIsPlaying(true);
    };
    
    const goToStep = (step) => {
        if (step < 0 || step >= animationSteps.length) return;
        setIsPlaying(false);
        let latestTableState = initialTableState.current;
        for (let i = 0; i <= step; i++) {
            if (animationSteps[i].tableState) latestTableState = animationSteps[i].tableState;
        }
        setTable(latestTableState);
        setCurrentStep(step);
    }
    
    const togglePlay = () => {
        if (currentStep >= animationSteps.length && !isPlaying) {
             goToStep(0);
             setTimeout(() => setIsPlaying(true), 50);
        } else {
            setIsPlaying(!isPlaying);
        }
    };
    
    const resetAnimation = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const lastStepWithTable = [...animationSteps].reverse().find(s => s.tableState);
        if (lastStepWithTable) setTable(lastStepWithTable.tableState);
        setAnimationSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [animationSteps]);

    // --- Generic Probing Logic ---
    const probe = (key, probingFn, action) => {
        const initialIndex = hash(key);
        const steps = [{ index: initialIndex, message: `Initial hash for key ${key}: ${key} % ${tableSize} = ${initialIndex}` }];
        
        const currentTable = table;
        let i = 0;
        while (i < tableSize) {
            const { probeIndex, message } = probingFn(initialIndex, i, key);
            if (i > 0) steps.push({ index: probeIndex, message });

            const item = currentTable[probeIndex];

            if (action === 'find' || action === 'delete') {
                if (item === null) {
                    steps.push({ index: probeIndex, message: `Found an empty slot. Key ${key} is not in the table.` });
                    return steps;
                }
                if (item.key === key) {
                    if (action === 'find') {
                        steps.push({ index: probeIndex, message: `Success! Found key ${key} at index ${probeIndex}.` });
                    } else { // delete
                        const newTable = [...currentTable];
                        newTable[probeIndex] = DELETED_ITEM;
                        steps.push({ index: probeIndex, message: `Found key ${key}. Deleting from index ${probeIndex}.`, tableState: newTable });
                    }
                    return steps;
                }
            } else { // insert
                if (item === null || item.isDeleted) {
                    const newTable = [...currentTable];
                    newTable[probeIndex] = { key, isDeleted: false };
                    steps.push({ index: probeIndex, message: `Success! Slot ${probeIndex} is empty. Inserting ${key}.`, tableState: newTable });
                    return steps;
                }
            }
            steps.push({ index: probeIndex, message: `Collision at index ${probeIndex} (Value: ${item.key}).` });
            i++;
        }
        steps.push({ index: initialIndex, message: `Table search complete. Cannot ${action} ${key}.` });
        return steps;
    };

    // --- Operation Implementations ---
    const runOperation = (key, action) => {
        let steps = [];
        const linearProbeFn = (index, i) => ({
            probeIndex: (index + i) % tableSize,
            message: `Probing next slot: (${index} + ${i}) % ${tableSize} = ${(index + i) % tableSize}`
        });
        const quadraticProbeFn = (index, i) => ({
            probeIndex: (index + i * i) % tableSize,
            message: `Probing quadratically: (${index} + ${i}²) % ${tableSize} = ${(index + i * i) % tableSize}`
        });
        const doubleHashFn = (index, i, k) => ({
            probeIndex: (index + i * hash2(k)) % tableSize,
            message: `Probing with step size ${hash2(k)}: (${index} + ${i} * ${hash2(k)}) % ${tableSize} = ${(index + i * hash2(k)) % tableSize}`
        });
        
        switch (strategy) {
            case 'linear-probing':
                steps = probe(key, linearProbeFn, action);
                break;
            case 'quadratic-probing':
                steps = probe(key, quadraticProbeFn, action);
                break;
            case 'double-hashing':
                steps = probe(key, doubleHashFn, action);
                steps.splice(1, 0, { index: hash(key), message: `Second hash for step size: ${prime} - (${key} % ${prime}) = ${hash2(key)}` });
                break;
            case 'separate-chaining':
                const index = hash(key);
                const chain = table[index];
                const newTable = table.map(list => [...list]);
                const itemIndex = chain.findIndex(item => item.key === key);

                if (action === 'insert') {
                    if (itemIndex !== -1) {
                         steps.push({ index, message: `Key ${key} already exists at index ${index}.` });
                    } else {
                        newTable[index].unshift({ key, isDeleted: false });
                        steps.push({ index, message: `Hash for key ${key} is ${index}. Inserting at head of list.` , tableState: newTable });
                    }
                } else if (action === 'find') {
                    steps.push({ index, message: `Hashing to index ${index}. Searching list.` });
                    if(itemIndex !== -1) steps.push({ index, message: `Found key ${key} in the list at index ${index}.` });
                    else steps.push({ index, message: `Key ${key} not found in the list.` });
                } else { // delete
                     steps.push({ index, message: `Hashing to index ${index}. Searching list.` });
                     if (itemIndex !== -1) {
                         newTable[index].splice(itemIndex, 1);
                         steps.push({ index, message: `Found and removed key ${key}.`, tableState: newTable });
                     } else {
                         steps.push({ index, message: `Key ${key} not found for deletion.` });
                     }
                }
                break;
            default: break;
        }
        startAnimation(steps);
    };

    return { table, setTable, runOperation, animationSteps, currentStep, isPlaying, togglePlay, goToStep, resetAnimation };
};