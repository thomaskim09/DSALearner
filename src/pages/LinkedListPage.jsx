import React, { useState } from 'react';
import { useLinkedList } from '../hooks/useLinkedList';
import LinkedListVisualizer from '../components/LinkedList/LinkedListVisualizer';
import LinkedListControls from '../components/LinkedList/LinkedListControls';
import LinkedListCodeDisplay from '../components/LinkedList/LinkedListCodeDisplay';
import PlaygroundUtils from '../components/common/PlaygroundUtils'; // Import the new component
import '../assets/styles/LinkedList.css';

const LinkedListPage = () => {
    const { head, refreshList, clear } = useLinkedList();
    const [listType, setListType] = useState('Singly-Linked');
    const [currentOperation, setCurrentOperation] = useState('insertFirst');
    const [isAnimating] = useState(false);

    // Note: Animation logic is not yet connected to the controls
    // It's separated for now to focus on the code display feature

    return (
        <div className="chapter-page">
            <section className="playground-section">
                <div className="playground-header">
                    <h2>Chapter 6: Linked Lists Explained</h2>
                    <PlaygroundUtils 
                        onRefresh={refreshList} 
                        onClear={clear} 
                        isAnimating={isAnimating}
                    />
                </div>
                <div className="interactive-area">
                    <div className="controls-and-visualizer">
                        <LinkedListVisualizer 
                            head={head}
                            animationSteps={[]}
                            onAnimationComplete={() => {}}
                        />
                    </div>
                    <div className="code-and-controls-container">
                        <LinkedListControls
                            listType={listType}
                            setListType={setListType}
                            setOperation={setCurrentOperation}
                            isAnimating={isAnimating}
                        />
                        <LinkedListCodeDisplay 
                            listType={listType}
                            operation={currentOperation}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LinkedListPage;