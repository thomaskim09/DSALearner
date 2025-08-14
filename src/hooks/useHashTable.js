import { useState, useEffect, useRef, useCallback } from 'react';
import { isHash2FormulaValid } from '../utils/formulaValidator';

// A constant representing a deleted item in the hash table
const DELETED_ITEM = { key: -1, isDeleted: true };

const createTable = (strategy, size) => {
    if (strategy === 'separate-chaining') {
        return Array.from({ length: size }, () => []);
    }
    return Array(size).fill(null);
};

/**
 * Safely evaluates the user-defined hash formula.
 * @param {string} formula - The formula to evaluate.
 * @param {number} key - The key value to use in the formula.
 * @param {number} prime - The prime number to use in the formula.
 * @returns {number} The calculated step size, defaulting to 1 on any error.
 */
const evaluateHash2 = (formula, key, prime) => {
    // Final safeguard check, though the UI should prevent invalid formulas.
    if (!isHash2FormulaValid(formula)) {
        return 1;
    }
    try {
        const expression = formula.replace(/\bkey\b/g, key).replace(/\bprime\b/g, prime);
        // Use the Function constructor for safer evaluation than direct eval().
        const result = new Function(`return ${expression}`)();
        // Ensure the result is a non-negative integer and at least 1.
        const step = Math.abs(Math.floor(result));
        return step > 0 ? step : 1; // A step size of 0 would cause an infinite loop.
    } catch (error) {
        console.error("Error evaluating hash formula:", error);
        return 1; // Default to 1 on any evaluation error.
    }
};

export const useHashTable = (strategy, tableSize, prime, chainOrder = 'ascending', hash2Formula = 'prime - (key % prime)') => {
    const [table, setTable] = useState(() => createTable(strategy, tableSize));
    const [animationSteps, setAnimationSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const initialTableState = useRef(createTable(strategy, tableSize));
    const timeoutRef = useRef(null);

    // Effect to reset the table state when parameters change.
    useEffect(() => {
        setTable(createTable(strategy, tableSize));
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setAnimationSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [strategy, tableSize, prime, hash2Formula]);

    // Effect to handle the animation playback.
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
    const hash2 = (key) => evaluateHash2(hash2Formula, key, prime);

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
        setAnimationSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, []);

    // Generic probing logic for open addressing.
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

    // Main function to run operations based on the selected strategy.
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
                steps.splice(1, 0, { index: hash(key), message: `Step size from formula "${hash2Formula}": ${hash2(key)}` });
                break;
            case 'separate-chaining':
                {
                    const index = hash(key);
                    const chain = table[index];
                    const newTable = table.map(list => [...list]);
                    const itemIndex = chain.findIndex(item => item.key === key);

                    if (action === 'insert') {
                        if (itemIndex !== -1) {
                            steps.push({ index, message: `Key ${key} already exists at index ${index}.` });
                        } else {
                            newTable[index].push({ key, isDeleted: false });
                            newTable[index].sort((a, b) => chainOrder === 'ascending' ? a.key - b.key : b.key - a.key);
                            steps.push({ index, message: `Hash for key ${key} is ${index}. Inserting into list (${chainOrder}).` , tableState: newTable });
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
                }
                break;
            default: break;
        }
        startAnimation(steps);
    };

    return { table, setTable, runOperation, animationSteps, currentStep, isPlaying, togglePlay, goToStep, resetAnimation };
};  