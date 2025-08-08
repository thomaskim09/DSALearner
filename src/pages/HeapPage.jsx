import React, { useState, useCallback, useEffect } from 'react';
import HeapControls from '../components/Heap/HeapControls';
import HeapVisualizer from '../components/Heap/HeapVisualizer';
import HeapCodeDisplay from '../components/Heap/HeapCodeDisplay';
import TraceLog from '../components/common/TraceLog';
import { useHeap } from '../hooks/useHeap';
import '../assets/styles/Heap.css';

const HeapPage = () => {
    const { heap, insert, remove, clear, refreshHeap, getHeapHeight } = useHeap();
    const [operation, setOperation] = useState('insert');
    const [animation, setAnimation] = useState(null); // Will now persist until next operation
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Controls are disabled only while the animation is actively playing.
    const isAnimationPlaying = isPlaying; 

    const handleOperation = useCallback((op, value) => {
        if (isAnimationPlaying) return; // Prevent new operations while one is playing
        const steps = op(value);
        setAnimation({ type: op.name, steps });
        setCurrentStep(0);
        setIsPlaying(true);
    }, [isAnimationPlaying]); // Dependency updated

    const goToStep = (step) => {
        if (animation && step >= 0 && step < animation.steps.length) {
            setCurrentStep(step);
            setIsPlaying(false); // Pause playback when manually scrubbing
        }
    };

    const handleStepHover = (index) => {
        // Allow hovering even if animation is not playing
        if (animation) { 
            goToStep(index);
        }
    };

    useEffect(() => {
        let timer;
        if (isPlaying && animation && currentStep < animation.steps.length) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800);
        } else if (animation && currentStep >= animation.steps.length) {
            // Animation finished, stop playing but keep animation state
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, animation]);

    return (
        <div className="chapter-page heap-page">
            <div className="interactive-area">
                <div className="heap-left-column">
                    <div className="heap-controls-container">
                        <HeapControls
                            onInsert={(val) => handleOperation(insert, val)}
                            onRemove={() => handleOperation(remove)}
                            onClear={clear}
                            onRefresh={refreshHeap}
                            isAnimating={isAnimationPlaying} // Pass playing state
                            setOperation={setOperation}
                        />
                    </div>
                    <div className="heap-visualizer-container">
                        <HeapVisualizer
                            heap={heap}
                            getHeapHeight={getHeapHeight}
                            animation={animation}
                            currentStep={currentStep}
                        />
                    </div>
                </div>
                <div className="heap-tracelog-container">
                     <TraceLog 
                        steps={animation ? animation.steps : []} 
                        onHover={handleStepHover} 
                        currentStep={currentStep} 
                    />
                </div>
                <div className="heap-code-container">
                    <HeapCodeDisplay operation={operation} />
                </div>
            </div>
        </div>
    );
};

export default HeapPage;