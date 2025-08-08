import React, { useState, useCallback, useEffect } from 'react';
import HeapControls from '../components/Heap/HeapControls';
import HeapVisualizer from '../components/Heap/HeapVisualizer';
import HeapCodeDisplay from '../components/Heap/HeapCodeDisplay';
import { useHeap } from '../hooks/useHeap';
import '../assets/styles/Heap.css';

const HeapPage = () => {
    const { heap, insert, remove, clear, refreshHeap, getHeapHeight } = useHeap();
    const [operation, setOperation] = useState('insert');
    const [animation, setAnimation] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const isAnimating = !!animation;

    const handleOperation = useCallback((op, value) => {
        if (isAnimating) return;
        const steps = op(value);
        setAnimation({ type: op.name, steps });
        setCurrentStep(0);
        setIsPlaying(true);
    }, [isAnimating]);

    const handleAnimationComplete = () => {
        setAnimation(null);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const togglePlay = () => {
        if (currentStep >= (animation?.steps?.length || 0)) {
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const goToStep = (step) => {
        if (animation && step >= 0 && step < animation.steps.length) {
            setCurrentStep(step);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        let timer;
        if (isPlaying && animation && currentStep < animation.steps.length) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800);
        } else if (animation && currentStep >= animation.steps.length) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, animation]);

    return (
        <div className="chapter-page">
            <div className="interactive-area">
                <div className="controls-and-visualizer large-visualizer">
                    <HeapControls
                        onInsert={(val) => handleOperation(insert, val)}
                        onRemove={() => handleOperation(remove)}
                        onClear={clear}
                        onRefresh={refreshHeap}
                        isAnimating={isAnimating}
                        setOperation={setOperation}
                        animationSteps={animation ? animation.steps : []}
                        currentStep={currentStep}
                        isPlaying={isPlaying}
                        togglePlay={togglePlay}
                        goToStep={goToStep}
                        onRestart={() => goToStep(0)}
                        onClose={handleAnimationComplete}
                    />
                    <HeapVisualizer
                        heap={heap}
                        getHeapHeight={getHeapHeight}
                        animation={animation}
                        onAnimationComplete={handleAnimationComplete}
                        currentStep={currentStep}
                    />
                </div>
                <div className="code-display-container large-code">
                    <HeapCodeDisplay operation={operation} />
                </div>
            </div>
        </div>
    );
};

export default HeapPage;