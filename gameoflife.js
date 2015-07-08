//client side
function drawBoard(length){
  for(var i = 0; i<length; i++){
    row = document.createElement("div");
    row.className = "row";
    $("#board").append(row);
    for(var j = 0; j<length; j++){
      var square = document.createElement("div");
      square.className = "square";
      square.id = i + "," +j;
      square.setAttribute('data-row', i);
      square.setAttribute('data-col', j);
    // bData.addEventListener("click", makeMove);
      row.append(square);
    }
  }
};

// server side
var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var boards = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/tictactoe.html');
});

io.on('connection', function(socket){
  var gameId = null;
  socket.on('create room', function(){
    gameId = nextAvailableId();
    boards[gameId] = newBoard();
    socket.join(gameId);
    socket.emit('gameId', gameId);
  })
  socket.on('join room', function(joinGameId) {
    gameId = joinGameId;
    var roomId = socket.adapter.rooms[joinGameId];
    if (roomId != undefined){
      socket.join(gameId);
      io.sockets.in(gameId).emit('message', 'Let the game begin!');
    }
  })
  socket.on('move', function(id){
    io.sockets.in(gameId).emit('update board', id)
  });
  socket.on('new game', function(){
    io.sockets.in(gameId).emit('start new game');
  });
});

http.listen(port, function(){
  console.log('listening on :3000');
});

function newBoard() {
  board = [];
  for (var i = 0; i < 25; i++) {
    for (var j = 0; j < 25; j++) {
      board[i][j] = false;
    }
  }
  console.log(board);
}

function nextAvailableId() {

}
function neighbors(i, j) {
  var count = 0;
  if (board[i - 1][j - 1]) {
    count++;
  }
  if (board[i][j - 1]) {
    count++;
  }
  if (board[i + 1][j - 1]) {
    count++;
  }
  if (board[i - 1][j]) {
    count++;
  }
  if (board[i + 1][j]) {
    count++;
  }  
  if (board[i - 1][j + 1]) {
    count++;
  }
  if (board[i][j + 1]) {
    count++;
  }
  if (board[i + 1][j + 1]) {
    count++;
  }
  return count;

function tick() {
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length; j++) {
      if (board[i][j]) {
        checkDeath(i, j);
      } else {
        checkBirth(count)
      }
    }
  }
  board = newBoard;
  //newBoard = board.copy;
}
function checkBirth(i, j) { 
  var count = neighbors(i, j);
  if (count == 3) {
    newBoard[i][j] = true;
  }
}
function checkDeath(i, j) {
  var count = neighbors(i, j);
  if (count > 3 || count < 2) {
    newBoard[i][j] = false;
  }
}