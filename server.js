// server side
var Game = require("./game.js");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var port = process.env.PORT || 3000;
var io = require("socket.io")(http);
var length = 20;

// Game objects for all the rooms
var games = [];

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket){
  //game = new Game(0, length, socket);
  socket.on("create", function(){
    console.log("room created!!");
    //var id = nextAvailableId();
    var id = 0;
    // JUST ONE GAME FOR NOW
    //console.log("socket in server.js" + socket);
    if (!games[id]) {
      games[id] = new Game(0, length, io);
    }
    socket.join(id);
    socket.emit("id", id);
  });
  socket.on("join", function(id) {
    console.log("user joined room " + id);
    var roomId = socket.adapter.rooms[id];
    console.log(roomId);
    if (roomId != undefined){
      socket.join(id);
      io.sockets.in(id).emit("message", "Let the game begin!");
      socket.emit("join", true);
      socket.emit("id", id);
    } else {
      socket.emit("join", false);
    }
  });
  socket.on("start", function(id) {
    console.log(id);
    console.log("game started");
    io.sockets.in(id).emit("start");
    games[id].run();
  });
  socket.on("click", function(data){
    var id = data.gameId;
    pos = data.squareId.split(",");
    var x = parseInt(pos[0]);
    var y = parseInt(pos[1]);
    console.log("x: " + x + " y: " + y)
    games[id].flip(x, y);
  });
  socket.on("pause", function(id) {
    console.log("pause");
    io.sockets.in(id).emit("pause");
    games[id].pause();
  });
  socket.on("new game", function(){
    io.sockets.in(gameId).emit("start new game");
  });
});

http.listen(port, function(){
  console.log("listening on :3000");
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