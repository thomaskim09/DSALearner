import React from 'react';

// Add isFound prop
const TreeNode = ({ value, style, isHighlighted, isFound }) => {
  const className = `tree-node ${isHighlighted ? 'highlighted' : ''} ${isFound ? 'found' : ''}`;
  
  return (
    <div className={className} style={style}>
      {value}
    </div>
  );
};

export default TreeNode;