import { useState, useCallback } from 'react';

const MAX_SIZE = 10;

const initialStates = {
    stack: { type: 'stack', array: Array(MAX_SIZE).fill(null), top: -1, message: 'Initial empty stack.' },
    queue: { type: 'queue', array: Array(MAX_SIZE).fill(null), front: 0, rear: -1, nItems: 0, message: 'Initial empty queue.' },
    priorityQueue: { type: 'priorityQueue', array: Array(MAX_SIZE).fill(null), nItems: 0, message: 'Initial empty priority queue.' }
};

export const useStackQueue = (defaultType = 'stack') => {
    const [state, setState] = useState(initialStates[defaultType]);

    const setType = (newType) => {
        setState(initialStates[newType]);
    };

    const clear = () => setState(initialStates[state.type]);
    const reset = () => {
        let newState;
        if (state.type === 'stack') {
            newState = { ...initialStates.stack, array: [20, 40, 60, 80, ...Array(6).fill(null)], top: 3, message: 'Stack reset with dummy data.' };
        } else if (state.type === 'queue') {
            newState = { ...initialStates.queue, array: [10, 20, 30, 40, ...Array(6).fill(null)], rear: 3, nItems: 4, message: 'Queue reset with dummy data.' };
        } else {
            newState = { ...initialStates.priorityQueue, array: [50, 40, 30, 20, 10, ...Array(5).fill(null)], nItems: 5, message: 'Priority Queue reset with dummy data (sorted descending).' };
        }
        setState(newState);
    };

    const push = useCallback((value) => {
        const { array, top } = state;
        const steps = [];
        if (top >= MAX_SIZE - 1) {
            steps.push({ ...state, message: 'Stack overflow! Cannot push.' });
            return steps;
        }
        const newTop = top + 1;
        const newArray = [...array];
        newArray[newTop] = value;
        steps.push({ ...state, top: newTop, message: `Increment top to ${newTop}.` });
        steps.push({ type: 'stack', array: newArray, top: newTop, message: `Push ${value} onto the stack.` });
        setState(steps[steps.length - 1]);
        return steps;
    }, [state]);

    const pop = useCallback(() => {
        const { array, top } = state;
        const steps = [];
        if (top < 0) {
            steps.push({ ...state, message: 'Stack underflow! Cannot pop.' });
            return steps;
        }
        const newArray = [...array];
        const poppedValue = newArray[top];
        newArray[top] = null;
        const newTop = top - 1;
        steps.push({ type: 'stack', array: newArray, top, message: `Value ${poppedValue} is popped.` });
        steps.push({ type: 'stack', array: newArray, top: newTop, message: `Decrement top to ${newTop}.` });
        setState(steps[steps.length - 1]);
        return steps;
    }, [state]);

    const enqueue = useCallback((value) => {
        const { array, rear, nItems } = state;
        const steps = [];
        if (nItems >= MAX_SIZE) {
            steps.push({ ...state, message: 'Queue is full! Cannot enqueue.' });
            return steps;
        }
        let newRear = rear + 1;
        if (newRear === MAX_SIZE) newRear = 0; // Wrap around
        const newArray = [...array];
        newArray[newRear] = value;
        const newNItems = nItems + 1;
        steps.push({ ...state, rear: newRear, message: `Move rear to index ${newRear}.` });
        steps.push({ ...state, array: newArray, rear: newRear, nItems: newNItems, message: `Enqueue ${value}. Items: ${newNItems}` });
        setState(steps[steps.length - 1]);
        return steps;
    }, [state]);

    const dequeue = useCallback(() => {
        const { array, front, nItems } = state;
        const steps = [];
        if (nItems === 0) {
            steps.push({ ...state, message: 'Queue is empty! Cannot dequeue.' });
            return steps;
        }
        const newArray = [...array];
        const dequeuedValue = newArray[front];
        newArray[front] = null;
        let newFront = front + 1;
        if (newFront === MAX_SIZE) newFront = 0; // Wrap around
        const newNItems = nItems - 1;
        steps.push({ ...state, array: newArray, message: `Dequeue ${dequeuedValue} from front.` });
        steps.push({ ...state, array: newArray, front: newFront, nItems: newNItems, message: `Move front to ${newFront}. Items: ${newNItems}` });
        setState(steps[steps.length - 1]);
        return steps;
    }, [state]);
    
    const pEnqueue = useCallback((value) => {
        const { array, nItems } = state;
        let steps = [];
        if (nItems === MAX_SIZE) {
            steps.push({ ...state, message: 'Priority Queue is full!' });
            return steps;
        }
        let newArray = [...array];
        let j;
        if (nItems === 0) {
            newArray[0] = value;
            steps.push({ ...state, array: newArray, nItems: 1, message: `Queue empty. Insert ${value} at index 0.` });
        } else {
            for (j = nItems - 1; j >= 0; j--) {
                steps.push({ ...state, array: newArray, nItems, highlights: { compare: j }, message: `Comparing ${value} with ${newArray[j]}.` });
                if (value > newArray[j]) {
                    newArray[j + 1] = newArray[j];
                    steps.push({ ...state, array: [...newArray], nItems, highlights: { shift: j + 1 }, message: `Shift ${newArray[j]} up.` });
                } else {
                    break;
                }
            }
            newArray[j + 1] = value;
            steps.push({ ...state, array: newArray, nItems: nItems + 1, highlights: { insert: j + 1 }, message: `Insert ${value} at index ${j + 1}.` });
        }
        setState(steps[steps.length - 1]);
        return steps;
    }, [state]);

    const pDequeue = useCallback(() => {
        const { array, nItems } = state;
        const steps = [];
        if (nItems === 0) {
            steps.push({ ...state, message: 'Priority Queue is empty!' });
            return steps;
        }
        const newArray = [...array];
        const removedValue = newArray[nItems - 1];
        newArray[nItems - 1] = null;
        const newNItems = nItems - 1;
        steps.push({ ...state, array: newArray, nItems: newNItems, highlights: { remove: nItems - 1 }, message: `Remove minimum item ${removedValue}.` });
        setState(steps[steps.length - 1]);
        return steps;
    }, [state]);


    return { state, setType, push, pop, enqueue, dequeue, pEnqueue, pDequeue, clear, reset };
};