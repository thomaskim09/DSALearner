import React, { useState } from 'react';
import { RefreshIcon, TrashIcon } from '../common/Icons';

const ControlsPanel = ({ onOperationChange, onInsert, startTraversal, startFind, startDelete, isAnimating, onRefresh, onClear }) => {
  const [insertValue, setInsertValue] = useState('');
  const [findValue, setFindValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');

  const handleInsert = () => {
    if (insertValue !== '') {
      onInsert(Number(insertValue));
      setInsertValue('');
    }
  };

  const handleFind = () => {
    if (findValue !== '') {
      startFind(Number(findValue));
      setFindValue('');
    }
  };

  const handleDelete = () => {
    if (deleteValue !== '') {
      startDelete(Number(deleteValue));
      setDeleteValue('');
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="tree-controls-panel">
      <div className="tree-control-grid">
        <div className="tree-control-row">
            <div className="tree-control-group">
                <input type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleInsert)} onFocus={() => onOperationChange('insert')} placeholder="Insert Value" disabled={isAnimating} />
                <button onClick={handleInsert} disabled={isAnimating || insertValue === ''}>Insert</button>
            </div>
            <div className="tree-control-group">
                <input type="number" value={findValue} onChange={(e) => setFindValue(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleFind)} onFocus={() => onOperationChange('find')} placeholder="Find Value" disabled={isAnimating} />
                <button onClick={handleFind} disabled={isAnimating || findValue === ''}>Find</button>
            </div>
            <div className="tree-control-group">
                <input type="number" value={deleteValue} onChange={(e) => setDeleteValue(e.target.value)} onKeyDown={(e) => handleKeyDown(e, handleDelete)} onFocus={() => onOperationChange('delete')} placeholder="Delete Value" disabled={isAnimating} />
                <button onClick={handleDelete} disabled={isAnimating || deleteValue === ''}>Delete</button>
            </div>
        </div>
        <div className="tree-control-row">
            <div className="tree-control-group tree-traversal-group">
                <button onClick={() => startTraversal('inOrderTraversal')} onFocus={() => onOperationChange('inOrder')} disabled={isAnimating}>In-Order</button>
                <button onClick={() => startTraversal('preOrderTraversal')} onFocus={() => onOperationChange('preOrder')} disabled={isAnimating}>Pre-Order</button>
                <button onClick={() => startTraversal('postOrderTraversal')} onFocus={() => onOperationChange('postOrder')} disabled={isAnimating}>Post-Order</button>
            </div>
            <div className="tree-control-group tree-utility-group">
                <button onClick={onRefresh} disabled={isAnimating} title="Refresh Tree"><RefreshIcon /></button>
                <button onClick={onClear} disabled={isAnimating} title="Clear Tree"><TrashIcon /></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;