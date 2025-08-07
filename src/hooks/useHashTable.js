import { useState, useEffect, useRef } from 'react';

const TABLE_SIZE = 10;
const PRIME = 7; // A prime smaller than the table size for the second hash function

// Helper to create a new table based on strategy
const createTable = (strategy) => {
    if (strategy === 'separate-chaining') {
        return Array.from({ length: TABLE_SIZE }, () => []);
    }
    return Array(TABLE_SIZE).fill(null);
};

export const useHashTable = (strategy) => {
    const [table, setTable] = useState(() => createTable(strategy));
    const [animationStep, setAnimationStep] = useState(null);
    const timeoutRef = useRef(null);

    // Effect to re-initialize table when strategy changes
    useEffect(() => {
        // Clear any pending animation from the previous strategy
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setAnimationStep(null);
        setTable(createTable(strategy));
    }, [strategy]);

    const hash = (key) => key % TABLE_SIZE;
    const hash2 = (key) => PRIME - (key % PRIME); // Second hash function

    const runAnimation = (steps) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        let currentStep = 0;
        const executeStep = () => {
            if (currentStep >= steps.length) {
                timeoutRef.current = null;
                return;
            }
            const step = steps[currentStep];
            setAnimationStep({ index: step.index, message: step.message });

            if (step.tableState) {
                setTable(step.tableState);
            }
            
            currentStep++;
            timeoutRef.current = setTimeout(executeStep, 800);
        };
        executeStep();
    };

    // --- Linear Probing Logic ---
    const insertLinearProbing = (key) => {
        let index = hash(key);
        const steps = [{ index, message: `Hashing key ${key} to index ${index}.` }];

        let i = 0;
        let foundSpot = false;
        while (i < TABLE_SIZE) {
            const probeIndex = (index + i) % TABLE_SIZE;
            if (table[probeIndex] === null) {
                const newTable = [...table];
                newTable[probeIndex] = key;
                steps.push({ index: probeIndex, message: `Inserted ${key} at index ${probeIndex}.`, tableState: newTable });
                foundSpot = true;
                break;
            }
            steps.push({ index: probeIndex, message: `Index ${probeIndex} occupied. Probing next...` });
            i++;
        }
        if (!foundSpot) {
            steps.push({ index, message: `Table is full. Cannot insert ${key}.` });
        }
        runAnimation(steps);
    };
    
    const findLinearProbing = (key) => {
        let index = hash(key);
        const steps = [{ index, message: `Hashing key ${key} to index ${index}.` }];
         
        let i = 0;
        let found = false;
        while (i < TABLE_SIZE) {
            const probeIndex = (index + i) % TABLE_SIZE;
            steps.push({ index: probeIndex, message: `Checking index ${probeIndex}...` });
            if (table[probeIndex] === null) {
                break;
            }
            if (table[probeIndex] === key) {
                steps.push({ index: probeIndex, message: `Found key ${key} at index ${probeIndex}!` });
                found = true;
                break;
            }
            i++;
        }
        if (!found) {
             steps.push({ index: index, message: `Key ${key} not found.` });
        }
        runAnimation(steps);
    };

    // --- Quadratic Probing Logic ---
    const insertQuadraticProbing = (key) => {
        let index = hash(key);
        const steps = [{ index, message: `Hashing key ${key} to index ${index}.` }];

        let i = 0;
        let foundSpot = false;
        while (i < TABLE_SIZE) {
            const probeIndex = (index + i * i) % TABLE_SIZE;
             if (i > 0) {
                 steps.push({ index: probeIndex, message: `Index occupied. Probing ${i*i} elements away...` });
            }
            if (table[probeIndex] === null) {
                const newTable = [...table];
                newTable[probeIndex] = key;
                steps.push({ index: probeIndex, message: `Inserted ${key} at index ${probeIndex}.`, tableState: newTable });
                foundSpot = true;
                break;
            }
            i++;
        }

        if (!foundSpot) {
            steps.push({ index, message: `Could not insert ${key}.` });
        }
        runAnimation(steps);
    };

    const findQuadraticProbing = (key) => {
        let index = hash(key);
        const steps = [{ index, message: `Hashing key ${key} to index ${index}.` }];

        let i = 0;
        let found = false;
        while (i < TABLE_SIZE) {
            const probeIndex = (index + i * i) % TABLE_SIZE;
            steps.push({ index: probeIndex, message: `Checking index ${probeIndex}...` });
            if (table[probeIndex] === null) {
                break;
            }
            if (table[probeIndex] === key) {
                steps.push({ index: probeIndex, message: `Found key ${key} at index ${probeIndex}!` });
                found = true;
                break;
            }
            i++;
        }
        if (!found) {
            steps.push({ index, message: `Key ${key} not found.` });
        }
        runAnimation(steps);
    };
    
    // --- Double Hashing Logic ---
    const insertDoubleHashing = (key) => {
        const index = hash(key);
        const stepSize = hash2(key);
        const steps = [
            { index, message: `Hashing key ${key} to index ${index}.` },
            { index, message: `Second hash gives step size of ${stepSize}.`}
        ];

        let i = 0;
        let foundSpot = false;
        while(i < TABLE_SIZE) {
            const probeIndex = (index + i * stepSize) % TABLE_SIZE;
            if (i > 0) {
                steps.push({ index: probeIndex, message: `Probing at index ${probeIndex}...` });
            }
            if (table[probeIndex] === null) {
                const newTable = [...table];
                newTable[probeIndex] = key;
                steps.push({ index: probeIndex, message: `Inserted ${key} at index ${probeIndex}.`, tableState: newTable });
                foundSpot = true;
                break;
            }
            i++;
        }
        if (!foundSpot) {
            steps.push({ index, message: `Could not insert ${key}.` });
        }
        runAnimation(steps);
    };

    const findDoubleHashing = (key) => {
        const index = hash(key);
        const stepSize = hash2(key);
        const steps = [
            { index, message: `Hashing key ${key} to index ${index}.` },
            { index, message: `Second hash gives step size of ${stepSize}.`}
        ];
        
        let i = 0;
        let found = false;
        while (i < TABLE_SIZE) {
            const probeIndex = (index + i * stepSize) % TABLE_SIZE;
             if (i > 0) {
                steps.push({ index: probeIndex, message: `Probing at index ${probeIndex}...` });
            }
            if (table[probeIndex] === null) {
                break;
            }
            if (table[probeIndex] === key) {
                steps.push({ index: probeIndex, message: `Found key ${key} at index ${probeIndex}!` });
                found = true;
                break;
            }
            i++;
        }

        if (!found) {
            steps.push({ index, message: `Key ${key} not found.` });
        }
        runAnimation(steps);
    };


    // --- Separate Chaining Logic ---
    const insertSeparateChaining = (key) => {
        const index = hash(key);
        setTable(currentTable => {
            const newTable = currentTable.map(list => [...list]);
            if (!newTable[index].includes(key)) {
                newTable[index].unshift(key);
            }
            return newTable;
        });
        setAnimationStep({ index, message: `Inserted ${key} into list at index ${index}.` });
    };
    
    const findSeparateChaining = (key) => {
        const index = hash(key);
        const list = table[index] || [];
        const found = list.includes(key);

        if (found) {
            setAnimationStep({ index, message: `Found key ${key} in list at index ${index}!` });
        } else {
            setAnimationStep({ index, message: `Key ${key} not found in list at index ${index}.` });
        }
    };

    const insert = (key) => {
        if (strategy === 'linear-probing') insertLinearProbing(key);
        else if (strategy === 'quadratic-probing') insertQuadraticProbing(key);
        else if (strategy === 'double-hashing') insertDoubleHashing(key);
        else insertSeparateChaining(key);
    };

    const find = (key) => {
        if (strategy === 'linear-probing') findLinearProbing(key);
        else if (strategy === 'quadratic-probing') findQuadraticProbing(key);
        else if (strategy === 'double-hashing') findDoubleHashing(key);
        else findSeparateChaining(key);
    };

    return { table, insert, find, animationStep };
};