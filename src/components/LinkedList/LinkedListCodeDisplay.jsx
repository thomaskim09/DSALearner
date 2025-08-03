import React from 'react';

const codeSnippets = {
    'Singly-Linked': {
        insertFirst: `// Inserts a new link at the beginning of the list.
// Complexity: O(1)
public void insertFirst(int id, double dd) {
  Link newLink = new Link(id, dd); // make new link
  newLink.next = first;            // newLink --> old first
  first = newLink;                 // first --> newLink
}`,
        deleteFirst: `// Deletes the first link from the list.
// Complexity: O(1)
public Link deleteFirst() { 
  Link temp = first;
  first = first.next; // delete it: first-->old next
  return temp;        // return deleted link
}`,
        find: `// Finds a link with a given key.
// Complexity: O(n)
public Link find(int key) { 
  Link current = first;
  while(current.iData != key) {
    if(current.next == null)
      return null; // didn't find it
    else
      current = current.next;
  }
  return current; // found it
}`,
        delete: `// Deletes a link with a given key.
// Complexity: O(n)
public Link delete(int key) {
  Link current = first;
  Link previous = first;
  while(current.iData != key) {
    if(current.next == null)
      return null; // didn't find it
    else {
      previous = current;
      current = current.next;
    }
  }
  if(current == first)
    first = first.next; // if first link, change first
  else
    previous.next = current.next; // bypass it
  return current;
}`
    },
    'Double-Ended': {
        insertLast: `// Inserts a new link at the end of the list.
// Complexity: O(1)
public void insertLast(long dd) {
  Link newLink = new Link(dd);
  if( isEmpty() )
    first = newLink;
  else
    last.next = newLink;
  last = newLink;
}`
    },
    'Sorted': {
        insert: `// Inserts a new link in sorted order.
// Complexity: O(n)
public void insert(long key) {
  Link newLink = new Link(key);
  Link previous = null;
  Link current = first;
  
  while(current != null && key > current.dData) {
    previous = current;
    current = current.next;
  }
  if(previous==null)
    first = newLink;
  else
    previous.next = newLink;
  newLink.next = current;
}`,
        remove: `// Removes the first link (smallest item).
// Complexity: O(1)
public Link remove() {
  Link temp = first;
  first = first.next;
  return temp;
}`
    },
    'Doubly-Linked': {
        insertFirst: `// Inserts at the front of the list.
// Complexity: O(1)
public void insertFirst(long dd) {
  Link newLink = new Link(dd);
  if( isEmpty() )
    last = newLink;
  else
    first.previous = newLink;
  newLink.next = first;
  first = newLink;
}`,
        insertLast: `// Inserts at the end of the list.
// Complexity: O(1)
public void insertLast(long dd) {
  Link newLink = new Link(dd);
  if( isEmpty() )
    first = newLink;
  else {
    last.next = newLink;
    newLink.previous = last;
  }
  last = newLink;
}`,
        insertAfter: `// Inserts a new link after an existing key.
// Complexity: O(n)
public boolean insertAfter(long key, long dd) {
  Link current = first;
  while(current.dData != key) {
    current = current.next;
    if(current == null)
      return false; // didn't find it
  }
  Link newLink = new Link(dd);
  if(current==last) {
    newLink.next = null;
    last = newLink;
  } else {
    newLink.next = current.next;
    current.next.previous = newLink;
  }
  newLink.previous = current;
  current.next = newLink;
  return true;
}`,
        deleteKey: `// Deletes a link with a given key.
// Complexity: O(n)
public Link deleteKey(long key) {
  Link current = first;
  while(current.dData != key) {
    current = current.next;
    if(current == null)
      return null; // didn't find it
  }
  if(current==first)
    first = current.next;
  else
    current.previous.next = current.next;
  
  if(current==last)
    last = current.previous;
  else
    current.next.previous = current.previous;
  return current;
}`
    }
};

const LinkedListCodeDisplay = ({ listType, operation }) => {
    const getCode = () => {
        if (codeSnippets[listType] && codeSnippets[listType][operation]) {
            return codeSnippets[listType][operation];
        }
        // Fallback for operations shared across types
        if (operation === 'insertFirst' && codeSnippets['Singly-Linked']['insertFirst']) {
            return codeSnippets['Singly-Linked']['insertFirst'];
        }
        return "// Select an operation to see the code.";
    };

    return (
        <div className="code-display">
            <pre><code>{getCode()}</code></pre>
        </div>
    );
};

export default LinkedListCodeDisplay;