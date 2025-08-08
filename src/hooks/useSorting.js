import { useState } from 'react';

export const useSorting = () => {
    const [history, setHistory] = useState([]);

    const sort = (array, type) => {
        setHistory([]); 
        switch (type) {
            case 'bubble':
                setHistory(bubbleSort(array));
                break;
            case 'selection':
                setHistory(selectionSort(array));
                break;
            case 'insertion':
                setHistory(insertionSort(array));
                break;
            default:
                setHistory([]);
        }
    };

    return { history, sort };
};

// --- Sorting Algorithms ---

function bubbleSort(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;
    const history = [{ 
        array: [...inputArray], 
        highlights: {},
        message: 'Initial unsorted array.'
    }];

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
        history.push({
            array: [...arr],
            highlights: { 
                sortedStartIndex: n - 1 - i 
            },
            message: `Pass ${i + 1}: The largest unsorted element (${arr[n - 1 - i]}) is now in its correct position.`
        });
    }
     history.push({
        array: [...arr],
        highlights: { sortedStartIndex: 0 },
        message: 'Array is fully sorted.'
    });
    return history;
}

function selectionSort(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;
    const history = [{ 
        array: [...inputArray], 
        highlights: {},
        message: 'Initial unsorted array.'
    }];

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        const minValue = arr[minIdx];
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        
        history.push({
            array: [...arr],
            highlights: { 
                sortedEndIndex: i,
                minInPass: i,
                swappedFrom: minIdx
            },
            message: `Pass ${i + 1}: Found minimum (${minValue}) and swapped it into sorted position at index ${i}.`
        });
    }
     history.push({
        array: [...arr],
        highlights: { sortedEndIndex: n - 1 },
        message: 'Array is fully sorted.'
    });
    return history;
}


function insertionSort(inputArray) {
    const arr = [...inputArray];
    const n = arr.length;
    const history = [{ 
        array: [...inputArray], 
        highlights: {},
        message: 'Initial unsorted array.'
    }];

    for (let i = 1; i < n; i++) {
        let current = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = current;
        history.push({
            array: [...arr],
            highlights: { 
                insertedIndex: j + 1,
                sortedEndIndex: i
            },
            message: `Pass ${i}: Inserted value ${current} into its correct sorted position at index ${i}.`
        });
    }
     history.push({
        array: [...arr],
        highlights: { sortedEndIndex: n - 1 },
        message: 'Array is fully sorted.'
    });
    return history;
}