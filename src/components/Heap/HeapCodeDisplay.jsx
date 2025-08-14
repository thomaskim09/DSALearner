import React from 'react';

const HeapCodeDisplay = ({ operation }) => {
    const codeSnippets = {
        insert: `// Inserts a new node into the heap.
// Complexity: O(log n) [cite: 234]
public boolean insert(int key) {
    if(currentSize == maxSize)
        return false;
    Node newNode = new Node(key);
    heapArray[currentSize] = newNode;
    trickleUp(currentSize++);
    return true;
}

public void trickleUp(int index) {
    int parent = (index - 1) / 2;
    Node bottom = heapArray[index];
    while(index > 0 && heapArray[parent].getKey() < bottom.getKey()) {
        heapArray[index] = heapArray[parent]; // move parent down
        index = parent;
        parent = (parent - 1) / 2;
    }
    heapArray[index] = bottom;
}`,
        remove: `// Removes the maximum node (the root).
// Complexity: O(log n) [cite: 234]
public Node remove() {
    Node root = heapArray[0];
    heapArray[0] = heapArray[--currentSize];
    trickleDown(0);
    return root;
}

public void trickleDown(int index) {
    int largerChild;
    Node top = heapArray[index];
    while(index < currentSize / 2) { // while node has at least one child
        int leftChild = 2 * index + 1;
        int rightChild = leftChild + 1;

        if(rightChild < currentSize && heapArray[leftChild].getKey() < heapArray[rightChild].getKey())
            largerChild = rightChild;
        else
            largerChild = leftChild;

        if(top.getKey() >= heapArray[largerChild].getKey())
            break;

        heapArray[index] = heapArray[largerChild];
        index = largerChild;
    }
    heapArray[index] = top;
}`,
        heapSort: `// Sorts an array using heapsort.
// Complexity: O(n log n) [cite: 259]
public void heapSort(int[] array) {
    int n = array.length;

    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--) {
        trickleDown(i, n);
    }

    // One by one extract an element from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        int temp = array[0];
        array[0] = array[i];
        array[i] = temp;

        // call max heapify on the reduced heap
        trickleDown(0, i);
    }
}`
    };

    return (
        <div className="code-display">
            <h3>Java Implementation</h3>
            <pre><code>{codeSnippets[operation] || codeSnippets.insert}</code></pre>
        </div>
    );
};

export default HeapCodeDisplay;