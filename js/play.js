/****************************\
 ============================

         BROWSER MODE

 ============================              
\****************************/

// init engine
var engine = new Engine();

// update version in GUI
document.title = 'WukongJS v ' + engine.VERSION;
document.getElementById('engine-title').innerHTML = 
  'Wukong JS ' + engine.VERSION +
  ' ~ ' + engine.ELO + ' ELO';

// run in browser mode  
console.log('\n  Wukong JS - BROWSER MODE - v' + engine.VERSION);
console.log('  type "engine" for public API reference');

// import sounds
var moveSound = new Audio('Sounds/move.wav');
var captureSound = new Audio('Sounds/capture.wav');

// user input controls
var clickLock = 0;
var allowBook = 1;
var userSource, userTarget;

// 3 fold repetitions
var repetitions = 0;
  
// pick piece handler
function dragPiece(event, square) { userSource = square; }

// drag piece handler
function dragOver(event, square) { event.preventDefault();
  if (square == userSource) event.target.src = 'Images/0.gif';
}

// drop piece handler
function dropPiece(event, square) {
  userTarget = square;
  let promotedPiece = parseInt(document.getElementById('promoted').value);
  promotedPiece = (engine.getSide() ? (promotedPiece + 6): promotedPiece)
  let valid = validateMove(userSource, userTarget, promotedPiece);
  engine.movePiece(userSource, userTarget, promotedPiece);
  
  clickLock = 0;
  
  if (engine.getPiece(square) && valid) {
    document.getElementById(square).style.backgroundColor = engine.SELECT_COLOR;
    playSound(valid);
  }
  
  event.preventDefault();
  if (valid) setTimeout(function() { think() }, 100);
}

// click event handler
function tapPiece(square) {
  engine.drawBoard();
  engine.updateBoard();
  
  if (engine.getPiece(square)) 
    document.getElementById(square).style.backgroundColor = engine.SELECT_COLOR;
  
  var clickSquare = parseInt(square, 10)
  
  if(!clickLock && engine.getPiece(clickSquare)) {      
    userSource = clickSquare;
    clickLock ^= 1;
  } else if(clickLock) {      
    userTarget = clickSquare;
    
    let promotedPiece = parseInt(document.getElementById('promoted').value);
    promotedPiece = (engine.getSide() ? (promotedPiece + 6): promotedPiece)
    let valid = validateMove(userSource, userTarget, promotedPiece);
    engine.movePiece(userSource, userTarget, promotedPiece);
    clickLock = 0;
    
    if (engine.getPiece(square) && valid) {
      document.getElementById(square).style.backgroundColor = engine.SELECT_COLOR;
      playSound(valid);
    }

    if (valid) setTimeout(function() { think() }, 1);
  }
}

// validate move
function validateMove(userSource, userTarget, promotedPiece) {
  let moveString = engine.squareToString(userSource) + 
                   engine.squareToString(userTarget) +
                   engine.promotedToString(promotedPiece);

  let move = engine.moveFromString(moveString);
  return move;
}

// set FEN
function setFen() {
  let fen = document.getElementById('fen').value;
  if (fen != engine.START_FEN) allowBook = 0;
  engine.setBoard(fen);
  engine.drawBoard();
  engine.updateBoard();
}

// start new game
function newGame() {
  allowBook = 1;
  engine.setBoard(engine.START_FEN);
  engine.drawBoard();
  engine.updateBoard();
  document.getElementById('score').innerHTML = '0';
  document.getElementById('info').innerHTML = 'Press Ctrl-Shift-I to see how engine is calculating';
  repetitions = 0;
}

// take move back
function undo() {
  engine.takeBack();
  engine.drawBoard();
  engine.updateBoard();
}

// flip board
function flip() {
  engine.flipBoard();
  engine.drawBoard();
  engine.updateBoard();
}

// use opening book
function getBookMove() {
  if (allowBook == 0) return 0;

  let moves = engine.getMoves();
  let lines = [];
  
  if (moves.length == 0) {
    let randomLine = book[Math.floor(Math.random() * book.length)];
    let firstMove = randomLine.split(' ')[0];
    return engine.moveFromString(firstMove);
  } else if (moves.length) {
    for (let line = 0; line < book.length; line++) {
      let currentLine = moves.join(' ');

      if (book[line].includes(currentLine) && book[line].split(currentLine)[0] == '')
        lines.push(book[line]);
    }
  }
  
  if (lines.length) {
    let currentLine = moves.join(' ');
    let randomLine = lines[Math.floor(Math.random() * lines.length)];

    try {
      let bookMove = randomLine.split(currentLine)[1].split(' ')[1];
      return engine.moveFromString(bookMove);
    } catch(e) { return 0; }
  }

  return 0;
}

// engine move
function think() {
  engine.resetTimeControl();
  
  let moveTime = parseInt(document.getElementById('movetime').value);
  let timing = engine.getTimeControl();
  let startTime = new Date().getTime();
  
  timing.timeSet = 1;
  timing.time = moveTime * 1000;
  timing.stopTime = startTime + timing.time
  engine.setTimeControl(timing);

  let bookMoveFlag = 0;
  let delayMove = 0;
  let bestMove = getBookMove();
  
  if (bestMove) {
    bookMoveFlag = 1;
    delayMove = 1000;
  }
  
  if (bestMove) document.getElementById('score').innerHTML = 'book move'
  else if (bestMove == 0) bestMove = engine.search(64);
  
  let sourceSquare = engine.getMoveSource(bestMove);
  let targetSquare = engine.getMoveTarget(bestMove);
  let promotedPiece = engine.getMovePromoted(bestMove);

  if (engine.isRepetition()) repetitions++;
  if (repetitions == 3) {
    document.getElementById('info').innerHTML = 'Draw by 3 fold repetition';
    return;
  } else if (engine.getFifty() >= 100) {
    document.getElementById('info').innerHTML = 'Draw by 50 rule move';
    return;
  } else if (engine.isMaterialDraw()) {
    document.getElementById('info').innerHTML = 'Draw by insufficient material';
    return;
  } else if (engine.generateLegalMoves().length == 0 && engine.inCheck()) {
    document.getElementById('info').innerHTML = 'Checkmate';
    return;
  } else if (engine.generateLegalMoves().length == 0 && engine.inCheck() == 0) {
    document.getElementById('score').innerHTML = '0';
    document.getElementById('info').innerHTML = 'Stalemate';
    return;
  }

  setTimeout(function() {
    engine.movePiece(sourceSquare, targetSquare, promotedPiece);
    
    engine.drawBoard();
    engine.updateBoard();
 
    if (engine.getPiece(targetSquare)) {
      document.getElementById(targetSquare).style.backgroundColor = engine.SELECT_COLOR;             
      playSound(bestMove);
    }
  
  }, delayMove);
}

// play sound
function playSound(move) {
  if (engine.getMoveCapture(move)) captureSound.play();
  else moveSound.play();
}


