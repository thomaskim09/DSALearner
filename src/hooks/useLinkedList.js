import { useState, useEffect } from 'react';
import { ListNode } from '/src/utils/dataStructures.js';

export const useLinkedList = () => {
  const [head, setHead] = useState(null);

  const loadDummyData = () => {
    let currentHead = null;
    let tail = null;
    [10, 25, 5, 40, 15].forEach(val => {
        const newNode = new ListNode(val);
        if (!currentHead) {
            currentHead = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
    });
    setHead(currentHead);
  };

  useEffect(() => {
    loadDummyData();
  }, []);

  const insertFirst = (value) => {
    const steps = [];
    const newNode = new ListNode(value);
    steps.push({ type: 'create', node: {id: newNode.id, value: newNode.value}, message: `Create new node with value ${value}` });
    
    const currentHead = head; // Capture current head for the final state
    newNode.next = currentHead;
    
    steps.push({ type: 'update-head', nodeId: newNode.id, message: `New node becomes the new head.` });
    steps.push({ finalState: newNode, message: 'Insertion complete.' });
    return steps;
  };

  const deleteFirst = () => {
    const steps = [];
    if (!head) {
        steps.push({ message: 'List is empty, cannot delete.' });
        return steps;
    }
    steps.push({ type: 'highlight', nodeId: head.id, message: `Highlighting head node for deletion.` });
    const newHead = head.next;
    steps.push({ finalState: newHead, message: 'Deletion complete.' });
    return steps;
  };

  const insertLast = (value) => {
    const steps = [];
    const newNode = new ListNode(value);
    steps.push({ type: 'create', node: {id: newNode.id, value: newNode.value}, message: `Create new node with value ${value}` });

    if (!head) {
        steps.push({ type: 'update-head', nodeId: newNode.id, message: `List was empty, new node is now the head.` });
        steps.push({ finalState: newNode, message: 'Insertion at end complete.' });
    } else {
        let current = head;
        while (current.next) {
            steps.push({ type: 'highlight', nodeId: current.id, message: `Traversing to find the end of the list...` });
            current = current.next;
        }
        steps.push({ type: 'highlight', nodeId: current.id, message: `Reached the last node. Updating its next pointer.` });
        current.next = newNode;
        
        const finalHead = { ...head };
        steps.push({ finalState: finalHead, message: 'Insertion at end complete.' });
    }
    return steps;
  };

  const find = (value) => {
      const steps = [];
      let current = head;
      let found = false;
      while(current) {
          steps.push({ type: 'highlight', nodeId: current.id, message: `Comparing with ${current.value}...` });
          if (current.value == value) {
              steps.push({ type: 'found', nodeId: current.id, message: `Found node with value ${value}.` });
              found = true;
              break;
          }
          current = current.next;
      }
      if (!found) {
        steps.push({ message: `Node with value ${value} not found.`});
      }
      return steps;
  };

  const deleteByKey = (value) => {
    const steps = [];
    if (!head) {
        steps.push({ message: 'List is empty.' });
        return steps;
    }

    steps.push({ type: 'highlight', nodeId: head.id, message: `Starting search for node with value ${value}` });
    if (head.value == value) {
        const newHead = head.next;
        steps.push({ finalState: newHead, message: `Deleted head node with value ${value}.` });
        return steps;
    }

    let current = head;
    while (current.next && current.next.value != value) {
        current = current.next;
        steps.push({ type: 'highlight', nodeId: current.id, message: `Checking next node...` });
    }

    if (current.next) {
        steps.push({ type: 'delete', nodeId: current.next.id, message: `Found and deleting node with value ${value}` });
        current.next = current.next.next;
        const finalHead = { ...head };
        steps.push({ finalState: finalHead, message: 'Deletion complete.' });
    } else {
        steps.push({ message: `Node with value ${value} not found.` });
    }
    return steps;
  };
  
  const clear = () => setHead(null);
  const refreshList = () => loadDummyData();

  return { head, setHead, insertFirst, deleteFirst, insertLast, find, deleteByKey, clear, refreshList };
};