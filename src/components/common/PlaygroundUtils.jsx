import React from 'react';

const PlaygroundUtils = ({ onRefresh, onClear, isAnimating }) => {
    return (
        <div className="header-utility-buttons">
            <button onClick={onRefresh} disabled={isAnimating} title="Refresh Data">
                {/* You can use an icon here if you have a library like react-icons */}
                Refresh
            </button>
            <button onClick={onClear} disabled={isAnimating} title="Clear Data">
                {/* Or an icon for trash/clear */}
                Clear
            </button>
        </div>
    );
};

export default PlaygroundUtils;