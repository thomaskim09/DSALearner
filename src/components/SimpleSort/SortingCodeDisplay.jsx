import React from 'react';

const SortingCodeDisplay = ({ sortType }) => {
    const snippets = {
        bubble: {
            code: `public void bubbleSort() {
    int out, in;
    for(out=nElems-1; out>0; out--)
        for(in=0; in<out; in++)
            if( a[in] > a[in+1] )
                swap(in, in+1);
}`,
            complexity: "O(N²)"
        },
        selection: {
            code: `public void selectionSort() {
    int out, in, min;
    for(out=0; out<nElems-1; out++) {
        min = out;
        for(in=out+1; in<nElems; in++)
            if(a[in] < a[min])
                min = in;
        swap(out, min);
    }
}`,
            complexity: "O(N²)"
        },
        insertion: {
            code: `public void insertionSort() {
    int in, out;
    for(out=1; out<nElems; out++) {
        long temp = a[out];
        in = out;
        while(in>0 && a[in-1] >= temp) {
            a[in] = a[in-1];
            --in;
        }
        a[in] = temp;
    }
}`,
            complexity: "O(N²)"
        }
    };

    const info = snippets[sortType];
    const sortName = sortType.charAt(0).toUpperCase() + sortType.slice(1);

    return (
        <div className="code-display-sort">
            <h3>{sortName} Sort</h3>
            <div className="complexity-display">
                <strong>Time Complexity:</strong> {info.complexity}
            </div>
            <pre><code>{info.code}</code></pre>
        </div>
    );
};

export default SortingCodeDisplay;