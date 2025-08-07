import React, { useState } from 'react';
import LinkedListControls from '../components/LinkedList/LinkedListControls';
import LinkedListVisualizer from '../components/LinkedList/LinkedListVisualizer';
import LinkedListCodeDisplay from '../components/LinkedList/LinkedListCodeDisplay';
import { useLinkedList } from '../hooks/useLinkedList';
import '../assets/styles/LinkedList.css';

const LinkedListPage = () => {
    const { head, setHead, insertFirst, deleteFirst, insertLast, find, deleteByKey, refreshList } = useLinkedList();
    const [listType, setListType] = useState('Singly-Linked');
    const [animationSteps, setAnimationSteps] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hoveredOperation, setHoveredOperation] = useState('insertFirst'); // Default operation to show

    const handleOperation = (operation) => {
        if (isAnimating) return;
        setIsAnimating(true);
        const steps = operation();
        setAnimationSteps(steps);
    };

    const handleAnimationComplete = () => {
        const lastStep = animationSteps[animationSteps.length - 1];
        if (lastStep && lastStep.finalState) {
            setHead(lastStep.finalState);
        }
        setIsAnimating(false);
        setAnimationSteps([]);
    };

    // New: Handle hover to update code display
    const handleOperationHover = (operationName) => {
        setHoveredOperation(operationName);
    };

    return (
        <div className="chapter-page">
            <div className="interactive-area">
                <div className="controls-and-visualizer">
                    <LinkedListControls
                        listType={listType}
                        setListType={setListType}
                        onInsertFirst={(val) => handleOperation(() => insertFirst(val))}
                        onDeleteFirst={() => handleOperation(deleteFirst)}
                        onInsertLast={(val) => handleOperation(() => insertLast(val))}
                        onDeleteByKey={(val) => handleOperation(() => deleteByKey(val))}
                        onFind={(val) => handleOperation(() => find(val))}
                        isAnimating={isAnimating}
                        onHover={handleOperationHover} // Pass hover handler
                    />
                    <LinkedListVisualizer
                        head={head}
                        listType={listType}
                        animationSteps={animationSteps}
                        onAnimationComplete={handleAnimationComplete}
                    />
                </div>
                <div className="code-display-container">
                    <LinkedListCodeDisplay listType={listType} operation={hoveredOperation} />
                </div>
            </div>
        </div>
    );
};

export default LinkedListPage;