//client side
var socket = io();
var length = 20;
var id;


function startScreen() {
  var initialScreen = document.getElementById('initial_screen').innerHTML;
  $("#board").html(initialScreen);

}

function drawBoard(length){
  console.log(length);
  for(var i = 0; i < length ; i++){
    var row = $("<div class=row></div>").appendTo("#board");
    for(var j = 0; j < length; j++){
       $(row).append("<div class=square id=" + i + "," + j + ">");
    }
    //  // square.setAttribute('data-row', i);
    //  // square.setAttribute('data-col', j);
    // // bData.addEventListener("click", makeMove);
    // }
  
  }
}

function redrawBoard(boardArray) {
  for (var i = 0; i < boardArray.length; i++) {
    for (var j = 0; j < boardArray.length; j++) {
      if (boardArray[i][j]) {
        $("#" + i + "\\," + j).css("background-color", "blue");
      } else {
        $("#" + i + "\\," + j).css("background-color", "white");
      }
    }
  }
}

function addSquareListeners() {
  $(".square").on("click", function() {
    if ($(this).css("background-color") == "rgb(128, 128, 128)") {
      $(this).css("background-color", "white");
    } else {
      $(this).css("background-color", "grey");
    }
  console.log(id);
  socket.emit("click", {"gameId": id, "squareId": this.id});
  });
}

function startButton() {
  $(".overlay").css("z-index", -1);
  $("#start_button").html("Pause");
}

function pauseButton() {
  $(".overlay").css("z-index", 1);
  $("#start_button").html("Start Game");
}

drawBoard(length);
//  startScreen();
 // $("#board").html($("#initial_screen").html());
  //$("#start_button").on('click', function(){
  //  socket.emit('create room');
  //})
socket.on("id", function(gameId) {
  id = gameId;
  $("body").prepend(gameId);
})

socket.on("board", function(board) {
  console.log("tick");
  redrawBoard(board);
});

socket.on("game over", function() {
  $("body").prepend("game over");
});

socket.on("start", startButton);

socket.on("pause", pauseButton);

socket.on("join", function(success) {
  console.log("join attempted");
  if (success) {
    addSquareListeners();
    $("#start_button").html("Start Game");
  } else {
    $("body").prepend("Game not found");
  }
})

$("#start_button").on("click", function() {
  var button = $(this).html();
  if (button == "Start Game") {
    console.log("start");
    socket.emit("start", id);
    startButton();
  } else if (button == "Create Room") {
    console.log("create");
    // use id sometime
    socket.emit("create");
    addSquareListeners();
    $(this).html("Start Game");
  } else {
    console.log("pause");
    socket.emit("pause", id);
    pauseButton();
  }
});

$("#join-room").submit(function() {
  console.log($("input").val());
  socket.emit("join", $("input").val());
  return false;
})

