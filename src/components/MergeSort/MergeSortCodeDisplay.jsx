import React from 'react';

const MergeSortCodeDisplay = () => {
    const code = `
private void recMergeSort(long[] workSpace, int lowerBound, int upperBound)
{
    if(lowerBound == upperBound) // if range is 1,
        return; // no use sorting
    else
    {
        // find midpoint
        int mid = (lowerBound+upperBound) / 2;
        // sort low half
        recMergeSort(workSpace, lowerBound, mid);
        // sort high half
        recMergeSort(workSpace, mid+1, upperBound);
        // merge them
        merge(workSpace, lowerBound, mid+1, upperBound);
    } // end else
} // end recMergeSort()
    `;

    return (
        <div className="code-display-sort">
            <h3>Merge Sort</h3>
            <div className="complexity-display">
               <strong>Time Complexity:</strong> O(N*logN)
            </div>
            <pre><code>{code}</code></pre>
        </div>
    );
};

export default MergeSortCodeDisplay;