var canvas = document.getElementById('canvas');
var stepButton = document.getElementById('step-button');
var drawButton = document.getElementById('draw-button');
var eraseButton = document.getElementById('erase-button');
var fillButton = document.getElementById('fill-button');
var clearButton = document.getElementById('clear-button');
var mousePos = document.getElementById('mouse-pos');
var mouseMode = document.getElementById('mouse-mode');
var playPauseButton = document.getElementById('play-pause-button');
var ctx = canvas.getContext("2d");

var draw = 1;
var play = 0;
var interval;

const width = 30;
const height = 30;
const squareSize = 20;

playPauseButton.addEventListener('click', playPause);

stepButton.addEventListener('click', step);
drawButton.addEventListener('click', e => {
    draw = 1;
    refreshMouseMode();
})
eraseButton.addEventListener('click', e => {
    draw = 0;
    refreshMouseMode();
})

canvas.addEventListener('mousemove', e => {
    x = e.offsetX/squareSize;
    y = e.offsetY/squareSize;
    x = parseInt(x);
    y = parseInt(y);
    refreseMousePos(x,y);
})

canvas.addEventListener('click', e => {
    // TODOO(#1): Add Drag Mouse for Draw Mode
    x = e.offsetX/squareSize;
    y = e.offsetY/squareSize;
    x = parseInt(x);
    y = parseInt(y);

    if(draw == 1){
        board[y][x] = 1;
    }
    else{ 
        board[y][x] = 0;
    }
    printBoard(board);
})

var board = Array(width).fill(0).map(() => Array(height).fill(0));
createBoard();
board[0][1] = 1;
board[1][1] = 1;
board[2][1] = 1;
printBoard(board);
refreshMouseMode();

fillButton.addEventListener('click', createBoard)
clearButton.addEventListener('click', (e) => {
    board = Array(width).fill(0).map(() => Array(height).fill(0));
    printBoard(board);
})

function createBoard(){
    for(y = 0; y < board.length; y++){
        for(x = 0; x < board.length; x++){
            var random = Math.random() * (10 - 1) + 1;
            if(random > 5){
                board[y][x] = 1;
            }
        }    
    }
    printBoard(board);
}

function playPause(){
    if(play == 1){
        play = 0;
        clearInterval(interval);
        refreshButtonPlay();
        return;
    }
    if(play == 0){
        play = 1;
        interval = setInterval(() => {
            step();
        }, 200); 
        refreshButtonPlay();
        return;
    }
}

function refreshButtonPlay(){
    console.log(play);
    if(play == 1){
        playPauseButton.innerText = "Pause";
    }
    else{
        playPauseButton.innerText = "Play";
    }
}

function refreshMouseMode(){
    let text;
    if(draw == 1){
        text = "Mouse Mode: Draw";
    }
    else if(draw == 0){
        text = "Mouse Mode: Erase";
    }
    mouseMode.innerHTML = text;
}

function refreseMousePos(x, y){
    let text;
    text = "Mouse: (" + (x+1) + ", " + (y+1) + ")";
    mousePos.innerHTML = text;
}

function printBoard(board) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0,0,0)";
    for(var y = 0; y < board.length; y ++){
        for(var x = 0; x < board.length; x++){
            if(board[y][x] == 1){
                ctx.fillRect(x*squareSize,y*squareSize, squareSize, squareSize);        
            }
        }
    }
    ctx.fillStyle = "rgb(211,211,211)";
    for(var y = 0; y <= board.length; y ++){
        ctx.fillRect(0,y*squareSize, board.length*squareSize, 5);
        for(var x = 0; x <= board.length; x++){
            ctx.fillRect(x*squareSize,0, 5, board.length*squareSize);
        }
    }
}

function step(){
    var tempBoard = Array(width).fill(0).map(() => Array(height).fill(0));
    for(var y = 0; y < board.length; y++){
        for(var x = 0; x < board.length; x++){
            var aliveNeighbours = countAliveNeighbours(x,y);

            if(board[y][x] == 1){
                if(aliveNeighbours < 2){
                tempBoard[y][x] = 0;
            }else if(aliveNeighbours == 2 || aliveNeighbours == 3){
                tempBoard[y][x] = 1;
            }
            else if(aliveNeighbours > 3){
                tempBoard[y][x] = 0;
            }
        }else{
                if(aliveNeighbours == 3){
                    tempBoard[y][x] = 1;
                }
            }
        }
    }
    board = tempBoard;
    printBoard(board);
}

function countAliveNeighbours(x, y){
    let count = 0;

    count += checkOutOfBound(x-1, y-1);
    count += checkOutOfBound(x, y-1);
    count += checkOutOfBound(x-1, y);
    count += checkOutOfBound(x+1, y);
    count += checkOutOfBound(x, y+1);
    count += checkOutOfBound(x+1, y+1);
    count += checkOutOfBound(x+1, y-1);
    count += checkOutOfBound(x-1, y+1);
    return count;
}

function checkOutOfBound(x, y){
    if(x < 0 || x >= board.length){
        return 0;
    }
    if(y < 0 || y >= board.length){
        return 0;
    }
    else{
        return board[y][x];
    }
}
