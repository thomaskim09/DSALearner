import React from 'react';

const GraphsCodeDisplay = ({ operation }) => {
    const snippets = {
        dfs: {
            title: "Java Implementation (DFS)",
            code: `// Start vertex is now a parameter
public void dfs(int startVertex) {
    vertexList[startVertex].wasVisited = true;
    displayVertex(startVertex);
    theStack.push(startVertex);

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
            code: `// Start vertex is now a parameter
public void bfs(int startVertex) {
    vertexList[startVertex].wasVisited = true;
    displayVertex(startVertex);
    theQueue.insert(startVertex);
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
            code: `// Start vertex is now a parameter
public void mst(int startVertex) {
    vertexList[startVertex].wasVisited = true;
    theStack.push(startVertex);

    while(!theStack.isEmpty()) {
        int currentVertex = theStack.peek();
        int v = getAdjUnvisitedVertex(currentVertex);
        if(v == -1) {
            theStack.pop();
        } else {
            vertexList[v].wasVisited = true;
            theStack.push(v);
            
            displayVertex(currentVertex);
            displayVertex(v);
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