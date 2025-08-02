import React, { useState } from 'react';
import TreeVisualizer from '../components/Tree/TreeVisualizer';
import CodeDisplay from '../components/Tree/CodeDisplay';
import ControlsPanel from '../components/Tree/ControlsPanel';
import { useBinarySearchTree } from '../hooks/useBinarySearchTree';
import '../assets/styles/Tree.css';

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
);

const ChapterPage = () => {
  const bst = useBinarySearchTree();
  const [currentOperation, setCurrentOperation] = useState('insert');
  const [animationSteps, setAnimationSteps] = useState([]);
  const [animationType, setAnimationType] = useState(null); // 'traversal' or 'find'
  
  const isAnimating = animationType !== null;

  const startAnimation = (type, steps) => {
      setAnimationSteps(steps);
      setAnimationType(type);
  }

  const stopAnimation = () => {
      setAnimationSteps([]);
      setAnimationType(null);
  }

  const handleStartTraversal = (traversalType) => {
    if (!bst.root) return;
    const steps = bst[traversalType]();
    setCurrentOperation(traversalType.replace('Traversal', ''));
    startAnimation('traversal', steps);
  };

  const handleStartFind = (value) => {
    if (!bst.root || value === '') return;
    const steps = bst.find(Number(value));
    setCurrentOperation('find');
    startAnimation('find', steps);
  }

  return (
    <div className="chapter-page">
      <section className="playground-section">
        <div className="playground-header">
            <h2>Interactive Playground</h2>
            <div className="header-utility-buttons">
                <button onClick={bst.refreshTree} disabled={isAnimating} title="Refresh Tree"><RefreshIcon /></button>
                <button onClick={bst.clear} disabled={isAnimating} title="Clear Tree"><TrashIcon /></button>
            </div>
        </div>
        <div className="interactive-area">
          <div className="controls-and-visualizer">
            <ControlsPanel
              bst={bst}
              onOperationChange={setCurrentOperation}
              startTraversal={handleStartTraversal}
              startFind={handleStartFind}
              isAnimating={isAnimating}
            />
            <TreeVisualizer
              root={bst.root}
              getTreeHeight={bst.getTreeHeight}
              animationSteps={animationSteps}
              animationType={animationType}
              stopAnimation={stopAnimation}
            />
          </div>
          <CodeDisplay operation={currentOperation} />
        </div>
      </section>
    </div>
  );
};

export default ChapterPage;
