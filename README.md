<p align="center">
  <img src="logo/LOGO.png">
</p>

<h1 align="center">Wukong JS</h1>
<h3 align="center" style="font-size: 18px;">Didactic javascript chess engine with UCI support, own GUI and public API</h3>
<p align="center">
  <a class="btn btn-primary" href="https://github.com/maksimKorzh/wukongJS/raw/main/releases/WukongJS_v1.1.zip">Download</a> |
  <a class="btn btn-success" href="https://maksimkorzh.github.io/wukongJS/wukong.html">Play now!</a>
</p>
<hr>

# Features
 - play full FIDE rules chess
 - load position from FEN string
 - self play
 - browser mode
 - UCI mode
 - public API 
 
# Play online vs Wukong JS
[![IMAGE ALT TEXT HERE](https://github.com/maksimKorzh/wukongJS/blob/main/logo/LOGO.png)](https://maksimkorzh.github.io/wukongJS/wukong.html)

# Play in UCI mode
1. download latest nodejs: https://nodejs.org/en/
2. download source code: https://github.com/maksimKorzh/wukongJS/raw/main/releases/WukongJS_v1.1.zip
3. UCI mode in console: "full/path/to/nodejs full/path/to/uci.js"
4. UCI mode in Arena GUI: set engine path to "full/path/to/nodejs" & command line parameters to "full/path/to/uci.js"

# Playing strength
It's VERY WEAK for now, around 1600 ELO<br>
I will ask Gabor Szots from CCRL to test it when strength around 2000 ELO would be reached<br>
I was focusing on interfaces and API implementation and  providing example code snippets<br>
rather than on playing strength for now, but from now on I'll be improving the strength<br>

# Technical specification
 - 0x88 board representation
 - 32-bit Zobrizt hashing
 - piece lists
 - on the fly attacks
 - incremental updates of position on make move/take back
 - move stack for storing board state variables
 - Simplified evaluation function <a href="https://www.chessprogramming.org/Simplified_Evaluation_Function">see details...</a>
 - insufficient material detection
 - 50 move rule detection
 - 3 fold repetition detection
 - stand pat quiescence
 - on the fly move sorting
 - MVV_LVA/killer/history/PV move ordering
 - Evaluation pruning
 - NMP (Null move pruning)
 - Razoring
 - Futility pruning
 - LMR (Late move reduction)
 - PVS (Principal variation search)
 
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

      perft: function(depth) { perftTest(depth); },

      // board methods
      squareToString: function(square) { return coordinates[square]; },
      promotedToString: function(piece) { return promotedPieces[piece]; },
      printBoard: function() { printBoard(); },
      setBoard: function(fen) { setBoard(fen); },
      getPiece: function(square) { return board[square]; },
      getSide: function() { return side; },
      getFifty: function() { return fifty; },

      // move manipulation
      moveFromString: function(moveString) { return isValid(moveString); },
      moveToString: function(move) { return moveToString(move); },
      loadMoves: function(moves) { loadMoves(moves); },
      getMoveSource: function(move) { return getMoveSource(move); },
      getMoveTarget: function(move) { return getMoveTarget(move); },
      getMovePromoted: function(move) { return getMovePromoted(move); },

      // timing
      resetTimeControl: function() { resetTimeControl(); },
      setTimeControl: function(timeControl) { setTimeControl(timeControl); },
      getTimeControl: function() { return JSON.parse(JSON.stringify(timing))},
      search: function(depth) { return searchPosition(depth) },
      
      // misc
      isMaterialDraw: function() { return isMaterialDraw(); },
      takeBack: function() { if (backup.length) takeBack(); },
      isRepetition: function() { return isRepetition(); },
      generateLegalMoves: function() { return generateLegalMoves(); },
      inCheck: function() { return isSquareAttacked(kingSquare[side], side ^ 1); },

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
 See available API usage examples <a href="https://github.com/maksimKorzh/wukongJS/blob/main/API.MD">here</a>
 
 # Contact me
<a href="mailto:freesoft.for.people@gmail.com">freesoft.for.people@gmail.com</a>
