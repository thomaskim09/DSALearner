import React from 'react';

const codeSnippets = {
    'linear-probing': {
        insert: `// Inserts an item using linear probing 
public void insert(DataItem item) {
    int key = item.getKey();
    int hashVal = hashFunc(key);

    // until empty cell or deleted item,
    while(hashArray[hashVal] != null && hashArray[hashVal].getKey() != -1) {
        ++hashVal; // go to next cell
        hashVal %= arraySize; // wraparound
    }
    hashArray[hashVal] = item;
}`,
       find: `// Finds an item using linear probing 
public DataItem find(int key) {
    int hashVal = hashFunc(key);

    while(hashArray[hashVal] != null) {
        if(hashArray[hashVal].getKey() == key) {
            return hashArray[hashVal]; // yes, return item
        }
        ++hashVal; // go to next cell
        hashVal %= arraySize; // wraparound
    }
    return null; // can't find item
}`
    },
    'quadratic-probing': {
        insert: `// Inserts an item using quadratic probing 
public void insert(int key, DataItem item) {
    int hashVal = hashFunc(key);
    int step = 1;

    while(hashArray[hashVal] != null && hashArray[hashVal].getKey() != -1) {
        hashVal += step * step; // quadratic step
        step++;
        hashVal %= arraySize; // wraparound
    }
    hashArray[hashVal] = item;
}`,
        find: `// Finds an item using quadratic probing 
public DataItem find(int key) {
    int hashVal = hashFunc(key);
    int step = 1;
    
    while(hashArray[hashVal] != null) {
        if(hashArray[hashVal].getKey() == key) {
            return hashArray[hashVal]; // yes, return item
        }
        hashVal += step * step; // quadratic step
        step++;
        hashVal %= arraySize; // wraparound
    }
    return null; // can't find item
}`
    },
    'double-hashing': {
        insert: `// Inserts an item using double hashing
public void insert(int key, DataItem item) {
    int hashVal = hashFunc(key); // hash the key
    int stepSize = hashFunc2(key); // get step size
    
    // until empty cell or -1
    while(hashArray[hashVal] != null && hashArray[hashVal].getKey() != -1) {
        hashVal += stepSize; // add the step
        hashVal %= arraySize; // for wraparound
    }
    hashArray[hashVal] = item; // insert item
}`,
        find: `// Finds an item using double hashing
public DataItem find(int key) {
    int hashVal = hashFunc(key); // hash the key
    int stepSize = hashFunc2(key); // get step size

    while(hashArray[hashVal] != null) {
        if(hashArray[hashVal].getKey() == key) {
            return hashArray[hashVal]; // yes, return item
        }
        hashVal += stepSize; // add the step
        hashVal %= arraySize; // for wraparound
    }
    return null; // can't find item
}`
    },
    'separate-chaining': {
       insert: `// Inserts a link into the correct list 
public void insert(Link theLink) {
    int key = theLink.getKey();
    int hashVal = hashFunc(key); // hash the key
    hashArray[hashVal].insert(theLink); // insert at hashVal
}`,
        find: `// Finds a link in the correct list (not shown in PDF, but implied)
public Link find(int key) {
    int hashVal = hashFunc(key); // hash the key
    Link theLink = hashArray[hashVal].find(key); // find in list
    return theLink;
}`
    }
};

const HashTableCodeDisplay = ({ operation, strategy }) => {
    const getCode = () => {
        return codeSnippets[strategy]?.[operation] || "// Select an operation to see the code.";
    };

    return (
        <div className="code-display">
            <h3>Java Implementation</h3>
            <pre><code>{getCode()}</code></pre>
        </div>
    );
};

export default HashTableCodeDisplay;