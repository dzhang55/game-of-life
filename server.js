// server side
var Game = require("./game.js");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('create room', function(length){
    console.log("room created!!");
    var id = nextAvailableId();
    // JUST ONE GAME FOR NOW
    //console.log("socket in server.js" + socket);
    game = new Game(0, length, socket);
   // socket.join(id);
   // socket.emit('gameId', id);
  });
  socket.on('join room', function(joinGameId) {
    gameId = joinGameId;
    var roomId = socket.adapter.rooms[joinGameId];
    if (roomId != undefined){
      socket.join(gameId);
      io.sockets.in(gameId).emit('message', 'Let the game begin!');
    }
  });
  socket.on("start", function(id) {
    console.log("game started");
    game.run();
  });
  socket.on('click', function(squareId){
    pos = squareId.split(",");
    var x = parseInt(pos[0]);
    var y = parseInt(pos[1]);
    console.log("x: " + x + " y: " + y)
    game.flip(x, y);
  });
  socket.on('new game', function(){
    io.sockets.in(gameId).emit('start new game');
  });
});

http.listen(port, function(){
  console.log('listening on :3000');
});

// var test = new Game(5, 10);
// console.log(test.neighbors(0, 1));
// test.flip(0, 0);
// console.log(test.neighbors(0, 1));
// test.tick();

function nextAvailableId() {
  return 0;
  for (var i = 0; i < games.length; i++) {
    if (games[i] == undefined || boards[i] == null) {
      return i;
    }
  }
}