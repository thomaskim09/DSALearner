import React, { useState, useCallback } from 'react';
import { useLinkedList } from '../hooks/useLinkedList';
import LinkedListVisualizer from '../components/LinkedList/LinkedListVisualizer';
import LinkedListControls from '../components/LinkedList/LinkedListControls';
import LinkedListCodeDisplay from '../components/LinkedList/LinkedListCodeDisplay';
import PlaygroundUtils from '../components/common/PlaygroundUtils';
import '../assets/styles/LinkedList.css';

const LinkedListPage = () => {
    const { head, refreshList, clear, insertFirst, deleteFirst, insertLast, find, deleteByKey, setHead } = useLinkedList();
    const [listType, setListType] = useState('Singly-Linked');
    const [currentOperation, setCurrentOperation] = useState('insertFirst');
    const [animationSteps, setAnimationSteps] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleAnimation = useCallback((operation, steps) => {
        setCurrentOperation(operation);
        setAnimationSteps(steps);
        setIsAnimating(true);
    }, []);

    const onAnimationComplete = () => {
        const lastStep = animationSteps[animationSteps.length - 1];
        if (lastStep && lastStep.finalState) {
            setHead(lastStep.finalState);
        }
        setIsAnimating(false);
        setAnimationSteps([]);
    };

    const handleInsertFirst = (value) => handleAnimation('insertFirst', insertFirst(value));
    const handleDeleteFirst = () => handleAnimation('deleteFirst', deleteFirst());
    const handleInsertLast = (value) => handleAnimation('insertLast', insertLast(value));
    const handleFind = (value) => handleAnimation('find', find(value));
    const handleDeleteByKey = (value) => handleAnimation('delete', deleteByKey(value));

    return (
        <div className="chapter-page">
            <section className="playground-section">
                <div className="playground-header">
                    <h2>Linked List Playground</h2>
                    <PlaygroundUtils onRefresh={refreshList} onClear={clear} isAnimating={isAnimating} />
                </div>
                <div className="interactive-area">
                    <div className="controls-and-visualizer">
                        <LinkedListVisualizer 
                            head={head}
                            animationSteps={animationSteps}
                            onAnimationComplete={onAnimationComplete}
                            listType={listType}
                        />
                    </div>
                    <div className="code-and-controls-container">
                        <LinkedListControls
                            listType={listType}
                            setListType={setListType}
                            onInsertFirst={handleInsertFirst}
                            onDeleteFirst={handleDeleteFirst}
                            onInsertLast={handleInsertLast}
                            onFind={handleFind}
                            onDeleteByKey={handleDeleteByKey}
                            isAnimating={isAnimating}
                        />
                        <LinkedListCodeDisplay 
                            operation={currentOperation} 
                            listType={listType} 
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LinkedListPage;