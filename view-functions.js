import { NORTH, EAST, SOUTH, WEST } from './model.js';

function renderMaze(p, maze) {
    let allCells = maze.getAllCells();
    let currentCell = maze.getCurrentCell();
    for (let cell of allCells) {
        drawCell(p, cell);
        highlightCell(p,currentCell);
    }

    let botPath = maze.bot.getPath();
    for (let cell of botPath) {
        highlightPath(p, cell, maze.w);
    }

    drawBot(p, maze.bot, maze.w);
}

function drawBot(p, bot, cellWidth) {
    let x = bot.i * cellWidth;
    let y = bot.j * cellWidth;
    p.textSize(20);
    p.text("🤖", x + 5, y + 20); 
}

function drawCell(p, cell) {
    let x = cell.i * cell.w;
    let y = cell.j * cell.w;
    let wallThickness = 1;

    let rectX = cell.walls[WEST] ? x + wallThickness : x;
    let rectY = cell.walls[NORTH] ? y + wallThickness : y;
    let rectW = cell.w - (cell.walls[WEST] ? wallThickness : 0) - (cell.walls[EAST] ? wallThickness : 0);
    let rectH = cell.w - (cell.walls[NORTH] ? wallThickness : 0) - (cell.walls[SOUTH] ? wallThickness : 0);

    if (cell.visited) {
        p.noStroke();
        p.fill(188,193,155,255);
        p.rect(rectX, rectY, rectW, rectH);
    }

    p.stroke(100);
    p.strokeWeight(wallThickness);

    if (cell.walls[NORTH]) p.line(x, y, x + cell.w, y);
    if (cell.walls[EAST]) p.line(x + cell.w, y, x + cell.w, y + cell.w);
    if (cell.walls[SOUTH]) p.line(x, y + cell.w, x + cell.w, y + cell.w);
    if (cell.walls[WEST]) p.line(x, y, x, y + cell.w);
    p.fill(0);  
    p.textSize(12);  

    let textX = x + cell.w / 2;
    let textY = y + cell.w / 2;

    p.text(`${cell.i}, ${cell.j}`, textX, textY);
}

function highlightCell(p, cell) {

}

function highlightPath(p, cell, cellWidth) {
    let x = cell.i * cellWidth;
    let y = cell.j * cellWidth;
    p.noStroke();
    p.fill(255, 255, 0, 150);  
    p.rect(x, y, cellWidth, cellWidth);
}

export { renderMaze };