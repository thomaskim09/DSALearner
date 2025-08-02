import React from 'react';

const codeSnippets = {
  insert: `// Complexity: O(log n)
public void insert(int value) {
  Node newNode = new Node(value);
  if (root == null) {
    root = newNode;
    return;
  }
  Node current = root;
  while (true) {
    if (value < current.value) {
      if (current.left == null) {
        current.left = newNode;
        return;
      }
      current = current.left;
    } else {
      if (current.right == null) {
        current.right = newNode;
        return;
      }
      current = current.right;
    }
  }
}`,
  find: `// Complexity: O(log n)
public Node find(int value) {
  Node current = root;
  while (current != null) {
    if (value == current.value) {
      return current;
    } else if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return null; // Not found
}`,
  delete: `// Complexity: O(log n)
public Node deleteNode(Node node, int value) {
    if (node == null) return null;

    if (value < node.value) {
        node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
    } else {
        // Node with only one child or no child
        if (node.left == null) return node.right;
        if (node.right == null) return node.left;

        // Node with two children: Get the inorder successor
        Node successor = findMin(node.right);
        node.value = successor.value;
        node.right = deleteNode(node.right, successor.value);
    }
    return node;
}`,
    inOrder: `// Complexity: O(n)
public void inOrder(Node node) {
    if (node != null) {
        inOrder(node.left);
        System.out.print(node.value + " ");
        inOrder(node.right);
    }
}`,
    preOrder: `// Complexity: O(n)
public void preOrder(Node node) {
    if (node != null) {
        System.out.print(node.value + " ");
        preOrder(node.left);
        preOrder(node.right);
    }
}`,
    postOrder: `// Complexity: O(n)
public void postOrder(Node node) {
    if (node != null) {
        postOrder(node.left);
        postOrder(node.right);
        System.out.print(node.value + " ");
    }
}`,
  clear: `// Clears all nodes from the tree
public void clearTree() {
    root = null;
}`
};

const CodeDisplay = ({ operation }) => {
  return (
    <div className="code-display">
      <h4>Code: {operation}</h4>
      <pre><code>{codeSnippets[operation] || 'Select an operation to see the code.'}</code></pre>
    </div>
  );
};

export default CodeDisplay;
