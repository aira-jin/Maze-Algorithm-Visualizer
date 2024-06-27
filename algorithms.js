import { getIndex } from './model.js';

function BFS(model) {
    const start = model.grid[0];
    const goal = model.grid[model.grid.length - 1];
    let queue = [];
    let visited = new Set();
    let cameFrom = new Map();

    queue.push(start);

    while (queue.length > 0) {
        let current = queue.shift();

        if (current === goal) {
            return reconstructPath(cameFrom, start, goal);
        }

        let neighbors = getValidNeighbors(current, model);
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                visited.add(neighbor);
                cameFrom.set(neighbor, current);
            }
        }
    }

    return [];
}

function getValidNeighbors(cell, model) {
    const directions = [
        {i: 0, j: -1},  
        {i: 1, j: 0},   
        {i: 0, j: 1},   
        {i: -1, j: 0}   
    ];
    let neighbors = [];

    directions.forEach((dir, index) => {
        if (!cell.walls[index]) {  
            const ni = cell.i + dir.i;
            const nj = cell.j + dir.j;
            const neighbor = model.grid[getIndex(ni, nj, model.rows)];
            if (neighbor) neighbors.push(neighbor);
        }
    });

    return neighbors;
}

function heuristic(a, b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function reconstructPath(cameFrom, start, goal) {
    let path = [];
    let current = goal;

    while (current !== start) {
        path.unshift(current);
        current = cameFrom.get(current);
    }
    path.unshift(start);  

    return path;
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(node, priority) {
        this.elements.push({node, priority});
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().node;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function GBFS(model) {
    const start = model.grid[0];
    const goal = model.grid[model.grid.length - 1];
    let queue = new PriorityQueue();
    let visited = new Set();
    let cameFrom = new Map();

    queue.enqueue(start, heuristic(start, goal));

    while (!queue.isEmpty()) {
        let current = queue.dequeue();

        if (current === goal) {
            return reconstructPath(cameFrom, start, goal);
        }

        if (visited.has(current)) {
            continue;
        }
        visited.add(current);

        let neighbors = getValidNeighbors(current, model);
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                cameFrom.set(neighbor, current);
                queue.enqueue(neighbor, heuristic(neighbor, goal));
            }
        }
    }

    return [];
}

function DFS(model) {
    const start = model.grid[0];
    const goal = model.grid[model.grid.length - 1];
    let stack = [];
    let visited = new Set();
    let cameFrom = new Map();

    stack.push(start);

    while (stack.length > 0) {
        let current = stack.pop();

        if (current === goal) {
            return reconstructPath(cameFrom, start, goal);
        }

        let neighbors = getValidNeighbors(current, model);
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
                visited.add(neighbor);
                cameFrom.set(neighbor, current);
            }
        }
    }

    return [];
}

function randomWalk(model) {
    const start = model.grid[0];
    const goal = model.grid[model.grid.length - 1];
    let current = start;
    let visited = new Set();
    let cameFrom = new Map();

    while (current !== goal) {
        visited.add(current);

        let neighbors = getValidNeighbors(current, model);
        let unvisitedNeighbors = neighbors.filter(neighbor => !visited.has(neighbor));

        if (unvisitedNeighbors.length === 0) {
            current = cameFrom.get(current); 
            if (!current) {  
                return [];   
            }
            continue;
        }

        let next = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
        cameFrom.set(next, current);
        current = next;
    }

    return reconstructPath(cameFrom, start, goal);
}   

function trueRandomWalk(model) {
    const start = model.grid[0];
    const goal = model.grid[model.grid.length - 1];
    let current = start;
    let path = [start];  

    while (current !== goal) {
        let neighbors = getValidNeighbors(current, model);

        let next = neighbors[Math.floor(Math.random() * neighbors.length)];
        path.push(next);  
        current = next;
    }

    return path;
}

function astar(model) {
    const start = model.grid[0];
    const goal = model.grid[model.grid.length - 1];
    let openSet = new PriorityQueue();
    let closedSet = new Set();
    let cameFrom = new Map();
    let gScore = new Map();

    gScore.set(start, 0);
    openSet.enqueue(start, heuristic(start, goal));

    while (!openSet.isEmpty()) {
        let current = openSet.dequeue();

        if (current === goal) {
            return reconstructPath(cameFrom, start, goal);
        }

        closedSet.add(current);

        let neighbors = getValidNeighbors(current, model);
        for (let neighbor of neighbors) {
            if (closedSet.has(neighbor)) continue;

            let tentativeGScore = gScore.get(current) + 1; 

            if (!openSet.elements.some(e => e.node === neighbor) || tentativeGScore < gScore.get(neighbor)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);

                let fScore = tentativeGScore + heuristic(neighbor, goal);
                openSet.enqueue(neighbor, fScore);
            }
        }
    }

    return [];
}

export { BFS, GBFS, DFS, randomWalk, trueRandomWalk, astar };