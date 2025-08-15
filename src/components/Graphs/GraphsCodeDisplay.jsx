import React from 'react';

const GraphsCodeDisplay = ({ operation }) => {
    const snippets = {
        dfs: {
            title: "Java Implementation (DFS)",
            code: `public void dfs() { // depth-first search
    vertexList[0].wasVisited = true;
    displayVertex(0);
    theStack.push(0);

    while (!theStack.isEmpty()) {
        int v = getAdjUnvisitedVertex(theStack.peek());
        if (v == -1) {
            theStack.pop();
        } else {
            vertexList[v].wasVisited = true;
            displayVertex(v);
            theStack.push(v);
        }
    }
    // reset flags...
}`
        },
        bfs: {
            title: "Java Implementation (BFS)",
            code: `public void bfs() { // breadth-first search
    vertexList[0].wasVisited = true;
    displayVertex(0);
    theQueue.insert(0);
    int v2;

    while(!theQueue.isEmpty()) {
        int v1 = theQueue.remove();
        while((v2=getAdjUnvisitedVertex(v1)) != -1) {
            vertexList[v2].wasVisited = true;
            displayVertex(v2);
            theQueue.insert(v2);
        }
    }
    // reset flags...
}`
        },
        mst: {
            title: "Java Implementation (MST)",
            code: `public void mst() { // minimum spanning tree
    vertexList[0].wasVisited = true;
    theStack.push(0);

    while(!theStack.isEmpty()) {
        int currentVertex = theStack.peek();
        int v = getAdjUnvisitedVertex(currentVertex);
        if(v == -1) {
            theStack.pop();
        } else {
            vertexList[v].wasVisited = true;
            theStack.push(v);
            
            displayVertex(currentVertex); // from
            displayVertex(v);             // to
            System.out.print(" ");
        }
    }
    // reset flags...
}`
        }
    };

    const displayData = snippets[operation] || snippets.dfs;

    return (
        <div className="code-display">
            <h3>{displayData.title}</h3>
            <pre><code>{displayData.code}</code></pre>
        </div>
    );
};

export default GraphsCodeDisplay;