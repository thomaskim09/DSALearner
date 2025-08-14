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
        while (h <= n / 3) {
            h = h * 3 + 1;
        }
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


// --- Quick Sort (Based on Provided Study Materials) ---
function quickSort(inputArray) {
    const arr = [...inputArray];
    const history = [{
        array: [...arr],
        highlights: {},
        message: 'Initial unsorted array.'
    }];
    const sorted = new Set();

    // Start the recursive sorting process
    recQuickSort(arr, 0, arr.length - 1, history, sorted);

    // Final message for the last step
    if (history.length > 1) {
        history[history.length-1].message = 'Array is fully sorted.';
    }

    return history;
}

/**
 * This recursive function implements the quicksort logic.
 * It follows the guide's model[cite: 291]:
 * 1. Handle the base case (sub-array is size 1 or 0).
 * 2. Partition the array.
 * 3. Recursively call itself to sort the left part[cite: 304].
 * 4. Recursively call itself to sort the right part[cite: 305].
 */
function recQuickSort(arr, left, right, history, sorted) {
    // Base case: If the sub-array has 0 or 1 elements, it's already sorted.
    if (left >= right) {
        if (left === right && !sorted.has(left)) {
             sorted.add(left);
             history.push({
                array: [...arr],
                highlights: { sortedIndices: [...sorted], newlySortedIndex: left },
                message: `Index ${left} fixed. Value ${arr[left]} is sorted.`
            });
        }
        return;
    }

    // 1. Select the rightmost item as the pivot.
    const pivotValue = arr[right];
    
    // 2. Partition the array and get the pivot's final index[cite: 303].
    const pivotIndex = partitionIt(arr, left, right, pivotValue);

    // Record the state after this partition
    sorted.add(pivotIndex);
    history.push({
        array: [...arr],
        highlights: { sortedIndices: [...sorted], newlySortedIndex: pivotIndex },
        message: `Pivot ${pivotValue} placed at index ${pivotIndex}.`
    });

    // 3. Recursively sort the left and right sub-arrays
    recQuickSort(arr, left, pivotIndex - 1, history, sorted);
    recQuickSort(arr, pivotIndex + 1, right, history, sorted);
}

/**
 * Partitions the array using the Lomuto scheme, similar to the one on p.26 of the guide.
 * It places all elements smaller than the pivot to the left, and all elements
 * larger to the right. It then places the pivot in its final sorted position.
 */
function partitionIt(arr, left, right) {
    // The value of the rightmost element is chosen as the pivot.
    const pivot = arr[right]; 
    
    // 'i' is the pointer for the last element that was smaller than the pivot.
    let i = left - 1;

    // Iterate through the array from the left up to the element before the pivot.
    for (let j = left; j < right; j++) {
        // If the current element is less than or equal to the pivot...
        if (arr[j] <= pivot) {
            // ...move the boundary for smaller elements...
            i++;
            // ...and swap the current element into the "smaller" section.
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        }
    }

    // Finally, swap the pivot (arr[right]) into its correct final position,
    // which is just after the last smaller element.
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    
    // Return the pivot's final index.
    return i + 1;
}