import React from 'react';

// Code snippets extracted from chap6_LinkedLists.pdf
const codeSnippets = {
    'Singly-Linked': {
        insertFirst: `// Inserts a new link at the beginning of the list.
// Complexity: O(1)
public void insertFirst(int id, double dd) {
  Link newLink = new Link(id, dd); // make new link,
  newLink.next = first;            // newLink --> old first
  first = newLink;                 // first --> newLink
}`,
        deleteFirst: `// Deletes the first link from the list.
// Complexity: O(1)
public Link deleteFirst() { // delete first item
  Link temp = first;       // save reference to link
  first = first.next;      // delete it: first-->old next
  return temp;             // return deleted link
}`,
        find: `// Finds a link with a given key.
// Complexity: O(n)
public Link find(int key) { // find link with given key
  Link current = first;    // start at 'first'
  while(current.iData != key) {
    if(current.next == null) // if end of list,
      return null;           // didn't find it
    else
      current = current.next; // go to next link
  }
  return current; // found it
}`,
        delete: `// Deletes a link with a given key.
// Complexity: O(n)
public Link delete(int key) { // delete link with given key
  Link current = first;
  Link previous = first;
  while(current.iData != key) {
    if(current.next == null)
      return null; // didn't find it
    else {
      previous = current; // go to next link
      current = current.next;
    }
  } // found it
  if(current == first)
    first = first.next; // if first link, change first
  else
    previous.next = current.next; // bypass it
  return current;
}`
    },
    'Double-Ended': {
        insertFirst: `// Inserts a new link at the front of the list.
// Complexity: O(1)
public void insertFirst(long dd) {
  Link newLink = new Link(dd); // make new link
  if( isEmpty() )              // if empty list,
    last = newLink;            // newLink <-- last
  newLink.next = first;        // newLink --> old first
  first = newLink;             // first --> newLink
}`,
        insertLast: `// Inserts a new link at the end of the list.
// Complexity: O(1)
public void insertLast(long dd) {
  Link newLink = new Link(dd); // make new link
  if( isEmpty() )              // if empty list,
    first = newLink;           // first --> newLink
  else
    last.next = newLink;       // old last --> newLink
  last = newLink;              // newLink <-- last
}`,
        deleteFirst: `// Deletes the first link from the list.
// Complexity: O(1)
public long deleteFirst() { // (assumes non-empty list)
  long temp = first.dData;
  if(first.next == null)   // if only one item
    last = null;           // null <-- last
  first = first.next;      // first --> old next
  return temp;
}`
    },
    'Sorted': {
        insert: `// Inserts a new link in sorted order.
// This is the primary insertion method for a sorted list.
// Complexity: O(n)
public void insert(long key) {
  Link newLink = new Link(key); // make new link
  Link previous = null;
  Link current = first;
  // until end of list or key > current,
  while(current != null && key > current.dData) { 
    previous = current;
    current = current.next; // go to next item
  }
  if(previous==null)          // at beginning of list
    first = newLink;          // first --> newLink
  else                        // not at beginning
    previous.next = newLink;  // old prev --> newLink
  newLink.next = current;     // newLink --> old current
}`,
        remove: `// Removes the first link (smallest item).
// Complexity: O(1)
public Link remove() { // (assumes non-empty list)
  Link temp = first;   // save first
  first = first.next;  // delete first
  return temp;         // return value
}`
    },
    'Doubly-Linked': {
        insertFirst: `// Inserts at the front of the list.
// Complexity: O(1)
public void insertFirst(long dd) {
  Link newLink = new Link(dd);   // make new link
  if( isEmpty() )                // if empty list,
    last = newLink;              // newLink <-- last
  else
    first.previous = newLink;    // newLink <-- old first
  newLink.next = first;          // newLink --> old first
  first = newLink;               // first --> newLink
}`,
        insertLast: `// Inserts at the end of the list.
// Complexity: O(1)
public void insertLast(long dd) {
  Link newLink = new Link(dd);   // make new link
  if( isEmpty() )                // if empty list,
    first = newLink;             // first --> newLink
  else {
    last.next = newLink;         // old last --> newLink
    newLink.previous = last;     // old last <-- newLink
  }
  last = newLink;                // newLink <-- last
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
  if(current==last) { // if last link
    newLink.next = null;
    last = newLink; // newLink <-- last
  } else { // not last link
    newLink.next = current.next;
    current.next.previous = newLink;
  }
  newLink.previous = current;
  current.next = newLink;
  return true; // found it, did insertion
}`,
        delete: `// Deletes a link with a given key.
// Complexity: O(n)
public Link deleteKey(long key) {
  Link current = first;
  while(current.dData != key) {
    current = current.next;
    if(current == null)
      return null; // didn't find it
  }
  if(current==first) // found it; first item?
    first = current.next; // first --> old next
  else // not first
    current.previous.next = current.next;
  
  if(current==last) // last item?
    last = current.previous; // old previous <-- last
  else // not last
    current.next.previous = current.previous;
  return current;
}`
    }
};

const LinkedListCodeDisplay = ({ listType, operation }) => {
    const getCode = () => {
        const listCode = codeSnippets[listType];
        if (listCode && listCode[operation]) {
            return listCode[operation];
        }
        
        // Handle special cases for Sorted List
        if (listType === 'Sorted') {
            if (operation === 'insertFirst' || operation === 'insertLast') return codeSnippets['Sorted']['insert'];
            if (operation === 'deleteFirst') return codeSnippets['Sorted']['remove'];
        }

        // Fallback for common operations
        const fallbackOperation = operation === 'delete' ? 'delete' : 'find';
        if (codeSnippets['Singly-Linked'][fallbackOperation]) {
            return codeSnippets['Singly-Linked'][fallbackOperation];
        }

        return "// Hover over an action to see its code.";
    };

    return (
        <div className="code-display">
            <h3>Java Implementation</h3>
            <pre><code>{getCode()}</code></pre>
        </div>
    );
};

export default LinkedListCodeDisplay;