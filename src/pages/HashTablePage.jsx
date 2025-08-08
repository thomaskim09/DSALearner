import React, { useState } from 'react';
import HashTableControls from '../components/HashTable/HashTableControls';
import HashTableVisualizer from '../components/HashTable/HashTableVisualizer';
import HashTableCodeDisplay from '../components/HashTable/HashTableCodeDisplay';
import { useHashTable } from '../hooks/useHashTable';
import '../assets/styles/HashTable.css';

const HashTablePage = () => {
    const [collisionStrategy, setCollisionStrategy] = useState('linear-probing');
    const [prime, setPrime] = useState(7); // Add state for the prime constant
    const { 
        table, insert, find, 
        animationSteps, currentStep, 
        isPlaying, togglePlay, goToStep, resetAnimation, setTable
    } = useHashTable(collisionStrategy, prime); // Pass prime to the hook
    const [operation, setOperation] = useState('insert');

    const isAnimating = animationSteps.length > 0 && currentStep < animationSteps.length -1;
    const isAnimationActive = animationSteps.length > 0;
    
    // Handle strategy change to rehash data
    const handleStrategyChange = (newStrategy) => {
        const oldStrategy = collisionStrategy;
        setCollisionStrategy(newStrategy);

        // Don't re-hash if table is empty
        if (table.every(item => item === null || item.length === 0)) {
            return;
        }

        let allValues = [];
        // Extract values from old table
        if (oldStrategy === 'separate-chaining') {
            allValues = table.flat();
        } else {
            allValues = table.filter(val => val !== null);
        }

        // Create a new table for the new strategy
        const newTable = newStrategy === 'separate-chaining' 
            ? Array.from({ length: 10 }, () => [])
            : Array(10).fill(null);
            
        // Re-insert all values into the new table without animation
        allValues.forEach(val => {
             const hash = (key) => key % 10;
             const hash2 = (p) => (k) => p - (k % p);
             const h2 = hash2(prime);
             let index = hash(val);

             if (newStrategy === 'separate-chaining') {
                 newTable[index].unshift(val);
             } else {
                 let i = 0;
                 while(newTable[index] !== null) {
                     i++;
                     if(newStrategy === 'linear-probing') {
                         index = (hash(val) + i) % 10;
                     } else if (newStrategy === 'quadratic-probing') {
                         index = (hash(val) + i * i) % 10;
                     } else { // double-hashing
                         index = (hash(val) + i * h2(val)) % 10;
                     }
                 }
                 newTable[index] = val;
             }
        });

        setTable(newTable);
    };


    return (
        <div className="chapter-page">
            <div className="interactive-area">
                <div className="controls-and-visualizer">
                    <HashTableControls
                        onInsert={insert}
                        onFind={find}
                        strategy={collisionStrategy}
                        setStrategy={handleStrategyChange}
                        prime={prime}
                        setPrime={setPrime}
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