import React, { useState } from 'react';
import HashTableControls from '../components/HashTable/HashTableControls';
import HashTableVisualizer from '../components/HashTable/HashTableVisualizer';
import HashTableCodeDisplay from '../components/HashTable/HashTableCodeDisplay';
import { useHashTable } from '../hooks/useHashTable';
import '../assets/styles/HashTable.css';

const HashTablePage = () => {
    const [collisionStrategy, setCollisionStrategy] = useState('linear-probing');
    const { table, insert, find, animationStep } = useHashTable(collisionStrategy);
    const [operation, setOperation] = useState('insert');

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
                    />
                    <HashTableVisualizer
                        table={table}
                        animationStep={animationStep}
                        strategy={collisionStrategy}
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