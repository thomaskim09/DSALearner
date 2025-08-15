import { useState, useCallback, useEffect } from 'react';

export const useHeap = () => {
    const [heap, setHeap] = useState([]);

    const loadDummyData = useCallback(() => {
        const initialArray = [8, 56, 44, 89, 32, 69, 98, 10, 20, 100, 80, 77];
        setHeap(initialArray);
    }, []);

    useEffect(() => {
        loadDummyData();
    }, [loadDummyData]);

    const insert = useCallback((value) => {
        const steps = [];
        const newHeap = [...heap, value];
        steps.push({ heap: [...newHeap], message: `Inserting ${value} at the end.` });
        trickleUp(newHeap, newHeap.length - 1, steps);
        setHeap(newHeap);
        return steps;
    }, [heap]);

    const remove = useCallback(() => {
        if (heap.length === 0) return [{ heap: [], message: 'Heap is empty.' }];
        const steps = [];
        let newHeap = [...heap];
        const removedValue = newHeap[0];
        steps.push({ heap: [...newHeap], message: `Removing root ${removedValue}.` });
        const lastValue = newHeap.pop();
        if (newHeap.length > 0) {
            newHeap[0] = lastValue;
            trickleDown(newHeap, 0, newHeap.length, steps);
        }
        setHeap(newHeap);
        steps.push({ heap: [...newHeap], message: `Removal of ${removedValue} complete.` });
        return steps;
    }, [heap]);

    const change = useCallback((oldValue, newValue) => {
        const steps = [];
        const index = heap.indexOf(oldValue);
        if (index === -1) {
            steps.push({ heap: [...heap], message: `Value ${oldValue} not found.` });
            return steps;
        }
        const newHeap = [...heap];
        newHeap[index] = newValue;
        steps.push({ heap: [...newHeap], message: `Changed ${oldValue} to ${newValue}. Re-heapifying.` });
        if (newValue > oldValue) {
            trickleUp(newHeap, index, steps);
        } else {
            trickleDown(newHeap, index, newHeap.length, steps);
        }
        setHeap(newHeap);
        return steps;
    }, [heap]);
    
    const heapifyAndGetSteps = useCallback(() => {
        const arr = [...heap];
        const n = arr.length;
        const steps = [];
        steps.push({ heap: [...arr], message: 'Starting heapify process on the current array.' });

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            trickleDown(arr, i, n, steps, true);
        }

        steps.push({ heap: [...arr], message: 'Heapify complete. The array is now a valid max heap.' });
        setHeap(arr);
        return steps;
    }, [heap]);

    const heapSort = (inputArray) => {
        const arr = [...inputArray];
        let n = arr.length;
        const history = [];

        history.push({ heap: [...inputArray], sortedCount: 0, message: 'Original unsorted array.' });

        let buildHeapArr = [...arr];
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(buildHeapArr, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            [buildHeapArr[0], buildHeapArr[i]] = [buildHeapArr[i], buildHeapArr[0]];
            heapify(buildHeapArr, i, 0);
            history.push({ 
                heap: [...buildHeapArr], 
                sortedCount: n - i, 
                message: `Pass ${n - i}: Max element ${buildHeapArr[i]} moved to sorted position.`
            });
        }
        history.push({ heap: [...buildHeapArr], sortedCount: n, message: 'Array is fully sorted.' });
        return history;
    };

    const clear = () => setHeap([]);
    const refreshHeap = () => loadDummyData();
    const getHeapHeight = (index) => (index < heap.length ? 1 + Math.max(getHeapHeight(2 * index + 1), getHeapHeight(2 * index + 2)) : 0);

    return { heap, setHeap, insert, remove, clear, refreshHeap, getHeapHeight, heapSort, change, heapifyAndGetSteps };
};

// Helper function for building a heap with detailed steps
const heapify = (arr, n, i, steps) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (steps) steps.push({ heap: [...arr], highlights: { comparing: [i, left, right] }, message: `Checking node at index ${i} (${arr[i]}) against its children.`});

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        if (steps) steps.push({ heap: [...arr], highlights: { swapping: [i, largest] }, message: `Swapping ${arr[i]} with larger child ${arr[largest]}.`});
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        if (steps) steps.push({ heap: [...arr], highlights: { swapped: [i, largest] } , message: `Swap complete.`});
        heapify(arr, n, largest, steps);
    }
};

function trickleUp(heap, index, steps) {
    let currentIndex = index;
    let parentIndex = Math.floor((currentIndex - 1) / 2);
    while (currentIndex > 0 && heap[currentIndex] > heap[parentIndex]) {
        steps.push({ heap: [...heap], highlights: { comparing: [currentIndex, parentIndex] }, message: `Comparing ${heap[currentIndex]} with parent ${heap[parentIndex]}.` });
        [heap[currentIndex], heap[parentIndex]] = [heap[parentIndex], heap[currentIndex]];
        steps.push({ heap: [...heap], highlights: { swapped: [currentIndex, parentIndex] }, message: `Swapped. Continuing trickle up.` });
        currentIndex = parentIndex;
        parentIndex = Math.floor((currentIndex - 1) / 2);
    }
}

function trickleDown(heap, index, heapSize, steps, isBuilding = false) {
    if (isBuilding) {
        heapify(heap, heapSize, index, steps);
    } else {
        heapify(heap, heapSize, index, steps);
    }
}