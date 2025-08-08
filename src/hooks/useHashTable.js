import { useState, useEffect, useRef, useCallback } from 'react';

const TABLE_SIZE = 10;

const createTable = (strategy) => {
    if (strategy === 'separate-chaining') {
        return Array.from({ length: TABLE_SIZE }, () => []);
    }
    return Array(TABLE_SIZE).fill(null);
};

export const useHashTable = (strategy, prime) => { // Accept prime as an argument
    const [table, setTable] = useState(() => createTable(strategy));
    const [animationSteps, setAnimationSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const initialTableState = useRef(createTable(strategy));
    const timeoutRef = useRef(null);

    // This effect now only resets animations, not the table itself.
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setAnimationSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [strategy, prime]);

    useEffect(() => {
        if (!isPlaying || currentStep >= animationSteps.length) {
            if (currentStep >= animationSteps.length && animationSteps.length > 0) {
                 setCurrentStep(animationSteps.length -1);
            }
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
    
    const hash = (key) => key % TABLE_SIZE;
    const hash2 = (key) => prime - (key % prime); // Use the prime from props

    const startAnimation = (steps) => {
        initialTableState.current = JSON.parse(JSON.stringify(table)); // Deep copy
        setAnimationSteps(steps);
        setCurrentStep(0);
        setIsPlaying(true);
    };
    
    const goToStep = (step) => {
        if (step < 0 || step >= animationSteps.length) return;
        setIsPlaying(false);
        
        let latestTableState = initialTableState.current;
        for (let i = 0; i <= step; i++) {
            if (animationSteps[i].tableState) {
                latestTableState = animationSteps[i].tableState;
            }
        }
        setTable(latestTableState);
        setCurrentStep(step);
    }
    
    const togglePlay = () => {
        if (currentStep >= animationSteps.length - 1 && !isPlaying) {
             goToStep(0);
             setTimeout(() => setIsPlaying(true), 50);
        } else {
            setIsPlaying(!isPlaying);
        }
    };
    
    const resetAnimation = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const lastStepWithTable = [...animationSteps].reverse().find(s => s.tableState);
        if (lastStepWithTable) {
            setTable(lastStepWithTable.tableState);
        }
        setAnimationSteps([]);
        setCurrentStep(0);
        setIsPlaying(false);
    }, [animationSteps]);


    const createProbingSteps = (key, probingFn) => {
        const initialIndex = hash(key);
        const steps = [{ index: initialIndex, message: `Initial hash for key ${key}: ${key} % ${TABLE_SIZE} = ${initialIndex}` }];
        
        const currentTable = table;
        let i = 0;
        while (i < TABLE_SIZE) {
            const { probeIndex, message } = probingFn(initialIndex, i, key);
            
            if (i > 0) {
                 steps.push({ index: probeIndex, message });
            }

            if (currentTable[probeIndex] === null) {
                const newTable = [...currentTable];
                newTable[probeIndex] = key;
                steps.push({ index: probeIndex, message: `Success! Slot ${probeIndex} is empty. Inserting ${key}.`, tableState: newTable });
                return steps;
            }
             steps.push({ index: probeIndex, message: `Collision at index ${probeIndex} (Value: ${currentTable[probeIndex]}).` });
            i++;
        }
        steps.push({ index: initialIndex, message: `Table is full after ${TABLE_SIZE} probes. Cannot insert ${key}.` });
        return steps;
    };
    
    const insertLinearProbing = (key) => {
        startAnimation(createProbingSteps(key, (index, i) => ({
            probeIndex: (index + i) % TABLE_SIZE,
            message: `Probing next slot: (${index} + ${i}) % ${TABLE_SIZE} = ${(index + i) % TABLE_SIZE}`
        })));
    };

    const insertQuadraticProbing = (key) => {
        startAnimation(createProbingSteps(key, (index, i) => ({
            probeIndex: (index + i * i) % TABLE_SIZE,
            message: `Probing quadratically: (${index} + ${i}^2) % ${TABLE_SIZE} = ${(index + i * i) % TABLE_SIZE}`
        })));
    };
    
    const insertDoubleHashing = (key) => {
        const stepSize = hash2(key);
        const steps = createProbingSteps(key, (index, i) => ({
            probeIndex: (index + i * stepSize) % TABLE_SIZE,
            message: `Probing with step size ${stepSize}: (${index} + ${i} * ${stepSize}) % ${TABLE_SIZE} = ${(index + i * stepSize) % TABLE_SIZE}`
        }));
        steps.splice(1, 0, { index: hash(key), message: `Second hash for step size: ${prime} - (${key} % ${prime}) = ${stepSize}` });
        startAnimation(steps);
    };

    const insertSeparateChaining = (key) => {
        const index = hash(key);
        const newTable = table.map(list => [...list]);
        let message = `Key ${key} is already in the list at index ${index}.`;
        if (!newTable[index].includes(key)) {
            newTable[index].unshift(key);
            message = `Inserting ${key} into the linked list at index ${index}.`;
        }
        startAnimation([
            { index, message: `Hash for key ${key}: ${key} % ${TABLE_SIZE} = ${index}.`},
            { index, message, tableState: newTable}
        ]);
    };
    
    const find = (key) => {
        console.log("Find operation not fully implemented with new animation logic yet.");
    };

    const insert = (key) => {
        const strategyMap = {
            'linear-probing': insertLinearProbing,
            'quadratic-probing': insertQuadraticProbing,
            'double-hashing': insertDoubleHashing,
            'separate-chaining': insertSeparateChaining,
        };
        strategyMap[strategy](key);
    };

    return { table, setTable, insert, find, animationSteps, currentStep, isPlaying, togglePlay, goToStep, resetAnimation };
};