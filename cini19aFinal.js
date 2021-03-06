window.addEventListener("load", init);
function works(x,y) {
  return (0<=x && x<=7 && 0<=y && y<=7);
}
class Piece {
  constructor(x, y, type, player) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.player = player;
  }
  hypothetical(x, y) {
    return new Piece(x, y, this.type, this.player);
  }
  getMoveSquares(board) {
    let move = [];
    let capture = [];
    if (this.player == 1 || this.type == 'king') {
      if (works(this.x - 1, this.y - 1)) {
        if (board[this.x - 1][this.y - 1].type == 'none') {
          move.push([this.x - 1, this.y - 1]);
        } else if (works(this.x - 2, this.y - 2)) {
          if (board[this.x - 1][this.y - 1].player == 3-this.player
                   && board[this.x - 2][this.y - 2].type == 'none') {
            capture.push([this.x - 2, this.y - 2]);
          }
        }
      }
      if (works(this.x - 1, this.y + 1)) {
        if (board[this.x - 1][this.y + 1].type == 'none') {
          move.push([this.x - 1, this.y + 1]);
        } else if (works(this.x - 2, this.y + 2)) {
          if (board[this.x - 1][this.y + 1].player == 3-this.player
                   && board[this.x - 2][this.y + 2].type == 'none') {
            capture.push([this.x - 2, this.y + 2]);
          }
        }
      }
    }
    if (this.player == 2 || this.type == 'king') {
      if (works(this.x + 1, this.y - 1)) {
        if (board[this.x + 1][this.y - 1].type == 'none') {
          move.push([this.x + 1, this.y - 1]);
        } else if (works(this.x + 2, this.y - 2)) {
          if (board[this.x + 1][this.y - 1].player == 3-this.player
                     && board[this.x + 2][this.y - 2].type == 'none') {
            capture.push([this.x + 2, this.y - 2]);
          }
        }
      }
      if (works(this.x + 1, this.y + 1)) {
        if (board[this.x + 1][this.y + 1].type == 'none') {
          move.push([this.x + 1, this.y + 1]);
        } else if (works(this.x + 2, this.y + 2)) {
          if (board[this.x + 1][this.y + 1].player == 3-this.player
                   && board[this.x + 2][this.y + 2].type == 'none') {
            capture.push([this.x + 2, this.y + 2]);
          }
        }
      }
    }
    return [move, capture];
  }
}
function makeMove(x1, y1, x2, y2, type, board) {
  var boardC = [];
  for (let x = 0; x < 8; x++) {
    boardC.push([]);
    for (let y = 0; y < 8; y++) {
      boardC[x].push(new Piece(x, y, board[x][y].type, board[x][y].player));
    }
  }
  boardC[x2][y2] = boardC[x1][y1].hypothetical(x2, y2);
  boardC[x1][y1] = new Piece(x1, y1, 'none', undefined);
  if (type == 'capture') {
    let x3 = (x1+x2)/2;
    let y3 = (y1+y2)/2;
    boardC[x3][y3] = new Piece(x3, y3, 'none', undefined);
  }
  if (x2 == 0 || x2 == 7) {
    boardC[x2][y2].type = 'king';
  }
  return boardC;
}
function init() {
  var boardElement = document.getElementsByClassName('divTableCell');
  var boardElArray = [];
  var pieceArray = [];
  for (let x = 0; x < 8; x++) {
    pieceArray.push([]);
    boardElArray.push([]);
    for (let y = 0; y < 8; y++) {
      boardElArray[x].push(boardElement[x*8+y]);
      pieceArray[x].push(new Piece(x, y, 'none', undefined))
      if ((x + y) % 2 == 1) {
        boardElArray[x][y].style.backgroundColor = "black";
      }
      boardElArray[x][y].id = '(' + x + ',' + y + ')';
      if ((x + y)%2 == 1 && x < 3) {
        pieceArray[x][y] = new Piece(x, y, 'normal', 2);
      } else if ((x + y)%2 == 1 && x >= 5) {
        pieceArray[x][y] = new Piece(x, y, 'normal', 1);
      } else {
        pieceArray[x][y] = new Piece(x, y, 'none', undefined);
      }
    }
  }
  function render() {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        while (boardElArray[x][y].hasChildNodes()) {
          boardElArray[x][y].removeChild(boardElArray[x][y].lastChild);
        }
        if (pieceArray[x][y].type != 'none') {
          let yeet = document.createElement("img");
          if (pieceArray[x][y].player == 1) {
            if (pieceArray[x][y].type == 'king') {
              yeet.setAttribute("src", "greenKing.png");
            } else {
              yeet.setAttribute("src", "greenChecker.png");
            }
          } else if (pieceArray[x][y].player == 2) {
            if (pieceArray[x][y].type == 'king') {
              yeet.setAttribute("src", "orangeKing.png");
            } else {
              yeet.setAttribute("src", "orangeChecker.png");
            }
          }
          yeet.style.width = "80%";
          yeet.style.height = "80%";
          boardElArray[x][y].appendChild(yeet);
        }
      }
    }
  }
  render();
  var isPlayer = 1;
  var isClicked = [false, 1, 1]; //index 0 tells whether a square is currently in the clicked state, indexes 1 and 2 give it's x and y position
  var lastBGC;
  var multi = false;

  for (let x = 0; x < boardElArray.length; x++) {
    for (let y = 0; y < boardElArray[x].length; y++) {
      let d = boardElArray[x][y];

      d.addEventListener("click", function tempFunc() {
        clickedSquare(x,y);
      });
    }
  }
  function resetColors() {
    for (let x1 = 0; x1 < 8; x1++) {
      for (let y1 = 0; y1 < 8; y1++) {
        if ((x1 + y1) % 2 == 1) {
          boardElArray[x1][y1].style.backgroundColor = "black";
        }
      }
    }
  }
  function clickedSquare(x, y) {
    for (let x1 = 0; x1 < 8; x1++) {
      for (let y1 = 0; y1 < 8; y1++) {
        if ((x1 + y1) % 2 == 1 && !(x1 == x && y1 == y)) {
          boardElArray[x1][y1].style.backgroundColor = "black";
        }
      }
    }
    if (pieceArray[x][y].player != undefined && !(multi)) {
      if (pieceArray[x][y].player == isPlayer) {
        if (isClicked[0]) {
          boardElArray[isClicked[1]][isClicked[2]].style.backgroundColor = lastBGC;
        }
        let moveArray = pieceArray[x][y].getMoveSquares(pieceArray)[0];
        let captureArray = pieceArray[x][y].getMoveSquares(pieceArray)[1];
        for (i = 0; i < moveArray.length; i++) {
          boardElArray[moveArray[i][0]][moveArray[i][1]].style.backgroundColor = "yellow";
        }
        for (i = 0; i < captureArray.length; i++) {
          boardElArray[captureArray[i][0]][captureArray[i][1]].style.backgroundColor = "orange";
        }
        lastBGC = boardElArray[x][y].style.backgroundColor;
        boardElArray[x][y].style.backgroundColor = "green";
        isClicked = [true, x, y]; //memory for the state of the clicked square
      }
    } else if (boardElArray[x][y].style.backgroundColor == 'yellow') {
      pieceArray = makeMove(isClicked[1], isClicked[2], x, y, 'move', pieceArray);
      isPlayer = 3 - isPlayer;
      render();
      resetColors();
    } else if (boardElArray[x][y].style.backgroundColor == 'orange') {
      pieceArray = makeMove(isClicked[1], isClicked[2], x, y, 'capture', pieceArray);
      let captureArray = pieceArray[x][y].getMoveSquares(pieceArray)[1];
      render();
      resetColors();
      if (captureArray.length == 0) {
        isPlayer = 3 - isPlayer;
        multi = false;
      } else {
        for (i = 0; i < captureArray.length; i++) {
          boardElArray[captureArray[i][0]][captureArray[i][1]].style.backgroundColor = "orange";
        }
        boardElArray[x][y].style.backgroundColor = "green";
        isClicked = [true, x, y];
        multi = true;
      }
    } else if (multi) {
      isPlayer = 3 - isPlayer;
      multi = false;
      for (let x1 = 0; x1 < 8; x1++) {
        for (let y1 = 0; y1 < 8; y1++) {
          if ((x1 + y1) % 2 == 1) {
            boardElArray[x1][y1].style.backgroundColor = "black";
          }
        }
      }
    }
    checkWin();
  }

  function checkWin() {
    let playerArray = [];
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        playerArray.push(pieceArray[x][y].player)
      }
    }
    var winStatement;
    if (!playerArray.includes(1)) {
      winStatement = document.createElement("h1");
      let node = document.createTextNode("orange wins!!");
      winStatement.appendChild(node);
      winStatement.style.color = "orange";
      winStatement.id = "winStatement";
      document.body.appendChild(winStatement);
      console.log("orange wins");
      pauseFirst();
    } else if (!playerArray.includes(2)) {
      winStatement = document.createElement("h1");
      let node = document.createTextNode("green wins!!");
      winStatement.appendChild(node);
      winStatement.style.color = "lime";
      winStatement.id = "winStatement";
      document.body.appendChild(winStatement);
      console.log("green wins");
      pauseFirst();
    }
  }
}

function pauseFirst() {
  let wtf = setTimeout(function(){ resetButton(); }, 3000);
}

function resetButton() {
  console.log("resetting...");
  location.reload();
}
