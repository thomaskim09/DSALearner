import { useState, useCallback, useEffect } from 'react';

let nodeIdCounter = 0;

class ListNode {
  constructor(value) {
    this.value = value;
    this.id = `node-${nodeIdCounter++}`;
    this.next = null;
  }
}

export const useLinkedList = () => {
  const [head, setHead] = useState(null);

  const loadDummyData = useCallback(() => {
    nodeIdCounter = 0;
    const dummyValues = [11, 88, 44, 22];
    let newHead = null;
    let tail = null;
    dummyValues.forEach(value => {
        const newNode = new ListNode(value);
        if (!newHead) {
            newHead = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
    });
    setHead(newHead);
  }, []);

  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);

  const insertFirst = (value) => {
    const steps = [];
    const newNode = new ListNode(value);
    steps.push({ type: 'create', node: {id: newNode.id, value: newNode.value}, message: `Create new node with value ${value}` });
    
    if (head) {
        steps.push({ type: 'highlight', nodeId: head.id, message: `Set new node's next to current head` });
    }
    newNode.next = head;
    setHead(newNode);

    steps.push({ type: 'update-head', nodeId: newNode.id, message: `New node is now the head.` });
    steps.push({ finalState: newNode, message: 'Insertion complete.' });
    
    return steps;
  };

  const deleteFirst = () => {
    const steps = [];
    if (!head) {
        steps.push({ message: 'List is empty, nothing to delete.'});
        return steps;
    }
    steps.push({ type: 'highlight', nodeId: head.id, message: `Removing head node with value ${head.value}` });
    const newHead = head.next;
    setHead(newHead);

    if(newHead){
        steps.push({ type: 'update-head', nodeId: newHead.id, message: `Node ${newHead.value} is now the head.` });
    } else {
        steps.push({ message: 'List is now empty.'});
    }

    steps.push({ finalState: newHead, message: 'Deletion complete.' });
    return steps;
  };
  
  const clear = () => setHead(null);
  const refreshList = () => loadDummyData();

  return { head, setHead, insertFirst, deleteFirst, clear, refreshList };
};