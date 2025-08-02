import { useState, useEffect, useCallback } from 'react';

let nodeIdCounter = 0;

class Node {
  constructor(value) {
    this.value = value;
    this.id = `node-${nodeIdCounter++}`;
    this.left = null;
    this.right = null;
  }
}

const deepCopyTree = (node) => {
  if (!node) return null;
  const newNode = new Node(node.value);
  newNode.id = node.id;
  newNode.left = deepCopyTree(node.left);
  newNode.right = deepCopyTree(node.right);
  return newNode;
};

export const useBinarySearchTree = () => {
  const [root, setRoot] = useState(null);

  const loadDummyData = useCallback(() => {
    nodeIdCounter = 0;
    const dummyValues = [50, 30, 70, 20, 40, 60, 80, 25, 35, 75];
    let newRoot = null;

    const insertLight = (node, value) => {
        if (!node) return new Node(value);
        if (value < node.value) {
            node.left = insertLight(node.left, value);
        } else {
            node.right = insertLight(node.right, value);
        }
        return node;
    };

    dummyValues.forEach(value => newRoot = insertLight(newRoot, value));
    setRoot(newRoot);
  }, []);

  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);

  const insert = (value) => {
    const newNode = new Node(value);
    if (!root) {
      setRoot(newNode);
      return newNode;
    }
    let current = root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
    setRoot({ ...root });
    return newNode;
  };

  const find = (value) => {
    const steps = [];
    let current = root;
    while (current) {
        steps.push({ type: 'compare', nodeId: current.id, message: `Comparing with ${current.value}` });
        if (value === current.value) {
            steps.push({ type: 'found', nodeId: current.id, message: `Node ${value} found!` });
            return steps;
        }
        current = value < current.value ? current.left : current.right;
    }
    steps.push({ type: 'not-found', value, message: `Node ${value} not found.` });
    return steps;
  };

  const deleteNode = (value) => {
    const steps = [];
    if (!root) return steps;
    const rootCopy = deepCopyTree(root);

    const deleteRecursively = (node, val) => {
      if (!node) {
        steps.push({ type: 'not-found', value: val, message: `Node ${val} not found.` });
        return null;
      }

      steps.push({ type: 'compare', nodeId: node.id, message: `Comparing with ${node.value}` });

      if (val < node.value) {
        node.left = deleteRecursively(node.left, val);
      } else if (val > node.value) {
        node.right = deleteRecursively(node.right, val);
      } else {
        steps.push({ type: 'found', nodeId: node.id, message: `Node ${node.value} found.` });

        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let successor = node.right;
        steps.push({ type: 'find-successor', nodeId: successor.id, message: `Finding successor...` });
        while (successor.left) {
            successor = successor.left;
            steps.push({ type: 'find-successor', nodeId: successor.id, message: `Successor is ${successor.value}` });
        }

        steps.push({ type: 'replace', message: `Replacing ${node.value} with ${successor.value}` });
        node.value = successor.value;
        node.id = successor.id;
        node.right = deleteRecursively(node.right, successor.value);
      }
      return node;
    };

    const newRoot = deleteRecursively(rootCopy, value);
    if (steps.some(s => s.type === 'found')) {
        steps.push({ type: 'deleted', finalTree: newRoot, message: "Deletion complete." });
    }
    return steps;
  };

  const inOrderTraversal = () => {
    const steps = [];
    const traverse = n => n && (traverse(n.left), steps.push({ type: 'visit', nodeId: n.id, nodeValue: n.value }), traverse(n.right));
    traverse(root);
    return steps;
  };

  const preOrderTraversal = () => {
    const steps = [];
    const traverse = n => n && (steps.push({ type: 'visit', nodeId: n.id, nodeValue: n.value }), traverse(n.left), traverse(n.right));
    traverse(root);
    return steps;
  };

  const postOrderTraversal = () => {
    const steps = [];
    const traverse = n => n && (traverse(n.left), traverse(n.right), steps.push({ type: 'visit', nodeId: n.id, nodeValue: n.value }));
    traverse(root);
    return steps;
  };

  const clear = () => setRoot(null);
  const refreshTree = () => { loadDummyData(); };
  const getTreeHeight = (node) => 1 + (node ? Math.max(getTreeHeight(node.left), getTreeHeight(node.right)) : -1);

  return { root, insert, find, deleteNode, inOrderTraversal, preOrderTraversal, postOrderTraversal, clear, refreshTree, getTreeHeight, setRoot };
};