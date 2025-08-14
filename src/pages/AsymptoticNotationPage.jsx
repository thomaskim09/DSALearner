import React from 'react';
import AsymptoticControls from '../components/Asymptotic/AsymptoticControls';
import AsymptoticTrace from '../components/Asymptotic/AsymptoticTrace';
import AsymptoticCodeDisplay from '../components/Asymptotic/AsymptoticCodeDisplay';
import { useAsymptotic } from '../hooks/useAsymptotic';
import '../assets/styles/Asymptotic.css';

const AsymptoticNotationPage = () => {
    const { input, setInput, analysis, compute, steps } = useAsymptotic();

    return (
        <div className="chapter-page asymptotic-page">
            <div className="interactive-area">
                <div className="asymptotic-main-content">
                    <AsymptoticControls input={input} setInput={setInput} onCalculate={compute} />
                    <AsymptoticTrace steps={steps} />
                </div>
                <div className="asymptotic-sidebar">
                    <AsymptoticCodeDisplay />
                </div>
            </div>
        </div>
    );
};

export default AsymptoticNotationPage;