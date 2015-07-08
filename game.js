module.exports = function (id, length, socket) {
  this.socket = socket;
  this.id = id;
  this.neighbors = neighbors;
  this.tick = tick;
  this.isBoardDead = isBoardDead;
  this.checkBirth = checkBirth;
  this.checkDeath = checkDeath;
  this.run = run;
  this.flip = flip;
  this.board = [];
  this.newBoard = [];
  for (var i = 0; i < length; i++) {
    this.board[i] = [];
    this.newBoard[i] = [];
    for (var j = 0; j < length; j++) {
      this.board[i][j] = false;
      this.newBoard[i][j] = false;
    }
  }
}

function flip(x, y) {
  this.newBoard[x][y] = !this.newBoard[x][y];
}

function isBoardDead() {
  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board.length; j++) {
      if (this.board[i][j]) {
        return false;
      }
    }
  }
  return true;
}

function run() {
  console.log(this.tick);
  var game = this;
  // make an anonymous function so that call() works in setInterval
  // creates variable game because otherwise this would refer to the scope of the anonymous function
  game.timer = setInterval(function() {tick.call(game)}, 1000);
}

function neighbors(i, j) {
  var count = 0;
  if (i > 0 && j > 0 && this.board[i - 1][j - 1]) {
    count++;
  }
  if (j > 0 && this.board[i][j - 1]) {
    count++;
  }
  if (i < this.board.length - 1 && j > 0 && this.board[i + 1][j - 1]) {
    count++;
  }
  if (i > 0 && this.board[i - 1][j]) {
    count++;
  }
  if (i < this.board.length - 1 && this.board[i + 1][j]) {
    count++;
  }  
  if (i > 0 && j < this.board.length - 1 && this.board[i - 1][j + 1]) {
    count++;
  }
  if (j < this.board.length - 1 && this.board[i][j + 1]) {
    count++;
  }
  if (i < this.board.length - 1 && j < this.board.length - 1 && this.board[i + 1][j + 1]) {
    count++;
  }
  return count;
}

function tick() {
  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board.length; j++) {
      if (this.board[i][j]) {
        this.checkDeath(i, j);
      } else {
        this.checkBirth(i, j);
      }
    }
  }
  this.board = this.newBoard;
  this.newBoard = deepClone(this.board);
  if (this.isBoardDead()) {
    clearInterval(this.timer);
    //io.sockets.in(this.id).emit("game over", this.board);
    this.socket.emit("game over", this.board);
  }
  console.log("tick");
  //io.sockets.in(this.id).emit('board', this.board);
  this.socket.emit("board", this.board);
}
function checkBirth(i, j) { 
  var count = this.neighbors(i, j);
  if (count == 3) {
    this.newBoard[i][j] = true;
  }
}
function checkDeath(i, j) {
  var count = this.neighbors(i, j);
  if (count > 3 || count < 2) {
    this.newBoard[i][j] = false;
  }
}

function deepClone(board) {
  clone = [];
  for (var i = 0; i < board.length; i++) {
    clone[i] = board[i].slice(0);
  }
  return clone;
}
