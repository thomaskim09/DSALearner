import React from 'react';

/**
 * Displays a trace of inserted keys and their calculated hash values.
 */
const HashTableCalculationTrace = ({ insertedData, tableSize, hash2Formula, prime }) => {
    const isDoubleHashing = insertedData[0]?.hash2 !== null;

    return (
        <div className="calculation-trace">
            <h3 className="trace-header">Insertion Trace</h3>
            <div className="trace-formula">
                hashFunc(key): <span>key % {tableSize}</span>
                {isDoubleHashing && (
                    <>
                        <br/>
                        hashFunc2(key): <span>{hash2Formula}</span>
                    </>
                )}
            </div>
            <div className="trace-table-container">
                <table className="trace-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>hash1</th>
                            {isDoubleHashing && <th>hash2 (Step)</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {insertedData.length > 0 ? (
                            insertedData.map((item, index) => (
                                <tr key={`${item.key}-${index}`}>
                                    <td>{item.key}</td>
                                    <td>{item.hash}</td>
                                    {isDoubleHashing && <td>{item.hash2}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isDoubleHashing ? "3" : "2"} className="empty-trace">
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

export default HashTableCalculationTrace;