import { useState, useCallback } from 'react';

class Vertex {
    constructor(label) {
        this.label = label;
        this.wasVisited = false;
    }
}

export const useGraph = () => {
    const [graph, setGraph] = useState(() => {
        const MAX_VERTS = 20;
        const adjMat = Array.from({ length: MAX_VERTS }, () => Array(MAX_VERTS).fill(0));
        const vertexList = [];

        const addVertex = (lab) => {
            if (vertexList.length < MAX_VERTS) {
                vertexList.push(new Vertex(lab));
            }
        };

        const addEdge = (start, end) => {
            adjMat[start][end] = 1;
            adjMat[end][start] = 1;
        };

        addVertex('A'); addVertex('B'); addVertex('C'); addVertex('D'); addVertex('E');
        addVertex('F'); addVertex('G'); addVertex('H'); addVertex('I');
        addEdge(0, 1); addEdge(0, 2); addEdge(0, 3); addEdge(0, 4);
        addEdge(1, 5); addEdge(3, 6); addEdge(5, 7); addEdge(6, 8);

        return { vertexList, adjMat, nVerts: vertexList.length };
    });

    const [animation, setAnimation] = useState({ steps: [], isPlaying: false });

    const getAdjUnvisitedVertex = useCallback((v, vertexList) => {
        for (let j = 0; j < graph.nVerts; j++) {
            if (graph.adjMat[v][j] === 1 && !vertexList[j].wasVisited) {
                return j;
            }
        }
        return -1;
    }, [graph]);

    const runAlgorithm = useCallback((algorithm, startVertexIndex) => {
        const localVertexList = graph.vertexList.map(v => new Vertex(v.label));
        const steps = [];
        
        const run = {
            'dfs': () => {
                const stack = [];
                localVertexList[startVertexIndex].wasVisited = true;
                steps.push({ type: 'visit', vertexIndex: startVertexIndex, stack: [startVertexIndex], message: `Start at vertex ${localVertexList[startVertexIndex].label}. Push to stack.` });
                stack.push(startVertexIndex);

                while (stack.length > 0) {
                    const v = getAdjUnvisitedVertex(stack[stack.length - 1], localVertexList);
                    if (v === -1) {
                        const popped = stack.pop();
                        steps.push({ type: 'backtrack', from: popped, stack: [...stack], message: `No unvisited neighbors for ${localVertexList[popped].label}. Pop.` });
                    } else {
                        localVertexList[v].wasVisited = true;
                        const from = stack[stack.length - 1];
                        stack.push(v);
                        steps.push({ type: 'visit', vertexIndex: v, from: from, stack: [...stack], message: `Visit ${localVertexList[v].label}. Push to stack.` });
                    }
                }
            },
            'bfs': () => {
                const queue = [];
                localVertexList[startVertexIndex].wasVisited = true;
                steps.push({ type: 'visit', vertexIndex: startVertexIndex, queue: [startVertexIndex], message: `Start at ${localVertexList[startVertexIndex].label}. Visit and insert.` });
                queue.push(startVertexIndex);

                while (queue.length > 0) {
                    const v1 = queue.shift();
                    steps.push({ type: 'dequeue', vertexIndex: v1, queue: [...queue], message: `Remove ${localVertexList[v1].label}. Check neighbors.` });
                    let v2;
                    while ((v2 = getAdjUnvisitedVertex(v1, localVertexList)) !== -1) {
                        localVertexList[v2].wasVisited = true;
                        queue.push(v2);
                        steps.push({ type: 'visit', vertexIndex: v2, from: v1, queue: [...queue], message: `Visit ${localVertexList[v2].label} and insert.` });
                    }
                }
            },
            'mst': () => {
                const stack = [];
                localVertexList[startVertexIndex].wasVisited = true;
                stack.push(startVertexIndex);
                steps.push({ type: 'start', vertexIndex: startVertexIndex, stack: [startVertexIndex], message: `Start at ${localVertexList[startVertexIndex].label}. Push.` });

                while (stack.length > 0) {
                    const currentVertex = stack[stack.length - 1];
                    const v = getAdjUnvisitedVertex(currentVertex, localVertexList);
                    if (v === -1) {
                        stack.pop();
                    } else {
                        localVertexList[v].wasVisited = true;
                        stack.push(v);
                        steps.push({ type: 'add_edge', from: currentVertex, to: v, stack: [...stack], message: `Add edge ${localVertexList[currentVertex].label}-${localVertexList[v].label}.` });
                    }
                }
            }
        };

        run[algorithm]();
        steps.push({ type: 'done', message: `${algorithm.toUpperCase()} complete.` });
        setAnimation({ steps, isPlaying: true });

    }, [graph, getAdjUnvisitedVertex]);


    return { graph, animation, runAlgorithm, setAnimation };
};