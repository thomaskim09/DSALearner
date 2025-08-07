import React, { useState } from 'react';
import HashTableControls from '../components/HashTable/HashTableControls';
import HashTableVisualizer from '../components/HashTable/HashTableVisualizer';
import HashTableCodeDisplay from '../components/HashTable/HashTableCodeDisplay';
import { useHashTable } from '../hooks/useHashTable';
import '../assets/styles/HashTable.css';

const HashTablePage = () => {
    const [collisionStrategy, setCollisionStrategy] = useState('linear-probing');
    const { 
        table, insert, find, 
        animationSteps, currentStep, 
        isPlaying, togglePlay, goToStep, resetAnimation 
    } = useHashTable(collisionStrategy);
    const [operation, setOperation] = useState('insert');

    const isAnimating = animationSteps.length > 0 && currentStep < animationSteps.length -1;
    const isAnimationActive = animationSteps.length > 0;

    return (
        <div className="chapter-page">
            <div className="interactive-area">
                <div className="controls-and-visualizer">
                    <HashTableControls
                        onInsert={insert}
                        onFind={find}
                        strategy={collisionStrategy}
                        setStrategy={setCollisionStrategy}
                        setOperation={setOperation}
                        isAnimating={isAnimating}
                        isAnimationActive={isAnimationActive}
                        onReset={resetAnimation}
                        animationSteps={animationSteps}
                        currentStep={currentStep}
                        isPlaying={isPlaying}
                        togglePlay={togglePlay}
                        goToStep={goToStep}
                    />
                    <HashTableVisualizer
                        table={table}
                        strategy={collisionStrategy}
                        animationSteps={animationSteps}
                        currentStep={currentStep}
                    />
                </div>
                <div className="code-display-container">
                    <HashTableCodeDisplay operation={operation} strategy={collisionStrategy} />
                </div>
            </div>
        </div>
    );
};

export default HashTablePage;