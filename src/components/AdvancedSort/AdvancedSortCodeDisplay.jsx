import React from 'react';

const AdvancedSortCodeDisplay = ({ sortType }) => {
    const snippets = {
        shell: {
            code: `// Shellsort using Knuth's interval sequence
public void shellSort() {
    int inner, outer;
    long temp;
    int h = 1;
    while(h <= nElems/3) {
        h = h*3 + 1; // 1, 4, 13, 40, 121,...
    }
    while(h > 0) {
        for(outer=h; outer<nElems; outer++) {
            temp = theArray[outer];
            inner = outer;
            while(inner > h-1 && theArray[inner-h] >= temp) {
                theArray[inner] = theArray[inner-h];
                inner -= h;
            }
            theArray[inner] = temp;
        }
        h = (h-1) / 3; // decrease h
    }
}`,
            complexity: "O(N^(3/2)) or O(N^(5/4))"
        },
        quick: {
            code: `// Quicksort using rightmost element as pivot
public void recQuickSort(int left, int right) {
    if(right-left <= 0) // if size <= 1,
        return;          // already sorted
    else {
        long pivot = theArray[right];
        int partition = partitionIt(left, right, pivot);
        recQuickSort(left, partition-1);   // sort left side
        recQuickSort(partition+1, right);  // sort right side
    }
}

public int partitionIt(int left, int right, long pivot) {
    int leftPtr = left-1;
    int rightPtr = right;
    while(true) {
        while(theArray[++leftPtr] < pivot); // find bigger
        while(rightPtr > 0 && theArray[--rightPtr] > pivot); // find smaller

        if(leftPtr >= rightPtr) // if pointers cross,
            break;              // partition done
        else
            swap(leftPtr, rightPtr); // swap elements
    }
    swap(leftPtr, right); // restore pivot
    return leftPtr;       // return pivot location
}`,
            complexity: "O(N*logN) average, O(N²) worst-case"
        },
    };

    const info = snippets[sortType];
    const sortName = sortType.charAt(0).toUpperCase() + sortType.slice(1);

    return (
        <div className="code-display-sort">
            <h3>{sortName} Sort</h3>
            <div className="complexity-display">
                <strong>Time Complexity:</strong> {info.complexity}
            </div>
            <pre><code>{info.code}</code></pre>
        </div>
    );
};

export default AdvancedSortCodeDisplay;