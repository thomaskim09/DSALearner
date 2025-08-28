import React, { useCallback, useEffect, useState } from 'react';
import { useDynamicProgramming } from '../hooks/useDynamicProgramming';
import DynamicProgrammingControls from '../components/DynamicProgramming/DynamicProgrammingControls';
import BinomialCoefficientVisualizer from '../components/DynamicProgramming/BinomialCoefficientVisualizer';
import BinomialCoefficientRecursiveVisualizer from '../components/DynamicProgramming/BinomialCoefficientRecursiveVisualizer';
import PascalTriangleVisualizer from '../components/DynamicProgramming/PascalTriangleVisualizer';
import FloydWarshallVisualizer from '../components/DynamicProgramming/FloydWarshallVisualizer';
import DynamicProgrammingCodeDisplay from '../components/DynamicProgramming/DynamicProgrammingCodeDisplay';
import '../assets/styles/SimpleSort.css';
import '../assets/styles/DynamicProgramming.css';


const DynamicProgrammingPage = () => {
    const { history, calculate, algorithm } = useDynamicProgramming();
    const [visualizationType, setVisualizationType] = useState('dp');
    const [n, setN] = useState(5);
    const [r, setR] = useState(2);

    const handleCalculate = useCallback(() => {
        const currentAlgorithm = algorithm.startsWith('binomial') ? 'binomial' : algorithm;
        const fullAlgoName = currentAlgorithm === 'binomial' ? (visualizationType === 'recursive' ? 'binomialRecursive' : 'binomial') : currentAlgorithm;
        calculate(fullAlgoName, { n, r });
    }, [calculate, visualizationType, n, r, algorithm]);

    useEffect(() => {
        handleCalculate();
    }, [handleCalculate]);


    const renderVisualizer = () => {
        if (algorithm === 'binomial' || algorithm === 'binomialRecursive') {
            if (visualizationType === 'recursive') {
                return <BinomialCoefficientRecursiveVisualizer history={history} />;
            }
             if (visualizationType === 'pascal') {
                return <PascalTriangleVisualizer history={history} />;
            }
            return <BinomialCoefficientVisualizer history={history} n={n} r={r}/>;
        }
        if (algorithm === 'floydWarshall') {
            return <FloydWarshallVisualizer history={history} />;
        }
        return null;
    }

    return (
        <div className="chapter-page-sort">
            <DynamicProgrammingControls
                onCalculate={handleCalculate}
                visualizationType={visualizationType}
                setVisualizationType={setVisualizationType}
                n={n}
                setN={setN}
                r={r}
                setR={setR}
                algorithm={algorithm}
            />

            <div className="sort-content-area">
                <div className="visualizer-container">
                    {renderVisualizer()}
                </div>
                <div className="code-display-container-sort">
                    <DynamicProgrammingCodeDisplay algorithm={algorithm} visualizationType={visualizationType} />
                </div>
            </div>
        </div>
    );
};

export default DynamicProgrammingPage;