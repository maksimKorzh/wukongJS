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

// user input controls
var clickLock = 0;
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
  
  if (engine.getPiece(square))
    document.getElementById(square).style.backgroundColor = engine.SELECT_COLOR;
  
  event.preventDefault();
  if (valid) setTimeout(function() { think() }, 1);
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
    
    if (engine.getPiece(square))
      document.getElementById(square).style.backgroundColor = engine.SELECT_COLOR;

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
  engine.setBoard(fen);
  engine.drawBoard();
  engine.updateBoard();
}

// start new game
function newGame() {
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

// engine move
function think() {
  engine.drawBoard();
  engine.updateBoard();
  engine.resetTimeControl();
  
  let moveTime = parseInt(document.getElementById('movetime').value);
  let timing = engine.getTimeControl();
  let startTime = new Date().getTime();
  
  timing.timeSet = 1;
  timing.time = moveTime * 1000;
  timing.stopTime = startTime + timing.time
  engine.setTimeControl(timing);

  let bestMove = engine.search(64);
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

  engine.movePiece(sourceSquare, targetSquare, promotedPiece);
  
  if (engine.getPiece(targetSquare))
    document.getElementById(targetSquare).style.backgroundColor = engine.SELECT_COLOR;               
}

// background image on/off
function switchBackground(button) {
  if (backgroundLock == 0) {
    document.body.style.backgroundImage = '';
    button.innerHTML = 'Image on';
    backgroundLock = 1;
  } else if (backgroundLock == 1) {
    document.body.style.backgroundImage = 'url(logo/wallpaper_wukong.jpg)';
    button.innerHTML = 'Image off';
    backgroundLock = 0;
  }
}
