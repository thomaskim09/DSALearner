// DSALearner_packaged/src/utils/graphData.js

export const unweightedGraphExamples = [
    {
        name: "Simple Tree",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        edges: [[0, 1, 1], [0, 2, 1], [1, 3, 1], [1, 4, 1], [2, 5, 1], [2, 6, 1]],
        positions: [
            { x: 300, y: 50 }, { x: 150, y: 150 }, { x: 450, y: 150 },
            { x: 100, y: 250 }, { x: 200, y: 250 }, { x: 400, y: 250 }, { x: 500, y: 250 }
        ]
    },
    {
        name: "Complete Graph (K5)",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [
            [0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1],
            [1, 2, 1], [1, 3, 1], [1, 4, 1],
            [2, 3, 1], [2, 4, 1],
            [3, 4, 1]
        ],
        positions: [
            { x: 250, y: 50 }, { x: 450, y: 150 }, { x: 400, y: 350 },
            { x: 100, y: 350 }, { x: 50, y: 150 }
        ]
    },
    {
        name: "Cycle Graph (C6)",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1]],
        positions: [
            { x: 250, y: 50 }, { x: 400, y: 150 }, { x: 400, y: 300 },
            { x: 250, y: 400 }, { x: 100, y: 300 }, { x: 100, y: 150 }
        ]
    },
    {
        name: "Disconnected Graph",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1, 1], [1, 2, 1], [3, 4, 1], [4, 5, 1]],
        positions: [
            { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 150, y: 200 },
            { x: 400, y: 250 }, { x: 500, y: 250 }, { x: 450, y: 350 }
        ]
    },
    {
        name: "Linear Graph (Path)",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1]],
        positions: [
            { x: 100, y: 200 }, { x: 200, y: 200 }, { x: 300, y: 200 },
            { x: 400, y: 200 }, { x: 500, y: 200 }
        ]
    },
    {
        name: "Star Graph",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
        positions: [
            { x: 250, y: 200 }, { x: 150, y: 100 }, { x: 350, y: 100 },
            { x: 150, y: 300 }, { x: 350, y: 300 }
        ]
    },
    {
        name: "Bipartite Graph",
        vertexLabels: ['A', 'B', 'C', 'X', 'Y', 'Z'],
        edges: [[0, 3, 1], [0, 4, 1], [1, 4, 1], [1, 5, 1], [2, 3, 1], [2, 5, 1]],
        positions: [
            { x: 150, y: 100 }, { x: 150, y: 200 }, { x: 150, y: 300 },
            { x: 350, y: 100 }, { x: 350, y: 200 }, { x: 350, y: 300 }
        ]
    },
    {
        name: "Two Triangles",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1, 1], [1, 2, 1], [2, 0, 1], [3,4, 1], [4,5, 1], [5,3, 1]],
        positions: [
            { x: 100, y: 100 }, { x: 200, y: 100 }, { x: 150, y: 200 },
            { x: 400, y: 250 }, { x: 500, y: 250 }, { x: 450, y: 350 }
        ]
    },
    {
        name: "Graph with a Bridge",
        vertexLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [[0, 1, 1], [1, 2, 1], [2, 0, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 3, 1]],
        positions: [
             { x: 100, y: 150 }, { x: 200, y: 100 }, { x: 200, y: 200 },
            { x: 300, y: 150 }, { x: 400, y: 100 }, { x: 400, y: 200 }
        ]
    },
    {
        name: "The 'House' Graph",
        vertexLabels: ['A', 'B', 'C', 'D', 'E'],
        edges: [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 1], [2, 4, 1], [3, 4, 1]],
        positions: [
            { x: 250, y: 50 }, { x: 150, y: 150 }, { x: 350, y: 150 },
            { x: 150, y: 250 }, { x: 350, y: 250 }
        ]
    }
];

export const weightedGraphExamples = [
    {
        name: "City Connections",
        vertexLabels: ["A", "B", "C", "D", "E", "F"],
        edges: [
            [0, 1, 6], [0, 3, 4], 
            [1, 2, 10], [1, 3, 7], [1, 4, 7],
            [2, 3, 8], [2, 4, 5], [2, 5, 6],
            [3, 4, 12],
            [4, 5, 7]
        ],
        positions: [
            { x: 50, y: 200 }, { x: 200, y: 100 }, { x: 350, y: 100 },
            { x: 200, y: 300 }, { x: 350, y: 300 }, { x: 500, y: 200 }
        ]
    },
    {
        name: "Network Latency",
        vertexLabels: ["S1", "S2", "S3", "S4", "S5"],
        edges: [
            [0, 1, 15], [0, 2, 25],
            [1, 2, 5], [1, 3, 20],
            [2, 4, 30],
            [3, 4, 10]
        ],
        positions: [
            { x: 100, y: 200 }, { x: 250, y: 100 }, { x: 250, y: 300 },
            { x: 400, y: 100 }, { x: 400, y: 300 }
        ]
    },
    {
        name: "Flight Routes",
        vertexLabels: ["JFK", "LAX", "ORD", "ATL", "MIA"],
        edges: [
            [0, 1, 2475], [0, 2, 740], [0, 3, 850],
            [1, 2, 1745], [1, 4, 2342],
            [2, 3, 606],
            [3, 4, 600]
        ],
        positions: [
            { x: 500, y: 100 }, { x: 50, y: 200 }, { x: 350, y: 150 },
            { x: 380, y: 300 }, { x: 550, y: 350 }
        ]
    },
    {
        name: "Road Trip",
        vertexLabels: ["NY", "CHI", "DEN", "SF", "SEA"],
        edges: [
            [0, 1, 790], [0, 2, 1771],
            [1, 2, 1005], [1, 3, 2139],
            [2, 3, 1258], [2, 4, 1331],
            [3, 4, 807]
        ],
        positions: [
            { x: 550, y: 150 }, { x: 400, y: 180 }, { x: 250, y: 220 },
            { x: 50, y: 250 }, { x: 100, y: 50 }
        ]
    },
    {
        name: "Weighted Star",
        vertexLabels: ["Core", "N1", "N2", "N3", "N4"],
        edges: [
            [0, 1, 10], [0, 2, 20], [0, 3, 5], [0, 4, 15]
        ],
        positions: [
            { x: 250, y: 200 }, { x: 150, y: 100 }, { x: 350, y: 100 },
            { x: 150, y: 300 }, { x: 350, y: 300 }
        ]
    },
    {
        name: "Cost Flow",
        vertexLabels: ["Src", "A", "B", "C", "Sink"],
        edges: [
            [0, 1, 5], [0, 2, 10],
            [1, 3, 8], [2, 3, 4],
            [3, 4, 7]
        ],
        positions: [
            { x: 50, y: 200 }, { x: 200, y: 100 }, { x: 200, y: 300 },
            { x: 350, y: 200 }, { x: 500, y: 200 }
        ]
    },
    {
        name: "Internet Routers",
        vertexLabels: ["R1", "R2", "R3", "R4", "R5", "R6"],
        edges: [
            [0, 1, 5], [0, 2, 3],
            [1, 3, 6], [1, 2, 2],
            [2, 4, 8],
            [3, 4, 4], [3, 5, 9],
            [4, 5, 7]
        ],
        positions: [
            { x: 100, y: 100 }, { x: 250, y: 100 }, { x: 175, y: 200 },
            { x: 400, y: 100 }, { x: 325, y: 200 }, { x: 475, y: 200 }
        ]
    },
    {
        name: "Project Dependencies",
        vertexLabels: ["A", "B", "C", "D", "E", "F"],
        edges: [
            [0, 1, 3], [0, 2, 2], // A is prereq for B (3 days), C (2 days)
            [1, 3, 4],           // B is prereq for D (4 days)
            [2, 3, 1],           // C is prereq for D (1 day)
            [2, 4, 5],           // C is prereq for E (5 days)
            [3, 5, 2],           // D is prereq for F (2 days)
            [4, 5, 3]            // E is prereq for F (3 days)
        ],
        positions: [
            { x: 50, y: 200 }, { x: 200, y: 100 }, { x: 200, y: 300 },
            { x: 350, y: 200 }, { x: 350, y: 400 }, { x: 500, y: 300 }
        ]
    },
    {
        name: "Supply Chain",
        vertexLabels: ["WH", "F1", "F2", "DC1", "DC2", "Ret"],
        edges: [
            [0, 1, 100], [0, 2, 150],
            [1, 3, 50], [2, 4, 75],
            [3, 5, 80], [4, 5, 60]
        ],
        positions: [
            { x: 50, y: 200 }, { x: 200, y: 100 }, { x: 200, y: 300 },
            { x: 350, y: 100 }, { x: 350, y: 300 }, { x: 500, y: 200 }
        ]
    },
    {
        name: "Friendship Strength",
        vertexLabels: ["A", "B", "C", "D", "E"],
        edges: [
            [0, 1, 9], [0, 2, 7], [0, 4, 3],
            [1, 3, 8],
            [2, 3, 5], [2, 4, 6],
            [3, 4, 9]
        ],
        positions: [
            { x: 250, y: 50 }, { x: 450, y: 150 }, { x: 400, y: 350 },
            { x: 100, y: 350 }, { x: 50, y: 150 }
        ]
    }
];
