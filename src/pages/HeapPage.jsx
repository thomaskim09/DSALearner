import React, { useState, useCallback, useEffect } from 'react';
import HeapControls from '../components/Heap/HeapControls';
import HeapVisualizer from '../components/Heap/HeapVisualizer';
import HeapCodeDisplay from '../components/Heap/HeapCodeDisplay';
import TraceLog from '../components/common/TraceLog';
import { useHeap } from '../hooks/useHeap';
import '../assets/styles/Heap.css';

const HeapPage = () => {
    const { heap, setHeap, insert, remove, clear, refreshHeap, getHeapHeight, heapSort, change, reheap } = useHeap();
    const [operation, setOperation] = useState('insert');
    const [animation, setAnimation] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [heapsortInput, setHeapsortInput] = useState('');
    const [visualizationMode, setVisualizationMode] = useState('tree');
    const [history, setHistory] = useState([]);

    const isAnimationPlaying = isPlaying;

    // Syncs the UI (input field, history) with the hook's state.
    useEffect(() => {
        if (heap && heap.length > 0) {
            setHistory([{
                heap: [...heap],
                message: 'Initial State',
                sortedCount: 0
            }]);
            setHeapsortInput(heap.join(', '));
        } else {
            setHistory([]);
            setHeapsortInput('');
        }
    }, [heap]);

    const handleInputChange = (newInput) => {
        setHeapsortInput(newInput);
        const array = newInput.split(/[,\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        setHeap(array); 
    };

    const handleOperation = useCallback((op, ...args) => {
        if (isAnimationPlaying) return;
        setAnimation(null);

        const steps = op(...args);
        
        if (!steps || steps.length === 0) return;
        
        const finalHeapState = steps[steps.length - 1].heap;

        setHistory(prevHistory => [...prevHistory, {
            heap: finalHeapState,
            message: `${op.name} operation complete.`,
            sortedCount: 0,
        }]);

        setAnimation({ type: op.name, steps });
        setCurrentStep(0);
        setIsPlaying(true);
        setOperation(op.name);

    }, [isAnimationPlaying, insert, remove, change, reheap]);

    const handleHeapsort = useCallback(() => {
        if (isAnimationPlaying) return;
        setAnimation(null);
        const array = heapsortInput.split(/[,\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        if (array.length > 0) {
            const steps = heapSort(array);
            setAnimation({ type: 'heapSort', steps });
            setCurrentStep(0);
            setIsPlaying(true);
            setOperation('heapSort');
            setHistory(steps);
        }
    }, [isAnimationPlaying, heapsortInput, heapSort]);


    const goToStep = (step) => {
        if (animation && step >= 0 && step < animation.steps.length) {
            setCurrentStep(step);
            setIsPlaying(false);
        }
    };

    const handleStepHover = (index) => {
        if (animation) {
            goToStep(index);
        }
    };

    useEffect(() => {
        let timer;
        if (isPlaying && animation && currentStep < animation.steps.length - 1) {
            timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800);
        } else if (animation && currentStep >= animation.steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, animation]);

    return (
        <div className="chapter-page heap-page">
            <div className="interactive-area">
                <div className="heap-controls-container">
                    <HeapControls
                        onInsert={(val) => handleOperation(insert, val)}
                        onRemove={() => handleOperation(remove)}
                        onChange={(oldVal, newVal) => handleOperation(change, oldVal, newVal)}
                        onReheap={() => handleOperation(reheap)}
                        onClear={clear}
                        onRefresh={refreshHeap}
                        isAnimating={isAnimationPlaying}
                        setOperation={setOperation}
                        heapsortInput={heapsortInput}
                        setHeapsortInput={handleInputChange}
                        onHeapsort={handleHeapsort}
                        visualizationMode={visualizationMode}
                        setVisualizationMode={setVisualizationMode}
                    />
                </div>
                <div className="heap-visualizer-container">
                    <HeapVisualizer
                        heap={animation?.steps[currentStep]?.heap || heap}
                        getHeapHeight={getHeapHeight}
                        animation={animation}
                        currentStep={currentStep}
                        sortedCount={animation?.steps[currentStep]?.sortedCount || 0}
                        operationType={animation?.type}
                        highlights={animation?.steps[currentStep]?.highlights}
                        visualizationMode={visualizationMode}
                        history={history}
                    />
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