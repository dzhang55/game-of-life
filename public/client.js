//client side
function startScreen() {
  var initialScreen = document.getElementById('initial_screen').innerHTML;
  $("#board").html(initialScreen);

}

function drawBoard(length){
  console.log(length);
  console.log($("#board").html());
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

function init() {
  var socket = io();
//  startScreen();
 // $("#board").html($("#initial_screen").html());
  //$("#start_button").on('click', function(){
  //  socket.emit('create room');
  //})
  var length = 20;
  socket.emit("create room", length);
  drawBoard(length);
  $(".square").on("click", function() {
    console.log($(this).css("background-color"));
    if ($(this).css("background-color") == "rgb(128, 128, 128)") {
      $(this).css("background-color", "white");
  } else {
    $(this).css("background-color", "grey");
  }
    console.log(this.id);
    socket.emit("click", this.id);
  });
  socket.on("board", function(board) {
    console.log("redrawing");
    redrawBoard(board);
  });
  socket.on("game over", function() {
    $("#board").html("game over");
  });
  $("#start_button").on("click", function() {
    console.log("start");
    socket.emit("start", this.id);
  })
}

function redrawBoard(boardArray) {
  console.log(boardArray);
  for (var i = 0; i < boardArray.length; i++) {
    for (var j = 0; j < boardArray.length; j++) {
      if (boardArray[i][j]) {
        console.log("ITS ALIVE");
        console.log("#" + i + "," + j);
        $("#" + i + "\\," + j).css("background-color", "red");
      } else {
        $("#" + i + "\\," + j).css("background-color", "white");
      }
    }
  }
}
window.addEventListener('load', init);
