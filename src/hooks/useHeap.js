import { useState, useCallback, useEffect } from 'react';

export const useHeap = () => {
    const [heap, setHeap] = useState([]);

    const loadDummyData = useCallback(() => {
        // Use the specified default array
        const initialArray = [8, 56, 44, 89, 32, 69, 98, 10, 20, 100, 80, 77];
        const n = initialArray.length;

        // Heapify the array to ensure it's a valid max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(initialArray, n, i);
        }
        setHeap(initialArray);
    }, []);

    // Helper function for heapifying, used internally
    const heapify = (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    };


    useEffect(() => {
        loadDummyData();
    }, [loadDummyData]);

    const insert = useCallback((value) => {
        const steps = [];
        const newHeap = [...heap, value];
        let currentIndex = newHeap.length - 1;
        steps.push({ heap: [...newHeap], highlights: { inserted: currentIndex }, message: `Inserting ${value}.` });
        trickleUp(newHeap, currentIndex, steps);
        setHeap(newHeap); // Update the hook's own state
        return steps;
    }, [heap]); // Depend on heap

    const remove = useCallback(() => {
        if (heap.length === 0) return [{ heap: [], message: 'Heap is empty.' }];
        const steps = [];
        let newHeap = [...heap];
        const removedValue = newHeap[0];
        
        steps.push({ heap: [...newHeap], highlights: { removing: 0 }, message: `Removing root ${removedValue}.` });
        
        const lastValue = newHeap.pop();
        
        if (newHeap.length > 0) {
            newHeap[0] = lastValue;
            trickleDown(newHeap, 0, newHeap.length, steps);
        }
        
        setHeap(newHeap); // Update the hook's own state
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
        setHeap(newHeap); // Update the hook's own state
        return steps;
    }, [heap]);

    const heapSort = (inputArray) => {
        const arr = [...inputArray];
        let n = arr.length;
        const history = [];

        history.push({ heap: [...inputArray], sortedCount: 0, message: 'Original unsorted array.' });

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            heapify(arr, i, 0);
            history.push({ 
                heap: [...arr], 
                sortedCount: n - i, 
                message: `Pass ${n - i}: Max element ${arr[i]} moved to sorted position.`
            });
        }
         history.push({ heap: [...arr], sortedCount: n, message: 'Array is fully sorted.' });
        return history;
    };

    const clear = () => setHeap([]);
    const refreshHeap = () => loadDummyData();
    const getHeapHeight = (index) => index < heap.length ? 1 + Math.max(getHeapHeight(2 * index + 1), getHeapHeight(2 * index + 2)) : 0;

    return { heap, setHeap, insert, remove, clear, refreshHeap, getHeapHeight, heapSort, change };
};

function trickleUp(heap, index, steps) {
    let currentIndex = index;
    let parentIndex = Math.floor((currentIndex - 1) / 2);
    while (currentIndex > 0 && heap[currentIndex] > heap[parentIndex]) {
        [heap[currentIndex], heap[parentIndex]] = [heap[parentIndex], heap[currentIndex]];
        steps.push({ heap: [...heap], highlights: { swapped: [currentIndex, parentIndex] }, message: `Trickling up ${heap[parentIndex]}.` });
        currentIndex = parentIndex;
        parentIndex = Math.floor((currentIndex - 1) / 2);
    }
}

function trickleDown(heap, index, heapSize, steps) {
    let currentIndex = index;
    while (currentIndex < Math.floor(heapSize / 2)) {
        let leftChildIndex = 2 * currentIndex + 1;
        let rightChildIndex = 2 * currentIndex + 2;
        let largerChildIndex = leftChildIndex;
        if (rightChildIndex < heapSize && heap[rightChildIndex] > heap[leftChildIndex]) {
            largerChildIndex = rightChildIndex;
        }
        if (heap[currentIndex] >= heap[largerChildIndex]) {
            break;
        }
        [heap[currentIndex], heap[largerChildIndex]] = [heap[largerChildIndex], heap[currentIndex]];
        steps.push({ heap: [...heap], highlights: { swapped: [currentIndex, largerChildIndex] }, message: `Trickling down ${heap[largerChildIndex]}.` });
        currentIndex = largerChildIndex;
    }
}
