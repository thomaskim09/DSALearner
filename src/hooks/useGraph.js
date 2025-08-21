// DSALearner_packaged/src/hooks/useGraph.js

import { useState, useCallback } from 'react';
import { graphData } from '../utils/graphData';

class Vertex {
    constructor(label) {
        this.label = label;
        this.wasVisited = false;
    }
}

const MAX_VERTS = 20;

const createGraphFromData = (data) => {
    const adjMat = Array.from({ length: MAX_VERTS }, () => Array(MAX_VERTS).fill(0));
    const vertexList = data.vertexLabels.map(label => new Vertex(label));
    data.edges.forEach(([start, end, weight]) => {
        adjMat[start][end] = weight;
        adjMat[end][start] = weight;
    });
    return { vertexList, adjMat, nVerts: vertexList.length, positions: data.positions };
};

export const useGraph = () => {
    const [graph, setGraph] = useState(() => createGraphFromData(graphData[0]));
    const [animation, setAnimation] = useState({ steps: [], isPlaying: false });

    const loadGraph = useCallback((index) => {
        setGraph(createGraphFromData(graphData[index]));
        setAnimation({ steps: [], isPlaying: false }); // Reset animation
    }, []);

    const getAdjUnvisitedVertex = useCallback((v, vertexList) => {
        for (let j = 0; j < graph.nVerts; j++) {
            if (graph.adjMat[v][j] > 0 && !vertexList[j].wasVisited) {
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
                const priorityQueue = []; // Use an array as a simple priority queue
                localVertexList[startVertexIndex].wasVisited = true;

                // Add all edges from the starting vertex to the priority queue
                for (let j = 0; j < graph.nVerts; j++) {
                    if (graph.adjMat[startVertexIndex][j] > 0) {
                        priorityQueue.push({ from: startVertexIndex, to: j, weight: graph.adjMat[startVertexIndex][j] });
                    }
                }
                priorityQueue.sort((a, b) => a.weight - b.weight); // Sort by weight

                const mstEdges = [];
                steps.push({ type: 'start', vertexIndex: startVertexIndex, message: `Start at ${localVertexList[startVertexIndex].label}.` });

                while (priorityQueue.length > 0 && mstEdges.length < graph.nVerts - 1) {
                    const { from, to, weight } = priorityQueue.shift(); // Get the edge with the minimum weight

                    if (localVertexList[to].wasVisited) {
                        continue; // Skip if the vertex is already in the tree
                    }

                    localVertexList[to].wasVisited = true;
                    mstEdges.push({ from, to, weight });
                    steps.push({ type: 'add_edge', from, to, message: `Add edge ${localVertexList[from].label}-${localVertexList[to].label} with weight ${weight}.` });

                    // Add new edges from the newly added vertex
                    for (let j = 0; j < graph.nVerts; j++) {
                        if (graph.adjMat[to][j] > 0 && !localVertexList[j].wasVisited) {
                            priorityQueue.push({ from: to, to: j, weight: graph.adjMat[to][j] });
                        }
                    }
                    priorityQueue.sort((a, b) => a.weight - b.weight); // Re-sort the priority queue
                }
            }
        };

        run[algorithm]();
        steps.push({ type: 'done', message: `${algorithm.toUpperCase()} complete.` });
        setAnimation({ steps, isPlaying: true });

    }, [graph, getAdjUnvisitedVertex]);


    return { graph, animation, runAlgorithm, setAnimation, loadGraph };
};