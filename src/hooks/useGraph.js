// DSALearner_packaged/src/hooks/useGraph.js

import { useState, useCallback } from 'react';
import { unweightedGraphExamples, weightedGraphExamples } from '../utils/graphData';

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
    const [graphType, setGraphType] = useState('unweighted'); // 'unweighted' or 'weighted'
    const [graph, setGraph] = useState(() => createGraphFromData(unweightedGraphExamples[0]));
    const [animation, setAnimation] = useState({ steps: [], isPlaying: false });

    const loadGraph = useCallback((type, index) => {
        const data = type === 'weighted' ? weightedGraphExamples[index] : unweightedGraphExamples[index];
        setGraph(createGraphFromData(data));
        setAnimation({ steps: [], isPlaying: false }); // Reset animation
    }, []);
    
    const handleGraphTypeChange = (type) => {
        setGraphType(type);
        loadGraph(type, 0); // Load the first example of the new type
    };

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
                steps.push({ type: 'visit', vertexIndex: startVertexIndex, vertexLabel: localVertexList[startVertexIndex].label, stack: [localVertexList[startVertexIndex].label], message: `Start at vertex ${localVertexList[startVertexIndex].label}. Push to stack.` });
                stack.push(startVertexIndex);

                while (stack.length > 0) {
                    const v = getAdjUnvisitedVertex(stack[stack.length - 1], localVertexList);
                    if (v === -1) {
                        const poppedIndex = stack.pop();
                        steps.push({ type: 'backtrack', from: poppedIndex, vertexLabel: localVertexList[poppedIndex].label, stack: stack.map(i => localVertexList[i].label), message: `No unvisited neighbors for ${localVertexList[poppedIndex].label}. Pop.` });
                    } else {
                        localVertexList[v].wasVisited = true;
                        const from = stack[stack.length - 1];
                        stack.push(v);
                        steps.push({ type: 'visit', vertexIndex: v, vertexLabel: localVertexList[v].label, from: from, stack: stack.map(i => localVertexList[i].label), message: `Visit ${localVertexList[v].label}. Push to stack.` });
                    }
                }
            },
            'bfs': () => {
                const queue = [];
                localVertexList[startVertexIndex].wasVisited = true;
                steps.push({ type: 'visit', vertexIndex: startVertexIndex, vertexLabel: localVertexList[startVertexIndex].label, queue: [localVertexList[startVertexIndex].label], message: `Start at ${localVertexList[startVertexIndex].label}. Visit and insert.` });
                queue.push(startVertexIndex);

                while (queue.length > 0) {
                    const v1 = queue.shift();
                    steps.push({ type: 'dequeue', vertexIndex: v1, vertexLabel: localVertexList[v1].label, queue: queue.map(i => localVertexList[i].label), message: `Remove ${localVertexList[v1].label}. Check neighbors.` });
                    let v2;
                    while ((v2 = getAdjUnvisitedVertex(v1, localVertexList)) !== -1) {
                        localVertexList[v2].wasVisited = true;
                        queue.push(v2);
                        steps.push({ type: 'visit', vertexIndex: v2, vertexLabel: localVertexList[v2].label, from: v1, queue: queue.map(i => localVertexList[i].label), message: `Visit ${localVertexList[v2].label} and insert.` });
                    }
                }
            },
            'mst': () => {
                const priorityQueue = [];
                let currentVert = startVertexIndex;
                const mstEdges = [];
                let stepCounter = 1;

                steps.push({
                    type: 'start',
                    vertexIndex: currentVert,
                    message: `Start at vertex ${localVertexList[currentVert].label}.`,
                    tableRow: { 
                        step: stepCounter++, 
                        unpruned: localVertexList[currentVert].label, 
                        pruned: '-', 
                        removed: '-' 
                    }
                });

                while (mstEdges.length < graph.nVerts - 1) {
                    localVertexList[currentVert].wasVisited = true;

                    for (let j = 0; j < graph.nVerts; j++) {
                        if (graph.adjMat[currentVert][j] > 0 && !localVertexList[j].wasVisited) {
                            priorityQueue.push({ from: currentVert, to: j, weight: graph.adjMat[currentVert][j] });
                        }
                    }
                    priorityQueue.sort((a, b) => a.weight - b.weight);

                    if (priorityQueue.length === 0) break;

                    let edge = priorityQueue.shift();
                    let destVert = edge.to;
                    let removedDuplicate = '-';
                    
                    if(localVertexList[destVert].wasVisited) {
                        removedDuplicate = `${localVertexList[edge.from].label}-${localVertexList[edge.to].label}(${edge.weight})`;
                        while(localVertexList[destVert].wasVisited && priorityQueue.length > 0) {
                            const nextEdge = priorityQueue.shift();
                            edge = nextEdge;
                            destVert = nextEdge.to;
                        }
                    }

                    if(!localVertexList[destVert].wasVisited) {
                        mstEdges.push(edge);
                        steps.push({
                            type: 'add_edge',
                            from: edge.from,
                            to: edge.to,
                            message: `Add edge ${localVertexList[edge.from].label}-${localVertexList[edge.to].label} with weight ${edge.weight}.`,
                            tableRow: {
                                step: stepCounter++,
                                unpruned: `${localVertexList[edge.from].label}-${localVertexList[edge.to].label}(${edge.weight})`,
                                pruned: priorityQueue.map(e => `${localVertexList[e.from].label}-${localVertexList[e.to].label}(${e.weight})`).join(', '),
                                removed: removedDuplicate
                            }
                        });
                        currentVert = destVert;
                    }
                }
            }
        };

        run[algorithm]();
        steps.push({ type: 'done', message: `${algorithm.toUpperCase()} complete.` });
        setAnimation({ steps, isPlaying: true });

    }, [graph, getAdjUnvisitedVertex]);


    return { graph, graphType, animation, runAlgorithm, setAnimation, loadGraph, handleGraphTypeChange };
};
