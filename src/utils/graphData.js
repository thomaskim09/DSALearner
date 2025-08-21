// DSALearner_packaged/src/utils/graphData.js

export const graphData = [
    {
        name: "Simple Tree",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]],
        positions: [
            { x: 300, y: 50 }, { x: 150, y: 150 }, { x: 450, y: 150 },
            { x: 100, y: 250 }, { x: 200, y: 250 }, { x: 400, y: 250 }, { x: 500, y: 250 }
        ]
    },
    {
        name: "Complete Graph (K5)",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [
            [0, 1], [0, 2], [0, 3], [0, 4],
            [1, 2], [1, 3], [1, 4],
            [2, 3], [2, 4],
            [3, 4]
        ],
        positions: [
            { x: 250, y: 50 }, { x: 450, y: 150 }, { x: 400, y: 350 },
            { x: 100, y: 350 }, { x: 50, y: 150 }
        ]
    },
    {
        name: "Cycle Graph (C6)",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
        positions: [
            { x: 250, y: 50 }, { x: 400, y: 150 }, { x: 400, y: 300 },
            { x: 250, y: 400 }, { x: 100, y: 300 }, { x: 100, y: 150 }
        ]
    },
    {
        name: "Disconnected Graph",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1], [1, 2], [3, 4], [4, 5]],
        positions: [
            { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 150, y: 200 },
            { x: 400, y: 250 }, { x: 500, y: 250 }, { x: 450, y: 350 }
        ]
    },
    {
        name: "Linear Graph (Path)",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
        positions: [
            { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 300, y: 200 },
            { x: 400, y: 200 }, { x: 500, y: 200 }
        ]
    },
    {
        name: "Star Graph",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0, 1], [0, 2], [0, 3], [0, 4]],
        positions: [
            { x: 250, y: 200 }, { x: 150, y: 100 }, { x: 350, y: 100 },
            { x: 150, y: 300 }, { x: 350, y: 300 }
        ]
    },
    {
        name: "Bipartite Graph",
        vertexLabels: ['A', 'B', 'C', 'X', 'Y', 'Z'],
        edges: [[0, 3], [0, 4], [1, 4], [1, 5], [2, 3], [2, 5]],
        positions: [
            { x: 150, y: 100 }, { x: 150, y: 200 }, { x: 150, y: 300 },
            { x: 350, y: 100 }, { x: 350, y: 200 }, { x: 350, y: 300 }
        ]
    },
    {
        name: "Two triangles",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1], [1, 2], [2, 0], [3,4], [4,5], [5,3]],
        positions: [
            { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 150, y: 200 },
            { x: 400, y: 250 }, { x: 500, y: 250 }, { x: 450, y: 350 }
        ]
    },
    {
        name: "Graph with a Bridge",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3]],
        positions: [
             { x: 100, y: 150 }, { x: 200, y: 100 }, { x: 200, y: 200 },
            { x: 300, y: 150 }, { x: 400, y: 100 }, { x: 400, y: 200 }
        ]
    },
    {
        name: "The 'House' Graph",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4]],
        positions: [
            { x: 250, y: 50 }, { x: 150, y: 150 }, { x: 350, y: 150 },
            { x: 150, y: 250 }, { x: 350, y: 250 }
        ]
    }
];