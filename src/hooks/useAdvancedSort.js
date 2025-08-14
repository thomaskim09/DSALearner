import { useState, useCallback } from 'react';

export const useAdvancedSort = () => {
    const [history, setHistory] = useState([]);

    const sort = useCallback((array, type, options) => {
        let sortedHistory = [];
        switch (type) {
            case 'shell':
                sortedHistory = shellSort(array, options.shellSequence);
                break;
            case 'quick':
                sortedHistory = quickSort(array);
                break;
            default:
                sortedHistory = [];
        }
        setHistory(sortedHistory);
    }, []);

    return { history, sort };
};

// --- Shell Sort (Correct) ---
function shellSort(inputArray, sequenceType) {
    const arr = [...inputArray];
    const n = arr.length;
    const history = [{
        array: [...arr],
        highlights: {},
        message: `Original array.`
    }];

    let gaps = [];
    if (sequenceType === 'knuth') {
        let h = 1;
        while (h <= n / 3) { h = h * 3 + 1; }
        while (h > 0) {
            gaps.push(h);
            h = Math.floor((h - 1) / 3);
        }
    } else {
        let h = Math.floor(n / 2);
        while (h > 0) {
            gaps.push(h);
            h = Math.floor(h / 2);
        }
    }
    
    for (const h of gaps) {
        for (let i = h; i < n; i++) {
            let temp = arr[i];
            let j = i;
            while (j >= h && arr[j - h] > temp) {
                arr[j] = arr[j - h];
                j -= h;
            }
            arr[j] = temp;
        }
        history.push({
            array: [...arr],
            highlights: { gap: h },
            message: `After h=${h} pass. Elements ${h} positions apart are sorted.`
        });
    }

    if (history.length > 1) {
        history[history.length - 1].message = 'Array is fully sorted.';
    }
    return history;
}


// --- Quick Sort (Final Version) ---
function quickSort(inputArray) {
    const arr = [...inputArray];
    const history = [{
        array: [...arr], highlights: {}, message: 'Initial unsorted array.'
    }];
    const sorted = new Set();

    recQuickSort(arr, 0, arr.length - 1, history, sorted);
    
    // **THE FIX IS HERE:** The redundant block that added the extra row has been removed.
    // The recursion now correctly produces the final sorted state as its last step.

    return history;
}

function recQuickSort(arr, left, right, history, sorted) {
    if (right - left <= 0) {
        if (right === left && !sorted.has(left)) {
            sorted.add(left);
            history.push({
                array: [...arr],
                highlights: { sortedIndices: [...sorted], newlySortedIndex: left },
                message: `Index ${left} fixed. Value ${arr[left]} is sorted.`
            });
        }
        return;
    }

    const pivotValue = arr[right];
    const pivotIndex = partitionIt(arr, left, right);

    sorted.add(pivotIndex);
    history.push({
        array: [...arr],
        highlights: { sortedIndices: [...sorted], newlySortedIndex: pivotIndex },
        message: `Pivot ${pivotValue} placed at index ${pivotIndex}.`
    });

    recQuickSort(arr, left, pivotIndex - 1, history, sorted);
    recQuickSort(arr, pivotIndex + 1, right, history, sorted);
}

function partitionIt(arr, left, right) {
    const pivot = arr[right];
    let leftPtr = left - 1;
    let rightPtr = right;

    while (true) {
        while (arr[++leftPtr] < pivot);
        while (rightPtr > 0 && arr[--rightPtr] > pivot);

        if (leftPtr >= rightPtr) {
            break; 
        } else {
            [arr[leftPtr], arr[rightPtr]] = [arr[rightPtr], arr[leftPtr]];
        }
    }

    [arr[leftPtr], arr[right]] = [arr[right], arr[leftPtr]];
    
    return leftPtr;
}