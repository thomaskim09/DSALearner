import { useCallback, useMemo, useState } from 'react';
import { analyzeAsymptotic } from '../utils/asymptoticNotation';

export function useAsymptotic(initialInput = 't(n)=30n^5*11n^6 + 9n^3*23n^9 + 124n^10') {
    const [input, setInput] = useState(initialInput);
    const [analysis, setAnalysis] = useState(null);

    const compute = useCallback(() => {
        const res = analyzeAsymptotic(input);
        setAnalysis(res);
    }, [input]);

    const steps = useMemo(() => {
        if (!analysis || !analysis.ok) return [];
        const lines = analysis.steps || [];
        return lines.map((l, i) => ({ message: l }));
    }, [analysis]);

    return {
        input,
        setInput,
        analysis,
        compute,
        steps,
    };
}


