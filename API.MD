# Init engine
```js
const { Engine } = require('./wukong.js');  
const engine = new Engine();

# get square code
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
