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

# Clear piece at given board square
```js
engine.setPiece(engine.PIECE['NO_PIECE'], engine.SQUARE['E2']);
engine.printBoard();

/*
    Output:

   8 ♜ . . . ♚ . . ♜ 
   7 ♟ . ♟ ♟ ♛ ♟ ♝ . 
   6 ♝ ♞ . . ♟ ♞ ♟ . 
   5 . . . ♙ ♘ . . . 
   4 . ♟ . . ♙ . . . 
   3 . . ♘ . . ♕ . ♟ 
   2 ♙ ♙ ♙ ♗ . ♙ ♙ ♙ 
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


# Set piece at given board square
```js
engine.setPiece(engine.PIECE['WHITE_BISHOP'], engine.SQUARE['A6']);
engine.printBoard();

/*
    Output:

   8 ♜ . . . ♚ . . ♜ 
   7 ♟ . ♟ ♟ ♛ ♟ ♝ . 
   6 ♗ ♞ . . ♟ ♞ ♟ . 
   5 . . . ♙ ♘ . . . 
   4 . ♟ . . ♙ . . . 
   3 . . ♘ . . ♕ . ♟ 
   2 ♙ ♙ ♙ ♗ . ♙ ♙ ♙ 
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
let validMove = engine.isValid('e2e4')

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
let validMove = engine.isValid('e2e4')
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

# extract move source/target/promoted piece
```js
let move = engine.isValid('e2e4');
console.log(engine.getMoveSource(move), engine.squareToString(engine.getMoveSource(move)));
console.log(engine.getMoveTarget(move), engine.squareToString(engine.getMoveTarget(move)));
console.log(engine.getMovePromoted(move), engine.promotedToString(engine.getMovePromoted(move)));

/*
    Output:
    
    100 'e2'
    68 'e4'
    0 undefined

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
timing.startTime = new Date().getTime();
timing.time = 1000;
timing.stopTime = timing.startTime + timing.time;

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

# Debugging
If you've found a function within the engine object that doesn't have<br>
a public API reference you can either to add it on your own and make a PR<br>
or you can use debug() function - just type whatever function call you want<br>
within debug() function body and then run it via engine.debug()

# Open issue
<a href="https://github.com/maksimKorzh/wukongJS/issues">Ask for help</a>

# Feedbacks
<a href="mailto:freesoft.for.people@gmail.com">freesoft.for.people@gmail.com</a>
