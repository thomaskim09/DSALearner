import { useState, useLayoutEffect, useCallback } from 'react';

/**
 * A custom hook that returns the dimensions of a ref'd element
 * and updates them when the element is resized.
 * @returns {[React.RefCallback<any>, {width: number, height: number}]}
 */
export const useResizeObserver = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [node, setNode] = useState(null);

    const ref = useCallback(node => {
        setNode(node);
    }, []);

    useLayoutEffect(() => {
        if (!node) return;

        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        resizeObserver.observe(node);

        // Cleanup function to disconnect the observer
        return () => resizeObserver.disconnect();
    }, [node]);

    return [ref, dimensions];
};