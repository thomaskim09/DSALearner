import React, { useState, useCallback } from 'react';
import HeapControls from '../components/Heap/HeapControls';
import HeapVisualizer from '../components/Heap/HeapVisualizer';
import HeapCodeDisplay from '../components/Heap/HeapCodeDisplay';
import { useHeap } from '../hooks/useHeap';
import '../assets/styles/Heap.css';

const HeapPage = () => {
    const { heap, insert, remove, clear, refreshHeap, getHeapHeight } = useHeap();
    const [operation, setOperation] = useState('insert');
    const [animation, setAnimation] = useState(null);

    const handleInsert = useCallback((value) => {
        if (animation) return;
        const steps = insert(value);
        setAnimation({ type: 'insert', steps });
    }, [insert, animation]);

    const handleRemove = useCallback(() => {
        if (animation) return;
        const steps = remove();
        setAnimation({ type: 'remove', steps });
    }, [remove, animation]);

    const handleAnimationComplete = () => {
        setAnimation(null);
    };

    return (
        <div className="chapter-page">
            <div className="interactive-area">
                <div className="controls-and-visualizer">
                    <HeapControls
                        onInsert={handleInsert}
                        onRemove={handleRemove}
                        onClear={clear}
                        onRefresh={refreshHeap}
                        isAnimating={!!animation}
                        setOperation={setOperation}
                    />
                    <HeapVisualizer
                        heap={heap}
                        getHeapHeight={getHeapHeight}
                        animation={animation}
                        onAnimationComplete={handleAnimationComplete}
                    />
                </div>
                <div className="code-display-container">
                    <HeapCodeDisplay operation={operation} />
                </div>
            </div>
        </div>
    );
};

export default HeapPage;