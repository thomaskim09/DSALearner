// A unique ID generator for nodes to help React with rendering.
let idCounter = 0;

/**
 * A node for a singly-linked list.
 */
export class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.id = `ll-node-${idCounter++}`; // Unique ID for React keys
    }
}

/**
 * A node for a binary search tree.
 */
export class TreeNode {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.id = `tree-node-${idCounter++}`; // Unique ID for React keys
    }
}