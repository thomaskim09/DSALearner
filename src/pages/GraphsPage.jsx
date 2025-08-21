// DSALearner_packaged/src/pages/GraphsPage.jsx

import React, { useState, useEffect } from 'react';
import { useGraph } from '../hooks/useGraph';
import GraphsControls from '../components/Graphs/GraphsControls';
import GraphsVisualizer from '../components/Graphs/GraphsVisualizer';
import GraphsCodeDisplay from '../components/Graphs/GraphsCodeDisplay';
import TraceLog from '../components/common/TraceLog';
import '../assets/styles/Graphs.css';
import { unweightedGraphExamples, weightedGraphExamples } from '../utils/graphData';

const GraphsPage = () => {
    const { graph, graphType, animation, runAlgorithm, setAnimation, loadGraph, handleGraphTypeChange } = useGraph();
    const [operation, setOperation] = useState('dfs');
    const [startVertex, setStartVertex] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [traversalSequence, setTraversalSequence] = useState([]);
    const [visualizationMode, setVisualizationMode] = useState('graph');

    const handleStepHover = (index) => {
        setCurrentStep(index);
    };

    const handleRunAlgorithm = (algo) => {
        setAnimation({ steps: [], isPlaying: false });
        setTraversalSequence([]);
        setCurrentStep(0);
        setOperation(algo);
        runAlgorithm(algo, startVertex);
    };

    const handleGraphChange = (index) => {
        loadGraph(graphType, index);
        setStartVertex(0); // Reset start vertex to default
    };

    useEffect(() => {
        if (animation.steps.length > 0) {
            let sequence = [];
            if (operation === 'mst') {
                sequence = animation.steps
                    .slice(0, currentStep + 1)
                    .filter(step => step.type === 'add_edge')
                    .map(step => {
                        const fromLabel = graph.vertexList[step.from].label;
                        const toLabel = graph.vertexList[step.to].label;
                        return `${fromLabel}${toLabel}`;
                    });
            } else {
                sequence = animation.steps
                    .slice(0, currentStep + 1)
                    .filter(step => step.type === 'visit' || step.type === 'start' || step.type === 'dequeue')
                    .map(step => {
                        const vertex = graph.vertexList.find(v => v.label === step.vertexLabel);
                        return vertex ? vertex.label : '';
                    }).filter(Boolean);
            }
            setTraversalSequence(sequence);
        }
    }, [currentStep, animation.steps, graph.vertexList, operation]);

    const graphExamples = graphType === 'weighted' ? weightedGraphExamples : unweightedGraphExamples;

    return (
        <div className="chapter-page graphs-page">
            <div className="interactive-area">
                <div className="graphs-main-content">
                    <GraphsControls
                        onRun={handleRunAlgorithm}
                        isAnimating={animation.isPlaying}
                        visualizationMode={visualizationMode}
                        setVisualizationMode={setVisualizationMode}
                        vertexList={graph.vertexList}
                        startVertex={startVertex}
                        setStartVertex={setStartVertex}
                        onGraphChange={handleGraphChange}
                        graphType={graphType}
                        onGraphTypeChange={handleGraphTypeChange}
                        graphExamples={graphExamples}
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
                        traversalSequence={traversalSequence}
                        showWeights={graphType === 'weighted'}
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
