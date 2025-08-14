import React, { useState } from 'react';
import TreeVisualizer from '../components/Tree/TreeVisualizer';
import CodeDisplay from '../components/Tree/TreeCodeDisplay';
import ControlsPanel from '../components/Tree/TreeControls';
import { useBinarySearchTree } from '../hooks/useBinarySearchTree';
import { RefreshIcon, TrashIcon } from '../components/common/Icons';
import '../assets/styles/Tree.css';

const ChapterPage = () => {
  const bst = useBinarySearchTree();
  const [currentOperation, setCurrentOperation] = useState('insert');
  const [animationSteps, setAnimationSteps] = useState([]);
  const [animationType, setAnimationType] = useState(null);
  const [latestNodeId, setLatestNodeId] = useState(null);
  
  const isAnimating = animationType !== null;

  const handleInsert = (value) => {
    const newNode = bst.insert(value);
    setLatestNodeId(newNode.id);
  };

  const startAnimation = (type, steps) => {
      setLatestNodeId(null);
      setAnimationSteps(steps);
      setAnimationType(type);
  }

  const stopAnimation = () => {
      if (animationType === 'delete' && animationSteps.length > 0) {
          const lastStep = animationSteps[animationSteps.length - 1];
          if (lastStep.finalTree !== undefined) {
              bst.setRoot(lastStep.finalTree ? { ...lastStep.finalTree } : null);
          }
      }
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
    const steps = bst.find(value);
    setCurrentOperation('find');
    startAnimation('find', steps);
  }

  const handleStartDelete = (value) => {
    if (!bst.root || value === '') return;
    const steps = bst.deleteNode(value);
    setCurrentOperation('delete');
    startAnimation('delete', steps);
  };

  return (
    <div className="chapter-page">
      <section className="playground-section">
        <div className="interactive-area">
          <div className="controls-and-visualizer">
            <ControlsPanel
              onOperationChange={setCurrentOperation}
              onInsert={handleInsert}
              startTraversal={handleStartTraversal}
              startFind={handleStartFind}
              startDelete={handleStartDelete}
              isAnimating={isAnimating}
              onRefresh={bst.refreshTree}
              onClear={bst.clear}
            />
            <TreeVisualizer
              root={bst.root}
              getTreeHeight={bst.getTreeHeight}
              animationSteps={animationSteps}
              animationType={animationType}
              stopAnimation={stopAnimation}
              latestNodeId={latestNodeId}
              key={bst.root ? bst.root.id : 'empty'}
            />
          </div>
          <div className="code-display-container">
            <CodeDisplay operation={currentOperation} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChapterPage;