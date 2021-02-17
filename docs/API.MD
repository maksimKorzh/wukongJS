 # Public API
 ```js
  var Engine = function() {
    // engine code here
  
    // public API
    return {
      // GUI constants
      SELECT_COLOR: SELECT_COLOR,
      
      // Engine constants
      VERSION: version,
      ELO: elo,
      START_FEN: startFen,
      
      COLOR: {
        WHITE: white,
        BLACK: black,
      },
      
      PIECE: {
        NO_PIECE: e,
        WHITE_PAWN: P,
        WHITE_KNIGHT: N,
        WHITE_BISHOP: B,
        WHITE_ROOK: R,
        WHITE_QUEEN: Q,
        WHITE_KING: K,
        BLACK_PAWN: p,
        BLACK_KNIGHT: n,
        BLACK_BISHOP: b,
        BLACK_ROOK: r,
        BLACK_QUEEN: q,
        BLACK_KING: k
      },
      
      SQUARE: {
        A8: a8, B8: b8, C8: c8, D8: d8, E8: e8, F8: f8, G8: g8, H8: h8,
        A7: a7, B7: b7, C7: c7, D7: d7, E7: e7, F7: f7, G7: g7, H7: h7,
        A6: a6, B6: b6, C6: c6, D6: d6, E6: e6, F6: f6, G6: g6, H6: h6,
        A5: a5, B5: b5, C5: c5, D5: d5, E5: e5, F5: f5, G5: g5, H5: h5,
        A4: a4, B4: b4, C4: c4, D4: d4, E4: e4, F4: f4, G4: g4, H4: h4,
        A3: a3, B3: b3, C3: c3, D3: d3, E3: e3, F3: f3, G3: g3, H3: h3,
        A2: a2, B2: b2, C2: c2, D2: d2, E2: e2, F2: f2, G2: g2, H2: h2,
        A1: a1, B1: b1, C1: c1, D1: d1, E1: e1, F1: f1, G1: g1, H1: h1,
      },
      
      // GUI methods
      drawBoard: function() { try { return drawBoard(); } catch(e) { guiError('.drawBoard()'); } },
      updateBoard: function() { try { return updateBoard(); } catch(e) { guiError('.updateBoard()'); } },
      movePiece: function(userSource, userTarget, promotedPiece) { try { movePiece(userSource, userTarget, promotedPiece); } catch(e) { guiError('.movePiece()'); } },
      flipBoard: function() { try { flipBoard(); } catch(e) { guiError('.flipBoard()'); } },

      // perft
      perft: function(depth) { perftTest(depth); },

      // board methods
      squareToString: function(square) { return coordinates[square]; },
      promotedToString: function(piece) { return promotedPieces[piece]; },
      printBoard: function() { printBoard(); },
      setBoard: function(fen) { setBoard(fen); },
      generateFen: function() { return generateFen(); },
      getPiece: function(square) { return board[square]; },
      getSide: function() { return side; },
      getFifty: function() { return fifty; },
      
      // move manipulation
      moveFromString: function(moveString) { return moveFromString(moveString); },
      moveToString: function(move) { return moveToString(move); },
      moveStack: function() { return moveStack; },
      loadMoves: function(moves) { loadMoves(moves); },
      getMoves: function() { return getMoves(); },
      pgn: function() { return getGamePgn(); },
      getMoveSource: function(move) { return getMoveSource(move); },
      getMoveTarget: function(move) { return getMoveTarget(move); },
      getMovePromoted: function(move) { return getMovePromoted(move); },
      getMoveCapture: function(move) { return getMoveCapture(move); },
      getMoveCastling: function(move) { return getMoveCastling(move); },
      generateLegalMoves: function() { return generateLegalMoves(); },
      printMoveList: function(moveList) { printMoveList(moveList); },
      
      // timing
      resetTimeControl: function() { resetTimeControl(); },
      setTimeControl: function(timeControl) { setTimeControl(timeControl); },
      getTimeControl: function() { return JSON.parse(JSON.stringify(timing))},
      search: function(depth) { return searchPosition(depth) },
      searchTime: function(ms) {
        resetTimeControl();
        let startTime = new Date().getTime();
        timing.timeSet = 1;
        timing.time = ms;
        timing.stopTime = startTime + timing.time;
        engine.search(64);
      },

      // misc
      isMaterialDraw: function() { return isMaterialDraw(); },
      takeBack: function() { if (moveStack.length) takeBack(); },
      isRepetition: function() { return isRepetition(); },
      inCheck: function(color) { return isSquareAttacked(kingSquare[color], color ^ 1); },
      isSquareAttacked: function(square, color) { return isSquareAttacked(square, color); },
      
      // uci
      setHashSize: function(Mb) { setHashSize(Mb); },

      // debugging (run any internal engine function)
      debug: function() { debug(); }
    }
  }
  
  // create engine instance (browser)
  var engine = new Engine();
  
  // create engine instance (nodejs)
  const { Engine } = require('./wukong.js');  
  const engine = new Engine();
  
  // call API function
  engine.printBoard();
  
 ```

# Init engine
```js
const { Engine } = require('./wukong.js');  
const engine = new Engine();
```

# Get square index
```js
let square = engine.SQUARE['E4'];
console.log('value:', square);
console.log('type:', typeof(square), '\n');

/*
    Output:

    value: 68
    type: number

*/
```


# Convert square to string
```js
let coord = engine.squareToString(68);
console.log('value:', coord);
console.log('type:', typeof(coord), '\n');

/*
    Output:

    value: e4
    type: string

*/
```

# Get piece code
```js
let piece = engine.PIECE['WHITE_KING'];
console.log('value:', piece);
console.log('type:', typeof(piece), '\n');

/*
    Output:

    value: 6
    type: number

*/
```


# Convert promoted piece to string
```js
let promotedPiece = engine.promotedToString(engine.PIECE['WHITE_QUEEN']);
console.log('value:', promotedPiece);
console.log('type:', typeof(promotedPiece), '\n');

/*
    Output:

    value: q
    type: string

*/
```

# Start new game
```js
engine.setBoard(engine.START_FEN)
engine.printBoard();

/*
    Output:

   8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ 
   7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟ 
   6 . . . . . . . . 
   5 . . . . . . . . 
   4 . . . . . . . . 
   3 . . . . . . . . 
   2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ 
   1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ 
     a b c d e f g h

     Side:     white
     Castling:  KQkq
     Ep:          no

     Key: -446909866
 50 rule:          0
   moves:          0

*/
```

# Set board position from FEN string
```js
engine.setBoard('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 10');
engine.printBoard();

/*
    Output:

   8 ♜ . . . ♚ . . ♜ 
   7 ♟ . ♟ ♟ ♛ ♟ ♝ . 
   6 ♝ ♞ . . ♟ ♞ ♟ . 
   5 . . . ♙ ♘ . . . 
   4 . ♟ . . ♙ . . . 
   3 . . ♘ . . ♕ . ♟ 
   2 ♙ ♙ ♙ ♗ ♗ ♙ ♙ ♙ 
   1 ♖ . . . ♔ . . ♖ 
     a b c d e f g h

     Side:     white
     Castling:  KQkq
     Ep:          no

     Key: 2073931705
 50 rule:          0
   moves:          10

*/
```

# Get piece at given board square
```js
let pieceAt = engine.getPiece(engine.SQUARE['E2']);
console.log('value:', pieceAt);
console.log('type:', typeof(pieceAt), '\n');

/*
    Output:

    value: 3
    type: number

*/
```

# Get current side to move
```js
let side = engine.getSide()
console.log('value:', side)
console.log('type:', typeof(side))

/*
    Output:

    value: 0
    type: number

*/
```

# Get current fifty rule move counter
```js
let fifty = engine.getSide()
console.log('value (plies):', fifty)
console.log('type:', typeof(fifty))

/*
    Output:

    value (plies): 0
    type: number

*/
```

# Validate pseudo legal move
```js
let validMove = engine.moveFromString('e2e4')

if (validMove) {
  console.log('value (pseudo legal):', validMove)
  console.log('type:', typeof(validMove))
} else {
  console.log('assumed to have pseudo legal move')
}
/*
    Output:

    value (pseudo legal): 533092
    type: number

*/
```

# Convert move to string (UCI format)
```js
let validMove = engine.moveFromString('e2e4')
if (validMove) {
  console.log('value (pseudo legal):', engine.moveToString(validMove))
  console.log('type:', typeof(engine.moveToString(validMove)))
} else {
  console.log('assumed to have pseudo legal move')
}

/*
    Output:

    value (pseudo legal): e2e4
    type: string

*/
```

# Load move sequence
```js
// move validation is done implicitly
engine.loadMoves('e2e4 e7e5 g1f3 b8c6');
engine.printBoard();

/*
    Output:

   8 ♜ . ♝ ♛ ♚ ♝ ♞ ♜ 
   7 ♟ ♟ ♟ ♟ . ♟ ♟ ♟ 
   6 . . ♞ . . . . . 
   5 . . . . ♟ . . . 
   4 . . . . ♙ . . . 
   3 . . . . . ♘ . . 
   2 ♙ ♙ ♙ ♙ . ♙ ♙ ♙ 
   1 ♖ ♘ ♗ ♕ ♔ ♗ . ♖ 
     a b c d e f g h

     Side:     white
     Castling:  KQkq
     Ep:          no

     Key: 532555169
 50 rule:          2
   moves:          2
*/
```

# extract move source/target/promoted/captured flag
```js
let move = engine.moveFromString('e2e4');
console.log(engine.getMoveSource(move), engine.squareToString(engine.getMoveSource(move)));
console.log(engine.getMoveTarget(move), engine.squareToString(engine.getMoveTarget(move)));
console.log(engine.getMovePromoted(move), engine.promotedToString(engine.getMovePromoted(move)));
console.log(engine.getMoveCaptured(move));

/*
    Output:
    
    100 'e2'
    68 'e4'
    0 undefined
    0

*/
```

# Generate legal moves
```js
// generate only legal moves
let moveList = engine.generateLegalMoves();

// "Score" in table is for move ordering
engine.printMoveList(moveList);

/*
    Output:
    
   Move     Capture  Double   Enpass   Castling  Score

   a2a3     0        0        0        0         0
   a2a4     0        1        0        0         0
   b2b3     0        0        0        0         0
   b2b4     0        1        0        0         0
   c2c3     0        0        0        0         0
   c2c4     0        1        0        0         0
   d2d3     0        0        0        0         0
   d2d4     0        1        0        0         0
   e2e3     0        0        0        0         0
   e2e4     0        1        0        0         0
   f2f3     0        0        0        0         0
   f2f4     0        1        0        0         0
   g2g3     0        0        0        0         0
   g2g4     0        1        0        0         0
   h2h3     0        0        0        0         0
   h2h4     0        1        0        0         0
   b1a3     0        0        0        0         0
   b1c3     0        0        0        0         0
   g1f3     0        0        0        0         0
   g1h3     0        0        0        0         0

   Total moves: 20

*/
```


# Time control manipulation and search
```js
// get current time control settings
let timing = engine.getTimeControl();
console.log(timing);

// enable time control
timing.timeSet = 1;

// search for 1 second
let startTime = new Date().getTime();
timing.time = 1000;
timing.stopTime = startTime + timing.time;

console.log(timing)
engine.setTimeControl(timing)

// set max depth when time control is enabled
engine.search(64);

// reset time control
engine.resetTimeControl();

// search for fixed depth
engine.search(6);

/*
    Output:
    
    { timeSet: 0, stopTime: 0, stopped: 0, time: -1 }
    { timeSet: 1,
      stopTime: 1608561876625,
      stopped: 0,
      time: 1000,
      startTime: 1608561875625 }
    info score cp 24 depth 1 nodes 40 time 4 pv b1c3 
    info score cp 0 depth 2 nodes 136 time 10 pv b1c3 b8c6 
    info score cp 29 depth 3 nodes 1131 time 48 pv d2d4 b8c6 c1f4 
    info score cp 0 depth 4 nodes 3583 time 155 pv d2d4 d7d5 c1f4 c8f5 
    info score cp 24 depth 5 nodes 34820 time 361 pv d2d4 d7d5 c1f4 c8f5 b1c3 
    bestmove d2d4
    info score cp 24 depth 1 nodes 40 time 1 pv b1c3 
    info score cp 0 depth 2 nodes 138 time 2 pv b1c3 g8f6 
    info score cp 29 depth 3 nodes 1143 time 6 pv d2d4 g8f6 c1f4 
    info score cp 0 depth 4 nodes 3341 time 34 pv d2d4 d7d5 c1f4 c8f5 
    info score cp 24 depth 5 nodes 33449 time 144 pv d2d4 d7d5 c1f4 c8f5 b1c3 
    info score cp 0 depth 6 nodes 183013 time 1315 pv d2d4 d7d5 c1f4 c8f5 b1c3 g8f6 
    bestmove d2d4
*/

// fixed time search (1 second)
engine.searchTime(1000);

/*
    Output:
    
    info score cp 10 depth 1 nodes 48 time 13 pv b1c3 
    info score cp -38 depth 2 nodes 502 time 47 pv b1c3 b8c6 
    info score cp 0 depth 3 nodes 1705 time 122 pv b1c3 b8c6 g1f3 
    info score cp -37 depth 4 nodes 2947 time 169 pv b1c3 b8c6 g1f3 g8f6 
    info score cp -9 depth 5 nodes 8114 time 216 pv b1c3 g8f6 e2e4 d7d5 d2d3 
    info score cp -35 depth 6 nodes 23965 time 399 pv b1c3 g8f6 e2e4 d7d5 e4d5 f6d5 c3d5 d8d5 
    info score cp -7 depth 7 nodes 46122 time 549 pv b1c3 g8f6 g1f3 b8c6 d2d4 d7d5 c1e3 
    info score cp -37 depth 8 nodes 120985 time 916 pv g1f3 b8c6 d2d4 d7d5 b1c3 g8f6 c1e3 c8e6 
    bestmove g1f3
*/
```

# Insufficient material
```js

// insufficient material (drawn position) flag
console.log('material draw:', engine.isMaterialDraw());

/*
    Output:
    
    material draw: 0
    
*/
```

# Repetition detections and take back
```js
// load moves sequence where same position occurres twice
engine.loadMoves('g1f3 b8c6 f3g1 c6b8 g1f3');
engine.printBoard();

// detect single repetition of the position
if (engine.isRepetition()) {
  console.log('repretition detected')
} else console.log('no repetitions detected');

// pop last move from move stack
engine.takeBack();
engine.takeBack();

// detect single repetition of the position
if (engine.isRepetition()) {
  console.log('repretition detected')
} else console.log('no repetitions detected');

/*
    Output:
    
   8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ 
   7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟ 
   6 . . . . . . . . 
   5 . . . . . . . . 
   4 . . . . . . . . 
   3 . . . . . ♘ . . 
   2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ 
   1 ♖ ♘ ♗ ♕ ♔ ♗ . ♖ 
     a b c d e f g h

     Side:     black
     Castling:  KQkq
     Ep:          no

     Key: -535964838
 50 rule:          5
   moves:          2

  repretition detected
  no repetitions detected

*/
```

# Check, checkmate & stalemate detection
```js
// load moves sequence
engine.loadMoves('f2f3 e7e5 g2g4 d8h4');
engine.printBoard();

if (engine.generateLegalMoves().length == 0) {
  if (engine.inCheck()) {
    console.log('in check:', engine.inCheck());
    console.log('checkmate');
  } else {
    console.log('in check:', engine.inCheck());
    console.log('stalemate');
  }
}
  
/*
    Output:
    
   8 ♜ ♞ ♝ . ♚ ♝ ♞ ♜ 
   7 ♟ ♟ ♟ ♟ . ♟ ♟ ♟ 
   6 . . . . . . . . 
   5 . . . . ♟ . . . 
   4 . . . . . . ♙ ♛ 
   3 . . . . . ♙ . . 
   2 ♙ ♙ ♙ ♙ ♙ . . ♙ 
   1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ 
     a b c d e f g h

     Side:     white
     Castling:  KQkq
     Ep:          no

     Key: 1007614217
 50 rule:          1
   moves:          2

  in check: 1
  checkmate

*/
```

# Set hash table size
```js
// set hash table size: min 4MB | max 128MB | default 16MB
engine.setHashSize(64)

/*
    Output:
    
    Set hash table size to 64 Mb
    Hash table initialized with 838860 entries
*/
```

# Debugging
If you've found a function within the engine object that doesn't have<br>
a public API reference you can either to add it on your own and make a PR<br>
or you can use debug() function - just type whatever function call you want<br>
within debug() function body and then run it via engine.debug()

# Ask for help
<a href="https://github.com/maksimKorzh/wukongJS/issues">Open issue</a>

# Feedbacks
<a href="mailto:freesoft.for.people@gmail.com">freesoft.for.people@gmail.com</a>
