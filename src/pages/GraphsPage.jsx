import React, { useState } from 'react';
import { useGraph } from '../hooks/useGraph';
import GraphsControls from '../components/Graphs/GraphsControls';
import GraphsVisualizer from '../components/Graphs/GraphsVisualizer';
import GraphsCodeDisplay from '../components/Graphs/GraphsCodeDisplay';
import TraceLog from '../components/common/TraceLog';
import '../assets/styles/Graphs.css';

const GraphsPage = () => {
    const { graph, animation, dfs, bfs, mst, setAnimation } = useGraph();
    const [operation, setOperation] = useState('dfs');
    const [currentStep, setCurrentStep] = useState(0);
    const [visualizationMode, setVisualizationMode] = useState('graph');

    const handleStepHover = (index) => {
        setCurrentStep(index);
    };

    const handleRunAlgorithm = (algo) => {
        setAnimation({ steps: [], isPlaying: false }); // Clear previous animation
        setCurrentStep(0);
        setOperation(algo);
        if (algo === 'dfs') dfs();
        else if (algo === 'bfs') bfs();
        else if (algo === 'mst') mst();
    };

    return (
        <div className="chapter-page graphs-page">
            <div className="interactive-area">
                <div className="graphs-main-content">
                    <GraphsControls
                        onRun={handleRunAlgorithm}
                        isAnimating={animation.isPlaying}
                        visualizationMode={visualizationMode}
                        setVisualizationMode={setVisualizationMode}
                    />
                    <GraphsVisualizer
                        graph={graph}
                        animationSteps={animation.steps}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        isPlaying={animation.isPlaying}
                        setIsPlaying={(val) => setAnimation(a => ({ ...a, isPlaying: val }))}
                        visualizationMode={visualizationMode}
                        operation={operation}
                    />
                </div>
                <div className="graphs-sidebar">
                    <TraceLog
                        steps={animation.steps}
                        onHover={handleStepHover}
                        currentStep={currentStep}
                    />
                    <GraphsCodeDisplay operation={operation} />
                </div>
            </div>
        </div>
    );
};

export default GraphsPage;