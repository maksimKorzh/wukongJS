# Wukong JS
Javascript chess engine with UCI support, own GUI and public API<br>
so you can embed it into your own projects as a library<br>
for both front-end & back-end 

# Project goals
- easy to understand source code
- minimalist design
- reach maximal number of users
- online play in browser
- playing versus other engines via UCI
- reusable public API
- mimic agressive tactical playing style of Fritz (5-12)
- long term playground for relative strength improvement

# Play online vs Wukong JS
https://maksimkorzh.github.io/wukongJS/wukong.html

# Play in UCI mode
1. download latest nodejs: https://nodejs.org/en/
2. download source code: https://github.com/maksimKorzh/wukongJS/archive/main.zip
3. UCI mode in console: "full/path/to/nodejs full/path/to/wukong.js"
4. UCI mode in Arena GUI: set engine path to "full/path/to/nodejs" & command line parameters to "full/path/to/wukong.js"

# Features
 - 0x88 board representation
 - 32-bit Zobrizt hashing
 - piece lists
 - on the fly attacks
 - incremental updates of position on make move/take back
 - move stack for storing board state variables
 - Material & 100% original handcrafted PSTs to mimic style of Frtiz
 - opening/endgame PSTs for pawns, kings and rooks
 - insufficient material detection
 - 50 move rule penalty
 - stand pat quiescence
 - on the fly move sorting
 - MVV_LVA/killer/history move ordering
 
 # Public API
 I really doubt that I would provide a real documentation one day<br>
 for it takes all the fun away from the development process, but at<br>
 very least I'm going to provide quick "how to" examples on public API<br>
 and apart from code snippets I would probably make a video tutorial series<br>
 for now I'm just providing the list of available functions (see them in the source as well):<br>
 <br>
 ```js
 
 var Engine = function() {
 
   // engine code here
 
   return {
  
    /****************************\
     ============================
   
              PUBLIC API

     ============================              
    \****************************/
    
    // engine constants reference
    SELECT_COLOR: SELECT_COLOR,
    WHITE: white,
    BLACK: black,
    START_FEN: startFen,
    
    // GUI methods
    drawBoard: function() { return drawBoard(); },
    updateBoard: function() { return updateBoard(); },
    flipBoard: function() { flip ^= 1; },
    movePiece: function(userSource, userTarget, promotedPiece) { movePiece(userSource, userTarget, promotedPiece); },
    
    // board methods
    squareToString: function(square) { return coordinates[square]; },
    promotedToString: function(piece) { return promotedPieces[piece]; },
    printBoard: function() { printBoard(); },
    setBoard: function(fen) { setBoard(fen); },
    getPiece: function(square) { return board[square]; },
    setPiece: function(piece, square) { board[square] = piece; },
    getSide: function() { return side; },
    getFifty: function() { return fifty; },
    
    // move manipulation
    isValid: function(moveString) { return isValid(moveString); },
    loadMoves: function(moves) { loadMoves(moves); },
    getMoveSource: function(move) { return getMoveSource(move); },
    getMoveTarget: function(move) { return getMoveTarget(move); },
    getMovePromoted: function(move) { return getMovePromoted(move); },
    moveToString: function(move) { return moveToString(move); },
    getMoveStack: function() { return JSON.parse(JSON.stringify(backup)); },
    clearMoveStack: function() { backup = []; },
    
    // timing
    resetTimeControl: function() { resetTimeControl(); },
    setTimeControl: function(timeControl) { setTimeControl(timeControl); },
    getTimeControl: function() { return JSON.parse(JSON.stringify(timing))},
    
    // search
    takeBack: function() { if (backup.length) takeBack(); },
    perft: function(depth) { perftTest(depth); },
    search: function(depth) { return searchPosition(depth) },
    isRepetition: function() { return isRepetition(); },
    generateLegalMoves: function() { return generateLegalMoves(); },
    inCheck: function() { return isSquareAttacked(kingSquare[side], side ^ 1); },
    isMaterialDraw: function() { return isMaterialDraw(); },
    
    // debugging [run any internal engine function]
    debug: function() { debug(); }
  }
}
 ```
 Create engine instance:
 <br>
 ```js
 var engine = new Engine();
 engine.SetBoard(engine.START_FEN)
 engine.printBoard();
 engine.perft(4)
 ```
