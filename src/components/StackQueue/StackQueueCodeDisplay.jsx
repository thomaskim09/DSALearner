import React from 'react';

// Snippets from chap5_stackQueues.pdf
const codeSnippets = {
    stack: {
        push: `public void push(long j) {
  // put item on top of stack
  stackArray[++top] = j;
}`, 
        pop: `public long pop() {
  // take item from top of stack
  return stackArray[top--];
}` 
    },
    queue: {
        insert: `public void insert(long j) {
  // put item at rear of queue
  if(rear == maxSize-1)
    rear = -1; // deal with wraparound
  queArray[++rear] = j;
  nItems++;
}`, 
        remove: `public long remove() {
  // take item from front of queue
  long temp = queArray[front++];
  if(front == maxSize)
    front = 0; // deal with wraparound
  nItems--;
  return temp;
}` 
    },
    priorityQueue: {
        insert: `public void insert(long item) {
    int j;
    if(nItems==0)
        queArray[nItems++] = item;
    else {
        for(j=nItems-1; j>=0; j--) {
            if(item > queArray[j])
                queArray[j+1] = queArray[j];
            else
                break;
        }
        queArray[j+1] = item;
        nItems++;
    }
}`, 
        remove: `public long remove() {
  // remove minimum item
  return queArray[--nItems];
}` 
    }
};

const StackQueueCodeDisplay = ({ type, operation }) => {
    const getCode = () => {
        return codeSnippets[type]?.[operation] || '// Hover over an action to see its code.';
    };

    return (
        <div className="code-display">
            <h3>Java Implementation</h3>
            <pre><code>{getCode()}</code></pre>
        </div>
    );
};

export default StackQueueCodeDisplay;