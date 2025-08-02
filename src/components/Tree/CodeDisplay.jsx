import React from 'react';

const CodeDisplay = ({ operation }) => {
    const codeSnippets = {
        insert: `// Complexity: O(log n) 
// To insert a node, first find the appropriate
// position by traversing from the root. 
// Then, connect the new node as a child.

public void insert(int id, double dd) {
  Node newNode = new Node();
  newNode.iData = id;
  if(root == null)
    root = newNode;
  else {
    Node current = root;
    Node parent;
    while(true) {
      parent = current;
      if(id < current.iData) { // Go left?
        current = current.leftChild;
        if(current == null) {
          parent.leftChild = newNode;
          return;
        }
      } else { // Go right?
        current = current.rightChild;
        if(current == null) {
          parent.rightChild = newNode;
          return;
        }
      }
    }
  }
}`,

        find: `// Complexity: O(log n) 
// Start at the root. If the key is less than the
// current node, go left. If greater, go right,
// until the node is found. 

public Node find(int key) {
  Node current = root;
  while(current.iData != key) {
    if(key < current.iData)
      current = current.leftChild;
    else
      current = current.rightChild;
    if(current == null)
      return null; // Not found
  }
  return current; // Found it
}`,

        delete: `// Complexity: O(log n) 
// Deletion has three cases:
// 1. The node is a leaf (no children). 
// 2. The node has one child. 
// 3. The node has two children. 
// For case 3, replace the node with its
// inorder successor. 

public boolean delete(int key) {
  // ... (code to find node)

  // Case 1: No children
  if(current.leftChild == null && current.rightChild == null) {
    // ... (disconnect from parent)
  }
  // Case 2: One child
  else if(current.rightChild == null) {
    // ... (replace with left subtree)
  }
  else if(current.leftChild == null) {
    // ... (replace with right subtree)
  }
  // Case 3: Two children
  else {
    Node successor = getSuccessor(current);
    // ... (replace current with successor)
  }
  return true;
}`,

        inOrder: `// Complexity: O(n)
// An inorder traversal visits nodes in ascending
// order of their key values. 
// The sequence is: left child, the node
// itself, then the right child. 

private void inOrder(Node localRoot) {
  if(localRoot != null) {
    inOrder(localRoot.leftChild);
    System.out.print(localRoot.iData + " ");
    inOrder(localRoot.rightChild);
  }
}`,

        preOrder: `// Complexity: O(n)
// A preorder traversal visits the node first,
// then its left child, then its right child.

private void preOrder(Node localRoot) {
  if(localRoot != null) {
    System.out.print(localRoot.iData + " ");
    preOrder(localRoot.leftChild);
    preOrder(localRoot.rightChild);
  }
}`,

        postOrder: `// Complexity: O(n)
// A postorder traversal visits the left child,
// then the right child, and finally the node
// itself. 

private void postOrder(Node localRoot) {
  if(localRoot != null) {
    postOrder(localRoot.leftChild);
    postOrder(localRoot.rightChild);
    System.out.print(localRoot.iData + " ");
  }
}`,
    };

    return (
        <div className="code-display">
            <pre dangerouslySetInnerHTML={{ __html: codeSnippets[operation] || codeSnippets.insert }} />
        </div>
    );
};

export default CodeDisplay;