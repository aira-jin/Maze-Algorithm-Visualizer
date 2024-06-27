export const NORTH = 0;
export const EAST = 1;
export const SOUTH = 2;
export const WEST = 3;

class Cell {
    constructor(i, j, w, cols, rows) {
        this.i = i;
        this.j = j;
        this.w = w;
        this.cols = cols;
        this.rows = rows;
        this.walls = [true, true, true, true];
        this.visited = false;
    }

    getRandomUnvisitedNeighbor(grid) {
        let neighbors = [];
        let north_neighbor = grid[getIndex(this.i, this.j - 1, this.rows)];
        let east_neighbor = grid[getIndex(this.i + 1, this.j, this.rows)];
        let south_neighbor = grid[getIndex(this.i, this.j + 1, this.rows)];
        let west_neighbor = grid[getIndex(this.i - 1, this.j, this.rows)];

        if (north_neighbor && !north_neighbor.visited) neighbors.push(north_neighbor);
        if (east_neighbor && !east_neighbor.visited) neighbors.push(east_neighbor);
        if (south_neighbor && !south_neighbor.visited) neighbors.push(south_neighbor);
        if (west_neighbor && !west_neighbor.visited) neighbors.push(west_neighbor);

        return neighbors.length ? neighbors[Math.floor(Math.random() * neighbors.length)] : undefined;
    }
}

class MazeModel {
    constructor(n, canvasWidth) {
        this.cols = n;
        this.rows = n;
        this.w = canvasWidth / this.cols;
        this.grid = this.makeGrid();
        this.current = this.grid[0];
        this.stack = [];
        this.bot = new Bot();
        this.visitedCounter = 0;
    }

    makeGrid() {
        let grid = [];
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                grid.push(new Cell(i, j, this.w, this.cols, this.rows));
            }
        }
        return grid;
    }

    carvePath(a, b) {
        let xDiff = a.i - b.i;
        if (xDiff === 1) {
            a.walls[WEST] = false;
            b.walls[EAST] = false;
        } else if (xDiff === -1) {
            a.walls[EAST] = false;
            b.walls[WEST] = false;
        }
        let yDiff = a.j - b.j;
        if (yDiff === 1) {
            a.walls[NORTH] = false;
            b.walls[SOUTH] = false;
        } else if (yDiff === -1) {
            a.walls[SOUTH] = false;
            b.walls[NORTH] = false;
        }
    }

    generateStep() {
        if (!this.current.visited) {
            this.visitedCounter++; 
            this.current.visited = true;
        }

        let next = this.current.getRandomUnvisitedNeighbor(this.grid);
        if (next) {
            this.stack.push(this.current);
            this.carvePath(this.current, next);
            this.current = next;

        } else if (this.stack.length) {
            this.current = this.stack.pop();
        }

    }

    getCurrentCell() {
        return this.current;
    }

    getAllCells() {
        return this.grid;
    }

    isMazeCompleted() {
        return this.visitedCounter === this.grid.length;
    }    

    createRandomHoles() {
        let numHoles = Math.floor(this.grid.length * 0.1);  
        for (let i = 0; i < numHoles; i++) {
            let randomCell = this.grid[Math.floor(Math.random() * this.grid.length)];
            let randomWall = Math.floor(Math.random() * 4);
            randomCell.walls[randomWall] = false;
        }
    }

    countWalls() {
        let wallCount = 0;
        for (let cell of this.grid) {
            for (let wall of cell.walls) {
                if (wall) {
                    wallCount++;
                }
            }
        }
        return wallCount;
    }

    getStepCount() {
        return this.stack.length;
    }

    generateCompleteMaze() {
        while (!this.isMazeCompleted()) {
            console.log("Generating maze...")
            this.generateStep();
        }
    }

    getCell(i, j) {
        return this.grid[getIndex(i, j, this.rows)];
    }

    modifyCell(i, j, walls) {
        const cell = this.grid[getIndex(i, j, this.rows)];
        for (let k = 0; k < 4; k++) {
            if (walls[k] !== undefined) {
                cell.walls[k] = walls[k];
            }
        }
    }

}

function getIndex(i, j, rows) {
    if (i < 0 || j < 0 || i >= rows || j >= rows) {
        return -1;
    }
    return j + i * rows;
}

class Bot {
    constructor() {
        this.i = 0;
        this.j = 0;
        this.counter = 0;
        this.path = [];
    }

    move(i, j) {
        this.i = i;
        this.j = j;
        this.counter++;
        this.path.push({i, j});  
    }

    getCounter() {
        return this.counter;
    }

    getPath() {
        return this.path;
    }

    reset() {
        this.i = 0;
        this.j = 0;
        this.counter = 0;
        this.path = [];
    }
}

export { getIndex };
export { Bot };
export { MazeModel as Maze };