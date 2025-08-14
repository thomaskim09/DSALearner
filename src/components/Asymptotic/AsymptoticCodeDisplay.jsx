import React from 'react';

const AsymptoticCodeDisplay = () => {
    return (
        <div className="asymptotic-code-display">
            <h3>Common Growth Functions</h3>
            <div className="asymptotic-examples">
                <h4>Examples:</h4>
                <div className="example-item">
                    <strong>O(1)</strong> - <span>Constant Time: Accessing an array element by index.</span>
                </div>
                <div className="example-item">
                    <strong>O(log n)</strong> - <span>Logarithmic Time: Binary search in a sorted array.</span>
                </div>
                <div className="example-item">
                    <strong>O(n)</strong> - <span>Linear Time: A simple for loop iterating through a list.</span>
                </div>
                <div className="example-item">
                    <strong>O(n log n)</strong> - <span>Log-Linear Time: Efficient sorting algorithms like Merge Sort.</span>
                </div>
                <div className="example-item">
                    <strong>O(n^2)</strong> - <span>Quadratic Time: A nested for loop (e.g., Bubble Sort).</span>
                </div>
                 <div className="example-item">
                    <strong>O(2^n)</strong> - <span>Exponential Time: Recursive calculation of Fibonacci numbers.</span>
                </div>
                <div className="example-item">
                    <strong>O(n!)</strong> - <span>Factorial Time: Traveling Salesperson Problem (brute-force).</span>
                </div>
            </div>
        </div>
    );
};

export default AsymptoticCodeDisplay;