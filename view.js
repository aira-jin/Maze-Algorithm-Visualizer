import { renderMaze } from './view-functions.js';

class MazeView {
    constructor(p, model) {
        this.p = p; 
        this.model = model;
    }

    display() {
        renderMaze(this.p,this.model);
    }
}

export { MazeView };