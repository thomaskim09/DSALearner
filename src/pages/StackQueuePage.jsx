import React, { useState, useEffect, useCallback } from 'react';
import { useStackQueue } from '../hooks/useStackQueue';
import StackQueueControls from '../components/StackQueue/StackQueueControls';
import StackQueueVisualizer from '../components/StackQueue/StackQueueVisualizer';
import StackQueueCodeDisplay from '../components/StackQueue/StackQueueCodeDisplay';
import TraceLog from '../components/common/TraceLog';
import '../assets/styles/StackQueue.css';

const StackQueuePage = () => {
    const {
        state,
        setType,
        push,
        pop,
        enqueue,
        dequeue,
        pEnqueue,
        pDequeue,
        clear,
        reset
    } = useStackQueue();

    const [animation, setAnimation] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredOperation, setHoveredOperation] = useState('push');

    const handleOperation = useCallback((op, value) => {
        if (isPlaying) return;
        const steps = value !== undefined ? op(value) : op();
        setAnimation({ steps });
        setCurrentStep(0);
        setIsPlaying(true);
        // Extract operation name for code display
        const opName = op.name.replace('p', '').replace('en', '');
        setHoveredOperation(opName.startsWith('de') ? 'remove' : opName);
    }, [isPlaying]);

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

    const handleStepHover = (index) => {
        if (animation) {
            setCurrentStep(index);
            setIsPlaying(false);
        }
    };

    return (
        <div className="chapter-page stack-queue-page">
            <div className="interactive-area-sq">
                <div className="controls-and-visualizer-sq">
                    <StackQueueControls
                        type={state.type}
                        onTypeChange={setType}
                        onPush={(val) => handleOperation(push, val)}
                        onPop={() => handleOperation(pop)}
                        onEnqueue={(val) => handleOperation(enqueue, val)}
                        onDequeue={() => handleOperation(dequeue)}
                        onPEnqueue={(val) => handleOperation(pEnqueue, val)}
                        onPDequeue={() => handleOperation(pDequeue)}
                        onClear={clear}
                        onReset={reset}
                        isAnimating={isPlaying}
                        setHoveredOperation={setHoveredOperation}
                    />
                    <StackQueueVisualizer
                        data={animation ? animation.steps[currentStep] : state}
                    />
                </div>
                <div className="tracelog-and-code-sq">
                    <TraceLog
                        steps={animation ? animation.steps : []}
                        onHover={handleStepHover}
                        currentStep={currentStep}
                    />
                    <StackQueueCodeDisplay
                        type={state.type}
                        operation={hoveredOperation}
                    />
                </div>
            </div>
        </div>
    );
};

export default StackQueuePage;