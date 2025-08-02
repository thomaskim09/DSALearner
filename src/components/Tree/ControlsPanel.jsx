import React, { useState } from 'react';

const ControlsPanel = ({ bst, onOperationChange, startTraversal, startFind, isAnimating }) => {
  const [insertValue, setInsertValue] = useState('');
  const [findValue, setFindValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');

  return (
    <div className="controls-panel">
      <div className="control-grid">
        <div className="control-row">
            <div className="control-group">
                <input type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} onFocus={() => onOperationChange('insert')} placeholder="Insert" disabled={isAnimating} />
                <button onClick={() => { bst.insert(Number(insertValue)); setInsertValue(''); }} disabled={isAnimating || insertValue === ''}>Insert</button>
            </div>
            <div className="control-group">
                <input type="number" value={findValue} onChange={(e) => setFindValue(e.target.value)} onFocus={() => onOperationChange('find')} placeholder="Find" disabled={isAnimating} />
                <button onClick={() => { startFind(findValue); setFindValue(''); }} disabled={isAnimating || findValue === ''}>Find</button>
            </div>
            <div className="control-group">
                <input type="number" value={deleteValue} onChange={(e) => setDeleteValue(e.target.value)} onFocus={() => onOperationChange('delete')} placeholder="Delete" disabled={isAnimating} />
                <button onClick={() => { bst.deleteNode(Number(deleteValue)); setDeleteValue(''); }} disabled={isAnimating || deleteValue === ''}>Delete</button>
            </div>
        </div>
        <div className="control-row">
            <div className="control-group traversal-group">
                <button onClick={() => startTraversal('inOrderTraversal')} onFocus={() => onOperationChange('inOrder')} disabled={isAnimating}>In-Order</button>
                <button onClick={() => startTraversal('preOrderTraversal')} onFocus={() => onOperationChange('preOrder')} disabled={isAnimating}>Pre-Order</button>
                <button onClick={() => startTraversal('postOrderTraversal')} onFocus={() => onOperationChange('postOrder')} disabled={isAnimating}>Post-Order</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
