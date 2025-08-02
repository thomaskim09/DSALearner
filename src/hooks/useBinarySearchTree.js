import { useState, useEffect, useCallback } from 'react';

// Node class for the tree
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export const useBinarySearchTree = () => {
  const [root, setRoot] = useState(null);

  const loadDummyData = useCallback(() => {
    const dummyValues = [50, 30, 70, 20, 40, 60, 80, 15, 25, 35, 45, 55, 65, 75, 85];
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

    dummyValues.forEach(value => {
        newRoot = insertLight(newRoot, value);
    });

    setRoot(newRoot);
  }, []);

  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);

  const insert = (value) => {
    const newNode = new Node(value);
    if (!root) {
      setRoot(newNode);
      return;
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
  };

  // Updated to return animation steps
  const find = (value) => {
    const steps = [];
    let current = root;
    while (current) {
        steps.push({ type: 'compare', nodeValue: current.value });
        if (value === current.value) {
            steps.push({ type: 'found', nodeValue: current.value });
            return steps;
        }
        current = value < current.value ? current.left : current.right;
    }
    steps.push({ type: 'not-found', value });
    return steps;
  };

  const deleteNode = (value) => {
    const deleteRecursively = (node, val) => {
      if (!node) return null;
      if (val < node.value) {
        node.left = deleteRecursively(node.left, val);
      } else if (val > node.value) {
        node.right = deleteRecursively(node.right, val);
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let successor = node.right;
        while (successor.left) successor = successor.left;
        node.value = successor.value;
        node.right = deleteRecursively(node.right, successor.value);
      }
      return node;
    };
    const newRoot = deleteRecursively(root, value);
    setRoot(newRoot ? { ...newRoot } : null);
  };

  const inOrderTraversal = () => {
    const steps = [];
    const traverse = n => n && (traverse(n.left), steps.push({ type: 'visit', nodeValue: n.value }), traverse(n.right));
    traverse(root);
    return steps;
  };

  const preOrderTraversal = () => {
    const steps = [];
    const traverse = n => n && (steps.push({ type: 'visit', nodeValue: n.value }), traverse(n.left), traverse(n.right));
    traverse(root);
    return steps;
  };

  const postOrderTraversal = () => {
    const steps = [];
    const traverse = n => n && (traverse(n.left), traverse(n.right), steps.push({ type: 'visit', nodeValue: n.value }));
    traverse(root);
    return steps;
  };
  
  const clear = () => setRoot(null);

  const refreshTree = () => {
    clear();
    setTimeout(() => loadDummyData(), 50);
  };

  const getTreeHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  return { root, insert, find, deleteNode, inOrderTraversal, preOrderTraversal, postOrderTraversal, clear, refreshTree, getTreeHeight };
};
