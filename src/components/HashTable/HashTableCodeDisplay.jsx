import React from 'react';

const HashTableCodeDisplay = ({ operation, strategy, tableSize, prime, hash2Formula }) => { // --- Receive new prop ---
    const getCodeSnippets = (size, p, formula) => ({ // --- Receive formula ---
        'hashFunc': `// Primary hash function
public int hashFunc(int key) {
    return key % ${size};
}`,
        // --- Updated to be dynamic ---
        'hashFunc2': `// Secondary hash function for double hashing
public int hashFunc2(int key) {
    // Using user-defined formula: ${formula}
    return ${formula.replace(/\bkey\b/g, 'key').replace(/\bprime\b/g, String(p))};
}`,
        'linear-probing': {
            insert: `// Inserts an item using linear probing
public void insert(DataItem item) {
    int key = item.getKey();
    int hashVal = hashFunc(key);

    // until empty cell or deleted item,
    while(hashArray[hashVal] != null && hashArray[hashVal].getKey() != -1) {
        ++hashVal; // go to next cell
        hashVal %= ${size}; // wraparound with table size
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
        hashVal %= ${size}; // wraparound
    }
    return null; // can't find item
}`,
            delete: `// Deletes an item using linear probing
public DataItem delete(int key) {
    int hashVal = hashFunc(key);
    while (hashArray[hashVal] != null) {
        if (hashArray[hashVal].getKey() == key) {
            DataItem temp = hashArray[hashVal];
            hashArray[hashVal] = nonItem; // nonItem is a special marker for a deleted slot
            return temp;
        }
        ++hashVal;
        hashVal %= ${size};
    }
    return null;
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
        hashVal %= ${size}; // wraparound
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
        hashVal %= ${size}; // wraparound
    }
    return null; // can't find item
}`,
            delete: `// Deleting with quadratic probing is complex and often avoided
// in favor of rehashing or using separate chaining. A simple
// marker-based delete can lead to search failures if not
// handled carefully during insertions. Standard library
// implementations often rehash the table after several deletions.`
        },
        'double-hashing': {
            insert: `// Inserts an item using double hashing
public void insert(int key, DataItem item) {
    int hashVal = hashFunc(key);   // hash the key
    int stepSize = hashFunc2(key); // get step size

    // until empty cell or -1
    while(hashArray[hashVal] != null && hashArray[hashVal].getKey() != -1) {
        hashVal += stepSize;   // add the step
        hashVal %= ${size}; // for wraparound
    }
    hashArray[hashVal] = item; // insert item
}`,
            find: `// Finds an item using double hashing
public DataItem find(int key) {
    int hashVal = hashFunc(key);   // hash the key
    int stepSize = hashFunc2(key); // get step size

    while(hashArray[hashVal] != null) {
        if(hashArray[hashVal].getKey() == key) {
            return hashArray[hashVal];
        }
        hashVal += stepSize;   // add the step
        hashVal %= ${size}; // for wraparound
    }
    return null; // can't find item
}`,
            delete: `// Deletes an item using double hashing
public DataItem delete(int key) {
    int hashVal = hashFunc(key);
    int stepSize = hashFunc2(key);
    while(hashArray[hashVal] != null) {
        if(hashArray[hashVal].getKey() == key) {
            DataItem temp = hashArray[hashVal];
            hashArray[hashVal] = nonItem;
            return temp;
        }
        hashVal += stepSize;
        hashVal %= ${size};
    }
    return null;
}`
        },
        'separate-chaining': {
            insert: `// Inserts a link into the correct list
public void insert(Link theLink) {
    int key = theLink.getKey();
    int hashVal = hashFunc(key); // hash the key
    hashArray[hashVal].insert(theLink); // insert at hashVal
}`,
            find: `// Finds a link in the correct list
public Link find(int key) {
    int hashVal = hashFunc(key); // hash the key
    Link theLink = hashArray[hashVal].find(key); // find in list
    return theLink;
}`,
            delete: `// Deletes a link from the correct list
public void delete(int key) {
    int hashVal = hashFunc(key);
    hashArray[hashVal].delete(key); // delete from list
}`
        }
    });

    const snippets = getCodeSnippets(tableSize, prime, hash2Formula); // Pass formula
    const getCode = () => snippets[strategy]?.[operation] || `// Select an operation to see the code.`;

    return (
        <div className="code-display">
            <h3 className="visualizer-header">Java Implementation</h3>
            <h4>Primary Hash Function:</h4>
            <pre><code>{snippets['hashFunc']}</code></pre>

            {strategy === 'double-hashing' && (
                <>
                    <h4>Secondary Hash Function:</h4>
                    <pre><code>{snippets['hashFunc2']}</code></pre>
                </>
            )}

            <h4>Operation Code ({operation}):</h4>
            <pre><code>{getCode()}</code></pre>
        </div>
    );
};

export default HashTableCodeDisplay;