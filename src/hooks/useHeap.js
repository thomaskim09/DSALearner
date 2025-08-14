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

        steps.push({ heap: [...newHeap], highlights: { inserted: currentIndex }, message: `Inserting ${value} at the end of the heap.` });

        while (currentIndex > 0 && newHeap[currentIndex] > newHeap[parentIndex]) {
            steps.push({ heap: [...newHeap], highlights: { comparing: [currentIndex, parentIndex] }, message: `${newHeap[currentIndex]} is greater than parent ${newHeap[parentIndex]}. Swapping.` });
            [newHeap[currentIndex], newHeap[parentIndex]] = [newHeap[parentIndex], newHeap[currentIndex]];
            steps.push({ heap: [...newHeap], highlights: { swapped: [currentIndex, parentIndex] }, message: `Swapped.` });
            currentIndex = parentIndex;
            parentIndex = Math.floor((currentIndex - 1) / 2);
        }
        steps.push({ heap: [...newHeap], highlights: { final: currentIndex }, message: `Node ${value} is in its correct position.` });
        setHeap(newHeap);
        return steps;
    };

    const remove = () => {
        if (heap.length === 0) return [];
        const steps = [];
        const newHeap = [...heap];
        const removedValue = newHeap[0];
        steps.push({ heap: [...newHeap], highlights: { removing: 0 }, message: `Removing root ${removedValue}.` });
        const lastValue = newHeap.pop();

        if (newHeap.length > 0) {
            newHeap[0] = lastValue;
            steps.push({ heap: [...newHeap], highlights: { swapped: [0, newHeap.length] }, message: `Replacing with last element ${lastValue}.` });

            trickleDown(newHeap, 0, newHeap.length, steps);
        }
        setHeap(newHeap);
        return steps;
    };

    const heapSort = (inputArray) => {
        const steps = [];
        const arr = [...inputArray];
        const n = arr.length;

        // Build heap
        steps.push({ heap: [...arr], sortedCount: 0, message: 'Initial array. Building max heap.' });
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            trickleDown(arr, i, n, steps, true);
        }
        steps.push({ heap: [...arr], sortedCount: 0, message: 'Heap built. Now starting sort.' });

        // Sort
        for (let i = n - 1; i > 0; i--) {
            steps.push({ heap: [...arr], sortedCount: n - 1 - i, highlights: { swapping: [0, i] }, message: `Swapping max element ${arr[0]} with end of heap.` });
            [arr[0], arr[i]] = [arr[i], arr[0]];
            steps.push({ heap: [...arr], sortedCount: n - i, highlights: { swapped: [0, i] }, message: `Max element moved to sorted position. Re-heapifying.` });
            trickleDown(arr, 0, i, steps);
        }

        steps.push({ heap: [...arr], sortedCount: n, message: 'Array is sorted.' });
        return steps;
    };


    const clear = () => setHeap([]);
    const refreshHeap = () => loadDummyData();
    const getHeapHeight = (index) => index < heap.length ? 1 + Math.max(getHeapHeight(2 * index + 1), getHeapHeight(2 * index + 2)) : 0;

    return { heap, insert, remove, clear, refreshHeap, getHeapHeight, heapSort };
};

function trickleDown(heap, index, heapSize, steps, isBuilding = false) {
    let currentIndex = index;
    const top = heap[currentIndex];
    if (!isBuilding) {
        steps.push({ heap: [...heap], sortedCount: heap.length - heapSize, highlights: { processing: currentIndex }, message: `Trickling down ${top}.` });
    }

    while (currentIndex < Math.floor(heapSize / 2)) {
        let leftChildIndex = 2 * currentIndex + 1;
        let rightChildIndex = 2 * currentIndex + 2;
        let largerChildIndex = leftChildIndex;

        if (rightChildIndex < heapSize && heap[rightChildIndex] > heap[leftChildIndex]) {
            largerChildIndex = rightChildIndex;
        }

        steps.push({ heap: [...heap], sortedCount: heap.length - heapSize, highlights: { comparing: [currentIndex, largerChildIndex] }, message: `Comparing ${heap[currentIndex]} with larger child ${heap[largerChildIndex]}.` });

        if (heap[currentIndex] >= heap[largerChildIndex]) {
            steps.push({ heap: [...heap], sortedCount: heap.length - heapSize, highlights: { final: currentIndex }, message: `${heap[currentIndex]} is in correct position.` });
            break;
        }

        [heap[currentIndex], heap[largerChildIndex]] = [heap[largerChildIndex], heap[currentIndex]];
        steps.push({ heap: [...heap], sortedCount: heap.length - heapSize, highlights: { swapped: [currentIndex, largerChildIndex] }, message: 'Swapped.' });
        currentIndex = largerChildIndex;
    }
}