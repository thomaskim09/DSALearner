import React from 'react';

/**
 * Displays a trace of inserted keys and their calculated hash values.
 */
const CalculationTrace = ({ insertedData, tableSize }) => {
    return (
        <div className="calculation-trace">
            <h3 className="trace-header">Insertion Trace</h3>
            <div className="trace-formula">
                Hash Formula: <br/><span>key % {tableSize}</span>
            </div>
            <div className="trace-table-container">
                <table className="trace-table">
                    <thead>
                        <tr>
                            <th>Key Value</th>
                            <th>Hash Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {insertedData.length > 0 ? (
                            insertedData.map((item, index) => (
                                <tr key={`${item.key}-${index}`}>
                                    <td>{item.key}</td>
                                    <td>{item.hash}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="empty-trace">
                                    Use "Insert All" to trace keys.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CalculationTrace;