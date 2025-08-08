import { useState, useCallback, useEffect } from 'react';

export const useHeap = () => {
    const [heap, setHeap] = useState([]);

    const loadDummyData = useCallback(() => {
        // Creates a valid heap from the start
        setHeap([80, 50, 70, 20, 40, 60, 25]);
    }, []);

    useEffect(() => {
        loadDummyData();
    }, [loadDummyData]);

    const insert = (value) => {
        const steps = [];
        const newHeap = [...heap, value];
        let currentIndex = newHeap.length - 1;
        let parentIndex = Math.floor((currentIndex - 1) / 2);

        steps.push({ nodeIndex: currentIndex, message: `Inserting ${value} at the end of the heap.` });

        while (currentIndex > 0 && newHeap[currentIndex] > newHeap[parentIndex]) {
            steps.push({ nodeIndex: currentIndex, message: `${newHeap[currentIndex]} is greater than parent ${newHeap[parentIndex]}. Swapping.` });
            [newHeap[currentIndex], newHeap[parentIndex]] = [newHeap[parentIndex], newHeap[currentIndex]];
            currentIndex = parentIndex;
            parentIndex = Math.floor((currentIndex - 1) / 2);
        }
        steps.push({ nodeIndex: currentIndex, message: `Node ${value} is in its correct position.` });
        setHeap(newHeap);
        return steps;
    };

    const remove = () => {
        if (heap.length === 0) return [];
        const steps = [];
        const newHeap = [...heap];
        const removedValue = newHeap[0];
        const lastValue = newHeap.pop();
        
        if (newHeap.length > 0) {
            newHeap[0] = lastValue;
            steps.push({ nodeIndex: 0, message: `Removing root ${removedValue}. Replacing with last element ${lastValue}.` });

            let currentIndex = 0;
            while (true) {
                let leftChildIndex = 2 * currentIndex + 1;
                let rightChildIndex = 2 * currentIndex + 2;
                let largestChildIndex = leftChildIndex;

                if (rightChildIndex < newHeap.length && newHeap[rightChildIndex] > newHeap[leftChildIndex]) {
                    largestChildIndex = rightChildIndex;
                }

                if (largestChildIndex < newHeap.length && newHeap[largestChildIndex] > newHeap[currentIndex]) {
                    steps.push({ nodeIndex: currentIndex, message: `Parent ${newHeap[currentIndex]} is smaller than child ${newHeap[largestChildIndex]}. Swapping.` });
                    [newHeap[currentIndex], newHeap[largestChildIndex]] = [newHeap[largestChildIndex], newHeap[currentIndex]];
                    currentIndex = largestChildIndex;
                } else {
                    break;
                }
            }
             steps.push({ nodeIndex: currentIndex, message: `Node ${lastValue} trickled down to its correct position.` });
        }
        setHeap(newHeap);
        return steps;
    };

    const clear = () => setHeap([]);
    const refreshHeap = () => loadDummyData();
    const getHeapHeight = (index) => index < heap.length ? 1 + Math.max(getHeapHeight(2 * index + 1), getHeapHeight(2 * index + 2)) : 0;

    return { heap, insert, remove, clear, refreshHeap, getHeapHeight };
};