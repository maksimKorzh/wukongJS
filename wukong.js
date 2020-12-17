/************************************************\
 ================================================
 
                      WUKONG
              javascript chess engine
           
                        by
                        
                 Code Monkey King
 
 ===============================================
\************************************************/

// chess engine version
const VERSION = '1.0';

// chess engine object
var Engine = function(boardSize, lightSquare, darkSquare, selectColor) {

  /****************************\
   ============================
   
         GLOBAL CONSTANTS

   ============================              
  \****************************/
  
  // sides to move  
  const white = 0;
  const black = 1;
  
  // piece encoding  
  const P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
  const p = 7, n = 8, b = 9, r = 10, q = 11, k = 12;
  
  // empty square & offboard square
  const e = 0, o = 13;
  
  // square encoding
  const a8 = 0,    b8 = 1,    c8 = 2,   d8 = 3,   e8 = 4,   f8 = 5,   g8 = 6,   h8 = 7;
  const a7 = 16,   b7 = 17,   c7 = 18,  d7 = 19,  e7 = 20,  f7 = 21,  g7 = 22,  h7 = 23;
  const a6 = 32,   b6 = 33,   c6 = 34,  d6 = 35,  e6 = 36,  f6 = 37,  g6 = 39,  h6 = 40;
  const a5 = 48,   b5 = 49,   c5 = 50,  d5 = 51,  e5 = 52,  f5 = 53,  g5 = 54,  h5 = 55;
  const a4 = 64,   b4 = 65,   c4 = 66,  d4 = 67,  e4 = 68,  f4 = 69,  g4 = 70,  h4 = 71;
  const a3 = 80,   b3 = 81,   c3 = 82,  d3 = 83,  e3 = 84,  f3 = 85,  g3 = 86,  h3 = 87;
  const a2 = 96,   b2 = 97,   c2 = 98,  d2 = 99,  e2 = 100, f2 = 101, g2 = 102, h2 = 103;
  const a1 = 112,  b1 = 113,  c1 = 114, d1 = 115, e1 = 116, f1 = 117, g1 = 118, h1 = 119;
  
  // offboard empassant square
  const noEnpassant = 120;
  
  // array to convert board square indices to coordinates
  const coordinates = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'i8', 'j8', 'k8', 'l8', 'm8', 'n8', 'o8', 'p8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'i7', 'j7', 'k7', 'l7', 'm7', 'n7', 'o7', 'p7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 'i6', 'j6', 'k6', 'l6', 'm6', 'n6', 'o6', 'p6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'i5', 'j5', 'k5', 'l5', 'm5', 'n5', 'o5', 'p5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 'i4', 'j4', 'k4', 'l4', 'm4', 'n4', 'o4', 'p4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'i3', 'j3', 'k3', 'l3', 'm3', 'n3', 'o3', 'p3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'i2', 'j2', 'k2', 'l2', 'm2', 'n2', 'o2', 'p2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'i1', 'j1', 'k1', 'l1', 'm1', 'n1', 'o1', 'p1'
  ];


  /****************************\
   ============================
   
         BOARD DEFINITIONS

   ============================              
  \****************************/
  
  // starting position
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ';
  
  // 0x88 chess board representation
  var board = [
      r, n, b, q, k, b, n, r,  o, o, o, o, o, o, o, o,
      p, p, p, p, p, p, p, p,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      P, P, P, P, P, P, P, P,  o, o, o, o, o, o, o, o,
      R, N, B, Q, K, B, N, R,  o, o, o, o, o, o, o, o
  ];
  
  // chess board state variables
  var side = white;
  var enpassant = noEnpassant;
  var castle = 15;
  var fifty = 0;
  var hashKey = 0;
  var kingSquare = [e1, e8];
  
  // piece list
  var pieceList = {
    // piece counts
    [P]: 0, [N]: 0, [B]: 0, [R]: 0, [Q]: 0, [K]: 0,
    [p]: 0, [n]: 0, [b]: 0, [r]: 0, [q]: 0, [k]: 0,
    
    // list of pieces with associated squares
    pieces: new Array(13 * 10)
  };
  
  // board state variables backup stack
  var backup = [];
  
  // plies
  var searchPly = 0;
  var gamePly = 0;
  

  /****************************\
   ============================
   
      RANDOM NUMBER GENERATOR

   ============================              
  \****************************/
  
  // fixed random seed
  var randomState = 1804289383;

  // generate 32-bit pseudo legal numbers
  function random() {
    var number = randomState;
    
    // 32-bit XOR shift
    number ^= number << 13;
    number ^= number >> 17;
    number ^= number << 5;
    randomState = number;

    return number;
  }


  /****************************\
   ============================
   
           ZOBRIST KEYS

   ============================              
  \****************************/ 
 
  // random keys
  var pieceKeys = new Array(13 * 128);
  var castleKeys = new Array(16);
  var sideKey;
  
  // init random hash keys
  function initRandomKeys() {
    for (var index = 0; index < 13 * 128; index++) pieceKeys[index] = random();
    for (var index = 0; index < 16; index++) castleKeys[index] = random();
    sideKey = random();
  }
  
  // generate hash key
  function generateHashKey() {
    var finalKey = 0;
    
    // hash board position
    for (var square = 0; square < 128; square++) {
      if ((square & 0x88) == 0)	{
        var piece = board[square];
        if (piece != e) finalKey ^= pieceKeys[(piece * 128) + square];
      }		
    }
    
    // hash board state variables
    if (side == white) finalKey ^= sideKey;
    if (enpassant != noEnpassant) finalKey ^= pieceKeys[enpassant];
    finalKey ^= castleKeys[castle];
    
    return finalKey;
  }


  /****************************\
   ============================
   
           BOARD METHODS

   ============================              
  \****************************/
  
  // board interface
  function getPiece(square) { return board[square]; }
  function setPiece(piece, square) { board[square] = piece; }
  
  // reset board
  function resetBoard() {
    // reset board position
    for (var rank = 0; rank < 8; rank++) {
      for (var file = 0; file < 16; file++) {
        var square = rank * 16 + file;
        if ((square & 0x88) == 0) board[square] = e;
      }
    }
    
    // reset board state variables
    side = -1;
    enpassant = noEnpassant;
    castle = 0;
    fifty = 0;
    hashKey = 0;
    kingSquare = [0, 0];
    backup = [];
    
    // reset plies
    searchPly = 0;
    gamePly = 0;
    
    // reset repetition table
    for (let index in repetitionTable) repetitionTable[index] = 0;
  }
  
  // init piece list
  function initPieceList() {
    // reset piece counts
    for (var piece = P; piece <= k; piece++)
      pieceList[piece] = 0;
    
    // reset piece list
    for (var index = 0; index < pieceList.pieces.length; index++)
      pieceList.pieces[index] = 0;
    
    // associate pieces with squares and count material
    for (var square = 0; square < 128; square++) {
      if ((square & 0x88) == 0) {
        var piece = board[square];
        
        if (piece) {
          pieceList.pieces[piece * 10 + pieceList[piece]] = square;
          pieceList[piece]++;
        }
      }
    }
  }
  
  // validate move
  function isValid(moveString) {
    let moveList = [];
    generateMoves(moveList);

    // parse move string
    var sourceSquare = (moveString[0].charCodeAt() - 'a'.charCodeAt()) +(8 - (moveString[1].charCodeAt() - '0'.charCodeAt())) * 16;
    var targetSquare = (moveString[2].charCodeAt() - 'a'.charCodeAt()) + (8 - (moveString[3].charCodeAt() - '0'.charCodeAt())) * 16;

    // validate
    for(var count = 0; count < moveList.length; count++) {
      var move = moveList[count].move;
      var promotedPiece = 0;

      if(getMoveSource(move) == sourceSquare && getMoveTarget(move) == targetSquare) {
        promotedPiece = getMovePromoted(move);

        if(promotedPiece) {
          if((promotedPiece == N || promotedPiece == n) && moveString[4] == 'n') return move;
          else if((promotedPiece == B || promotedPiece == b) && moveString[4] == 'b') return move;
          else if((promotedPiece == R || promotedPiece == r) && moveString[4] == 'r') return move;
          else if((promotedPiece == Q || promotedPiece == q) && moveString[4] == 'q') return move;
          continue;
        }

        // legal move
        return move;
      }
    }

    // illegal move
    return 0;
  }

  
  /****************************\
   ============================
   
             ATTACKS

   ============================              
  \****************************/

  // square attacked
  function isSquareAttacked(square, side) {
    // by pawns
    for (let index = 0; index < 2; index++) {
      let targetSquare = square + pawnDirections.offsets[side][index] 
      if (((targetSquare) & 0x88) == 0 &&
           (board[targetSquare] == pawnDirections.pawn[side])) return 1;
    }
    
    // by leaper pieces
    for (let piece in leaperPieces) {      
      for (let index = 0; index < 8; index++) {
        let targetSquare = square + leaperPieces[piece].offsets[index];
        let targetPiece = board[targetSquare];
        if ((targetSquare & 0x88) == 0)
          if (targetPiece == leaperPieces[piece].side[side]) return 1;
      }
    }
    
    // by slider pieces
    for (let piece in sliderPieces) {
      for (let index = 0; index < 4; index++) {
        let targetSquare = square + sliderPieces[piece].offsets[index];
        while ((targetSquare & 0x88) == 0) {
          var targetPiece = board[targetSquare];
          if (sliderPieces[piece].side[side].includes(targetPiece)) return 1;
          if (targetPiece) break;
          targetSquare += sliderPieces[piece].offsets[index];
        }
      }
    }

    return 0;
  }


  /****************************\
   ============================
   
          MOVE ENCODING
 
   ============================              
  \****************************/
  
  // encode move
  function encodeMove(source, target, piece, capture, pawn, enpassant, castling) {
    return (source) |
           (target << 7) |
           (piece << 14) |
           (capture << 18) |
           (pawn << 19) |
           (enpassant << 20) |
           (castling << 21)
  }

  // decode move
  function getMoveSource(move) { return move & 0x7f }
  function getMoveTarget(move) { return (move >> 7) & 0x7f }
  function getMovePromoted(move) { return (move >> 14) & 0xf }
  function getMoveCapture(move) { return (move >> 18) & 0x1 }
  function getMovePawn(move) { return (move >> 19) & 0x1 }
  function getMoveEnpassant(move) { return (move >> 20) & 0x1 }
  function getMoveCastling(move) { return (move >> 21) & 0x1 }
  
  
  /****************************\
   ============================
   
          MOVE GENERATOR
 
   ============================              
  \****************************/
  
  // piece move offsets
  var knightOffsets = [33, 31, 18, 14, -33, -31, -18, -14];
  var bishopOffsets = [15, 17, -15, -17];
  var rookOffsets = [16, -16, 1, -1];
  var kingOffsets = [16, -16, 1, -1, 15, 17, -15, -17];
  
  // pawn directions to side mapping
  var pawnDirections = {
    offsets: [[17, 15], [-17, -15]],
    pawn: [P, p]
  }
  
  // leaper piece to offset mapping
  var leaperPieces = {
    knight: { offsets: knightOffsets, side: [N, n] },
    king: { offsets: kingOffsets, side: [K, k] }
  };
  
  // slider piece to offset mapping
  var sliderPieces = {
    bishop: { offsets: bishopOffsets, side: [[B, Q], [b, q]] },
    rook: { offsets: rookOffsets, side: [[R, Q], [r, q]] }
  };
  
  // pawn & castling mappings
  var specialMoves = {
    side: [
      {
        offset: [-17, -15],
        pawn: P,
        target: -16,
        doubleTarget: -32,
        capture: [7, 12],
        rank7: [a7, h7],
        rank2: [a2, h2],
        promoted: [Q, R, B, N],
        king: K,
        castling: [1, 2],
        empty: [f1, g1, d1, b1, c1],
        attacked: [e1, f1, d1],
        by: [black, white],
        castle: [e1, g1, c1]
      },
      {
        offset: [17, 15],
        pawn: p,
        target: 16,
        doubleTarget: 32,
        capture: [1, 6],
        rank7: [a2, h2],
        rank2: [a7, h7],
        promoted: [q, r, b, n],
        king: k,
        castling: [4, 8],
        empty: [f8, g8, d8, b8, c8],
        attacked: [e8, f8, d8],
        by: [black, white],
        castle: [e8, g8, c8]
      }
    ]
  }
  
  // castling rights
  var castlingRights = [
     7, 15, 15, 15,  3, 15, 15, 11,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    13, 15, 15, 15, 12, 15, 15, 14,  o, o, o, o, o, o, o, o
  ];

  // populate move list
  function addMove(moveList, move) {
    let moveScore = 0;
    
    if (getMoveCapture(move)) {
      moveScore = mvvLva[board[getMoveSource(move)] * 13 + board[getMoveTarget(move)]];
      moveScore += 10000;
    } else {
      if (killerMoves[searchPly] == move) moveScore = 9000;
      else if (killerMoves[maxPly + searchPly] == move) moveScore = 8000;
      else moveScore = historyMoves[board[getMoveSource(move)] * 128 + getMoveTarget(move)];
    }
    
    moveList.push({
      move: move,
      score: moveScore
    });
  }

  // generate moves
  function generateMoves(moveList) {
    for (let piece = P; piece <= k; piece++) {
      for (let pieceIndex = 0; pieceIndex < pieceList[piece]; pieceIndex++) {
        let sourceSquare = pieceList.pieces[piece * 10 + pieceIndex];
        
        // pawns
        if (board[sourceSquare] == specialMoves.side[side].pawn) {
          let targetSquare = sourceSquare + specialMoves.side[side].target;
          
          // quiet moves
          if ((targetSquare & 0x88) == 0 && board[targetSquare] == e) {   
            if (sourceSquare >= specialMoves.side[side].rank7[0] &&
                sourceSquare <= specialMoves.side[side].rank7[1]) {
              for (let promotedIndex = 0; promotedIndex < 4; promotedIndex++) {
                let promotedPiece = specialMoves.side[side].promoted[promotedIndex];
                addMove(moveList, encodeMove(sourceSquare, targetSquare, promotedPiece, 0, 0, 0, 0));
              }
            } else {
              addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
              let doubleTarget = sourceSquare + specialMoves.side[side].doubleTarget;
              
              if ((sourceSquare >= specialMoves.side[side].rank2[0] &&
                   sourceSquare <= specialMoves.side[side].rank2[1]) &&
                   board[doubleTarget] == e)
                addMove(moveList, encodeMove(sourceSquare, doubleTarget, 0, 0, 1, 0, 0));
            }
          }
          
          // captures
          for (let index = 0; index < 2; index++) {
            let pawn_offset = specialMoves.side[side].offset[index];
            let targetSquare = sourceSquare + pawn_offset;
            
            if ((targetSquare & 0x88) == 0) {
              if ((sourceSquare >= specialMoves.side[side].rank7[0] &&
                   sourceSquare <= specialMoves.side[side].rank7[1]) &&
                  (board[targetSquare] >= specialMoves.side[side].capture[0] &&
                   board[targetSquare] <= specialMoves.side[side].capture[1])
                 ) {
                for (let promotedIndex = 0; promotedIndex < 4; promotedIndex++) {
                  let promotedPiece = specialMoves.side[side].promoted[promotedIndex];
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, promotedPiece, 1, 0, 0, 0));
                }
              } else {
                if (board[targetSquare] >= specialMoves.side[side].capture[0] &&
                    board[targetSquare] <= specialMoves.side[side].capture[1])
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                if (targetSquare == enpassant)
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 1, 0));
              }
            }
          }
        }

        // castling
        else if (board[sourceSquare] == specialMoves.side[side].king) {
          // king side
          if (castle & specialMoves.side[side].castling[0]) {
            if (board[specialMoves.side[side].empty[0]] == e &&
                board[specialMoves.side[side].empty[1]] == e) {
              if (isSquareAttacked(specialMoves.side[side].attacked[1], specialMoves.side[side].by[side]) == 0 &&
                  isSquareAttacked(specialMoves.side[side].attacked[0], specialMoves.side[side].by[side]) == 0)
                  addMove(moveList, encodeMove(specialMoves.side[side].castle[0], specialMoves.side[side].castle[1], 0, 0, 0, 0, 1));
            }
          }
          
          // queen side
          if (castle & specialMoves.side[side].castling[1]) {
            if (board[specialMoves.side[side].empty[2]] == e &&
                board[specialMoves.side[side].empty[3]] == e &&
                board[specialMoves.side[side].empty[4]] == e) {
              if (isSquareAttacked(specialMoves.side[side].attacked[2], specialMoves.side[side].by[side]) == 0 &&
                  isSquareAttacked(specialMoves.side[side].attacked[0], specialMoves.side[side].by[side]) == 0)
                  addMove(moveList, encodeMove(specialMoves.side[side].castle[0], specialMoves.side[side].castle[2], 0, 0, 0, 0, 1));
            }
          }
        }
        
        // leaper pieces
        for (let piece in leaperPieces) {
          if (board[sourceSquare] == leaperPieces[piece].side[side]) {
            for (let index = 0; index < 8; index++) {
              let targetSquare = sourceSquare + leaperPieces[piece].offsets[index];
              let capturedPiece = board[targetSquare];
              
              if ((targetSquare & 0x88) == 0) {
                if ((side == white) ? 
                    (capturedPiece == e || (capturedPiece >= 7 && capturedPiece <= 12)) : 
                    (capturedPiece == e || (capturedPiece >= 1 && capturedPiece <= 6))
                   ) {
                  if (capturedPiece) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                  else addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
                }
              }
            }
          }
        }
        
        // slider pieces
        for (let piece in sliderPieces) {
          if (board[sourceSquare] == sliderPieces[piece].side[side][0] ||
              board[sourceSquare] == sliderPieces[piece].side[side][1]) {
            for (var index = 0; index < 4; index++) {
              let targetSquare = sourceSquare + sliderPieces[piece].offsets[index];
              while (!(targetSquare & 0x88)) {
                var capturedPiece = board[targetSquare];
                
                if ((side == white) ? (capturedPiece >= 1 && capturedPiece <= 6) : ((capturedPiece >= 7 && capturedPiece <= 12))) break;
                if ((side == white) ? (capturedPiece >= 7 && capturedPiece <= 12) : ((capturedPiece >= 1 && capturedPiece <= 6))) {
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                  break;
                }
                
                if (capturedPiece == e) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
                targetSquare += sliderPieces[piece].offsets[index];
              }
            }
          }
        }
      }
    }
  }
  
  // generate captures
  function generateCaptures(moveList) {
    for (let piece = P; piece <= k; piece++) {
      for (let pieceIndex = 0; pieceIndex < pieceList[piece]; pieceIndex++) {
        let sourceSquare = pieceList.pieces[piece * 10 + pieceIndex];
        
        // pawns
        if (board[sourceSquare] == specialMoves.side[side].pawn) {
          let targetSquare = sourceSquare + specialMoves.side[side].target;
          for (let index = 0; index < 2; index++) {
            let pawn_offset = specialMoves.side[side].offset[index];
            let targetSquare = sourceSquare + pawn_offset;
            
            if ((targetSquare & 0x88) == 0) {
              if ((sourceSquare >= specialMoves.side[side].rank7[0] &&
                   sourceSquare <= specialMoves.side[side].rank7[1]) &&
                  (board[targetSquare] >= specialMoves.side[side].capture[0] &&
                   board[targetSquare] <= specialMoves.side[side].capture[1])
                 ) {
                for (let promotedIndex = 0; promotedIndex < 4; promotedIndex++) {
                  let promotedPiece = specialMoves.side[side].promoted[promotedIndex];
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, promotedPiece, 1, 0, 0, 0));
                }
              } else {
                if (board[targetSquare] >= specialMoves.side[side].capture[0] &&
                    board[targetSquare] <= specialMoves.side[side].capture[1])
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                if (targetSquare == enpassant)
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 1, 0));
              }
            }
          }
        }
        
        // leaper pieces
        for (let piece in leaperPieces) {
          if (board[sourceSquare] == leaperPieces[piece].side[side]) {
            for (let index = 0; index < 8; index++) {
              let targetSquare = sourceSquare + leaperPieces[piece].offsets[index];
              let capturedPiece = board[targetSquare];
              
              if ((targetSquare & 0x88) == 0) {
                if ((side == white) ? 
                    (capturedPiece == e || (capturedPiece >= 7 && capturedPiece <= 12)) : 
                    (capturedPiece == e || (capturedPiece >= 1 && capturedPiece <= 6))
                   ) {
                  if (capturedPiece) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                }
              }
            }
          }
        }
        
        // slider pieces
        for (let piece in sliderPieces) {
          if (board[sourceSquare] == sliderPieces[piece].side[side][0] ||
              board[sourceSquare] == sliderPieces[piece].side[side][1]) {
            for (var index = 0; index < 4; index++) {
              let targetSquare = sourceSquare + sliderPieces[piece].offsets[index];
              while (!(targetSquare & 0x88)) {
                var capturedPiece = board[targetSquare];
                
                if ((side == white) ? (capturedPiece >= 1 && capturedPiece <= 6) : ((capturedPiece >= 7 && capturedPiece <= 12))) break;
                if ((side == white) ? (capturedPiece >= 7 && capturedPiece <= 12) : ((capturedPiece >= 1 && capturedPiece <= 6))) {
                  addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                  break;
                }

                targetSquare += sliderPieces[piece].offsets[index];
              }
            }
          }
        }
      }
    }
  }

  // move piece on board
  function moveCurrentPiece(piece, sourceSquare, targetSquare) {
    board[targetSquare] = board[sourceSquare];
    board[sourceSquare] = e;
    hashKey ^= pieceKeys[piece * 128 + sourceSquare];
    hashKey ^= pieceKeys[piece * 128 + targetSquare];
    
    for (let pieceIndex = 0; pieceIndex < pieceList[piece]; pieceIndex++) {
      if (pieceList.pieces[piece * 10 + pieceIndex] == sourceSquare) {
        pieceList.pieces[piece * 10 + pieceIndex] = targetSquare;
        break;
      }
    }
  }
  
  // remove piece from board
  function removePiece(piece, square) {
    for (let pieceIndex = 0; pieceIndex < pieceList[piece]; pieceIndex++) {
      if (pieceList.pieces[piece * 10 + pieceIndex] == square) {
        var capturedIndex = pieceIndex;
        break;
      }
    }
    
    pieceList[piece]--;
    pieceList.pieces[piece * 10 + capturedIndex] = pieceList.pieces[piece * 10 + pieceList[piece]];    
  }
  
  // add piece to board
  function addPiece(piece, square) {
    board[square] = piece;
    hashKey ^= pieceKeys[piece * 128 + square];
    pieceList.pieces[piece * 10 + pieceList[piece]] = square;    
    pieceList[piece]++;
  }

  // make move
  function makeMove(move) {
    // update plies
    searchPly++;
    gamePly++;
    
    // update repetition table
    repetitionTable[gamePly] = hashKey;
    
    // parse move
    let sourceSquare = getMoveSource(move);
    let targetSquare = getMoveTarget(move);
    let promotedPiece = getMovePromoted(move);
    let capturedPiece = board[targetSquare];
    
    // backup board state variables
    backup.push({
      move: move,
      capturedPiece: 0,
      side: side,
      enpassant: enpassant,
      castle: castle,
      fifty: fifty,
      hash: hashKey,
    });
    
    // move piece
    moveCurrentPiece(board[sourceSquare], sourceSquare, targetSquare);
    
    // update 50 move rule
    fifty++;

    // handle capture
    if (getMoveCapture(move)) {
      if (capturedPiece) {
        backup[backup.length - 1].capturedPiece = capturedPiece;
        hashKey ^= pieceKeys[capturedPiece * 128 + targetSquare];
        removePiece(capturedPiece, targetSquare); 
      }
      fifty = 0;
    } else if (board[targetSquare] == P || board[targetSquare] == p)
      fifty = 0;
    
    // update enpassant square
    if (enpassant != noEnpassant) hashKey ^= pieceKeys[enpassant];
    enpassant = noEnpassant;
    
    // handle special moves
    if (getMovePawn(move)) {
      if (side == white) {
        enpassant = targetSquare + 16;
        hashKey ^= pieceKeys[targetSquare + 16];
      } else {
        enpassant = targetSquare - 16;
        hashKey ^= pieceKeys[targetSquare - 16];
      }
    } else if (getMoveEnpassant(move)) {
      if (side == white) {
        board[targetSquare + 16] = e;
        hashKey ^= pieceKeys[p * 128 + targetSquare + 16];
        removePiece(p, targetSquare + 16);
      } else {
        board[targetSquare - 16] = e;
        hashKey ^= pieceKeys[(P * 128) + (targetSquare - 16)];
        removePiece(P, targetSquare - 16);
      }
    } else if (getMoveCastling(move)) {
      switch(targetSquare) {
        case g1: moveCurrentPiece(R, h1, f1); break;
        case c1: moveCurrentPiece(R, a1, d1); break;
        case g8: moveCurrentPiece(r, h8, f8); break;
        case c8: moveCurrentPiece(r, a8, d8); break;
      }
    }
    
    // handle promotions
    if (promotedPiece) {
      if (side == white) {
        hashKey ^= pieceKeys[P * 128 + targetSquare];
        removePiece(P, targetSquare);
      } else {
        hashKey ^= pieceKeys[p * 128 + targetSquare];
        removePiece(p, targetSquare);
      }

      addPiece(promotedPiece, targetSquare);      
    }
    
    // update king square
    if (board[targetSquare] == K || board[targetSquare] == k) kingSquare[side] = targetSquare;
    
    // update castling rights
    hashKey ^= castleKeys[castle];
    castle &= castlingRights[sourceSquare];
    castle &= castlingRights[targetSquare];
    hashKey ^= castleKeys[castle];
    
    // switch side to move
    side ^= 1;
    hashKey ^= sideKey;
    
    // return illegal move if king is left in check 
    if (isSquareAttacked((side == white) ? kingSquare[side ^ 1] : kingSquare[side ^ 1], side)) {
      takeBack();
      return 0;
    } else return 1;
  }
  
  // take move back
  function takeBack() {
    // update plies
    searchPly--;
    gamePly--;
    
    // parse move
    let moveIndex = backup.length - 1;
    let move = backup[moveIndex].move;    
    let sourceSquare = getMoveSource(move);
    let targetSquare = getMoveTarget(move);
    
    // move piece
    moveCurrentPiece(board[targetSquare], targetSquare, sourceSquare);
    
    // restore captured piece
    if (getMoveCapture(move)) {
      //board[targetSquare] = backup[moveIndex].capturedPiece;
      addPiece(backup[moveIndex].capturedPiece, targetSquare);
    }
    
    // handle special moves
    if (getMoveEnpassant(move)) {
      if (side == white) addPiece(P, targetSquare - 16);
      else addPiece(p, targetSquare + 16);
    } else if (getMoveCastling(move)) {
      switch(targetSquare) {
        case g1: moveCurrentPiece(R, f1, h1); break;
        case c1: moveCurrentPiece(R, d1, a1); break;
        case g8: moveCurrentPiece(r, f8, h8); break;
        case c8: moveCurrentPiece(r, d8, a8); break;
      }
    } else if (getMovePromoted(move)) {
      (side == white) ? addPiece(p, sourceSquare): addPiece(P, sourceSquare);
      removePiece(getMovePromoted(move), sourceSquare);
    }

    // update king square
    if (board[sourceSquare] == K || board[sourceSquare] == k) kingSquare[side ^ 1] = sourceSquare;
    
    // switch side to move
    side = backup[moveIndex].side;
    
    // restore board state variables
    enpassant = backup[moveIndex].enpassant;
    castle = backup[moveIndex].castle;
    hashKey = backup[moveIndex].hash;
    fifty = backup[moveIndex].fifty;

    backup.pop();
  }
  
  
  /****************************\
   ============================
   
              PERFT

   ============================              
  \****************************/

  // visited nodes count
  var nodes = 0;
  
  // perft driver
  function perftDriver(depth) {
    if  (depth == 0) { nodes++; return; }
    
    let moveList = [];
    generateMoves(moveList);
    
    for (var count = 0; count < moveList.length; count++) {      
      if (!makeMove(moveList[count].move)) continue;
      perftDriver(depth - 1);
      takeBack();
    }
  }

  // perft test
  function perftTest(depth) {
    console.log('   Performance test:\n');
    resultString = '';
    let startTime = new Date().getTime();
    
    let moveList = [];
    generateMoves(moveList);
    
    for (var count = 0; count < moveList.length; count++) {      
      if (!makeMove(moveList[count].move)) continue;
      let cumNodes = nodes;
      perftDriver(depth - 1);
      takeBack();
      let oldNodes = nodes - cumNodes;
      console.log(  '   move' +
                    ' ' + (count + 1) + ((count < 9) ? ':  ': ': ') +
                    coordinates[getMoveSource(moveList[count].move)] +
                    coordinates[getMoveTarget(moveList[count].move)] +
                    (getMovePromoted(moveList[count].move) ?
                    promotedPieces[getMovePromoted(moveList[count].move)]: ' ') +
                    '    nodes: ' + oldNodes);
    }
    
    resultString += '\n   Depth: ' + depth;
    resultString += '\n   Nodes: ' + nodes;
    resultString += '\n    Time: ' + (new Date().getTime() - startTime) + ' ms\n';
    console.log(resultString);
  }


  /****************************\
   ============================
   
            EVALUATION

   ============================              
  \****************************/
  
  const materialWeights = [0, 100, 300, 350, 500, 900, 1000, -100, -300, -350, -500, -900, -1000];
  
  const pst = [
    0,  0,  5,  5,  0,  0,  5,  0,  o, o, o, o, o, o, o, o, 
    5,  5,  0,  0,  0,  0,  5,  5,  o, o, o, o, o, o, o, o,
    5, 10, 15, 20, 20, 15, 10,  5,  o, o, o, o, o, o, o, o,
    5, 10, 20, 30, 30, 20, 10,  5,  o, o, o, o, o, o, o, o,
    5, 10, 20, 30, 30, 20, 10,  5,  o, o, o, o, o, o, o, o,
    5, 10, 15, 20, 20, 15, 10,  5,  o, o, o, o, o, o, o, o,
    5,  5,  0,  0,  0,  0,  5,  5,  o, o, o, o, o, o, o, o,
    0,  0,  5,  5,  0,  0,  5,  0,  o, o, o, o, o, o, o, o
  ];
  
  const mirrorSquare = [
    a1, b1, c1, d1, e1, f1, g1, h1,    o, o, o, o, o, o, o, o,
	  a2, b2, c2, d2, e2, f2, g2, h2,    o, o, o, o, o, o, o, o,
	  a3, b3, c3, d3, e3, f3, g3, h3,    o, o, o, o, o, o, o, o,
	  a4, b4, c4, d4, e4, f4, g4, h4,    o, o, o, o, o, o, o, o,
	  a5, b5, c5, d5, e5, f5, g5, h5,    o, o, o, o, o, o, o, o,
	  a6, b6, c6, d6, e6, f6, g6, h6,    o, o, o, o, o, o, o, o,
	  a7, b7, c7, d7, e7, f7, g7, h7,    o, o, o, o, o, o, o, o,
	  a8, b8, c8, d8, e8, f8, g8, h8,    o, o, o, o, o, o, o, o
  ]
  
  function evaluate() {
    let score = 0;
    
    for (let piece = P; piece <= k; piece++) {
      for (pieceIndex = 0; pieceIndex < pieceList[piece]; pieceIndex++) {
        let square = pieceList.pieces[piece * 10 + pieceIndex];

        // evaluate material
        score += materialWeights[piece];
        (piece >= 1 && piece <= 6) ? score += pst[square]: score -= pst[mirrorSquare[square]];
      }
    }
    
    return (side == white) ? score: -score;
  }


  /****************************\
   ============================
   
              SEARCH

   ============================              
  \****************************/
  
  const mvvLva = [
	  0,   0,   0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0,
	  0, 105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
	  0, 104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
	  0, 103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
	  0, 102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
	  0, 101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
	  0, 100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600,

	  0, 105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
	  0, 104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
	  0, 103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
	  0, 102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
	  0, 101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
	  0, 100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600
  ];
  
  // search  constants
  const maxPly = 64;
  const infinity = 50000;
  const mateValue = 49000;
  const mateScore = 48000;
  
  // PV table
  var pvTable = new Array(maxPly * maxPly);
  var pvLength = new Array(maxPly);
  
  // killer moves
  var killerMoves = new Array(2 * maxPly);

  // history moves
  var historyMoves = new Array(13 * 128);
  
  // repetition table
  var repetitionTable = new Array(1000);

  // time control handling  
  var timing = {
    timeSet: 0,
    stopTime: 0,
    stopped: 0,
    time: -1
  }
  
  // set time control
  function setTimeControl(timeControl) { timing = timeControl; }
  
  // reset time control
  function resetTimeControl() {
    timing = {
      timeSet: 0,
      stopTime: 0,
      stopped: 0,
      time: -1
    }
  }
  
  function clearSearch() {
    // reset nodes counter
    nodes = 0;
    timing.stopped = 0;
    
    for (let index = 0; index < pvTable.length; index++) pvTable[index] = 0;
    for (let index = 0; index < pvLength.length; index++) pvLength[index] = 0;
    for (let index = 0; index < killerMoves.length; index++) killerMoves[index] = 0;
    for (let index = 0; index < historyMoves.length; index++) historyMoves[index] = 0;
  }
  
  // handle time control
  function checkTime() {
    if(timing.timeSet == 1 && new Date().getTime() > timing.stopTime) timing.stopped = 1;
  }

  // position repetition detection
  function isRepetition() {
    for (let index = 0; index < gamePly; index++)
      if (repetitionTable[index] == hashKey) return 1;

    return 0;
  }
  
  // move ordering
  function sortMove(currentCount, moveList) {
    for (let nextCount = currentCount + 1; nextCount < moveList.length; nextCount++) {
      if (moveList[currentCount].score < moveList[nextCount].score) {
        let tempMove = moveList[currentCount];

        moveList[currentCount] = moveList[nextCount];
        moveList[nextCount] = tempMove;
      }
    }
  }
  
  // quiescence search
  function quiescence(alpha, beta) {
    nodes++;
    
    if((nodes & 2047 ) == 0) checkTime();
    if (searchPly > maxPly - 1) return evaluate();

    var evaluation = evaluate();
    
    if (evaluation >= beta) return beta;
    if (evaluation > alpha) alpha = evaluation;
    
    var moveList = [];
    generateCaptures(moveList);

    for (var count = 0; count < moveList.length; count++) { 
      sortMove(count, moveList)
      let move = moveList[count].move;
      
      if (makeMove(move) == 0) continue;
      var score = -quiescence(-beta, -alpha);
      takeBack();
      
      if (timing.stopped == 1) return 0;
      if (score > alpha) {
        alpha = score;
        if (score >= beta) return beta;
      }
    }

    return alpha;
  }
  
  // negamax search
  function negamax(alpha, beta, depth) {
    pvLength[searchPly] = searchPly;
    
    let score = 0;

    if ((searchPly && isRepetition()) || fifty >= 100) return 0;
    if ((nodes & 2047 ) == 0) checkTime();
    if (depth == 0) { nodes++; return quiescence(alpha, beta); }
    
    let legalMoves = 0;
    let inCheck = isSquareAttacked(kingSquare[side], side ^ 1);
    if (inCheck) depth++;

    let moveList = [];
    generateMoves(moveList);
    
    for (let count = 0; count < moveList.length; count++) {
      sortMove(count, moveList);
      let move = moveList[count].move;
      if (makeMove(move) == 0) continue;
      legalMoves++;
      score = -negamax(-beta, -alpha, depth - 1);
      takeBack();
      
      if (timing.stopped == 1) return 0;
      if (score > alpha) {
        alpha = score;
        
        // store history moves
        if (getMoveCapture(move) == 0)
          historyMoves[board[getMoveSource(move)] * 128 + getMoveTarget(move)] += depth;
        
        // store PV move
        pvTable[searchPly * 64 + searchPly] = move;
        for (var nextPly = searchPly + 1; nextPly < pvLength[searchPly + 1]; nextPly++)
          pvTable[searchPly * 64 + nextPly] = pvTable[(searchPly + 1) * 64 + nextPly];
        pvLength[searchPly] = pvLength[searchPly + 1]
        
        if (score >= beta) {
          // store killer moves
          if (getMoveCapture(move) == 0) {
            killerMoves[maxPly + searchPly] = killerMoves[searchPly];
            killerMoves[searchPly] = move;
          }
          
          return beta;
        }
      }
    }
    
    // checkmate or stalemate
    if (legalMoves == 0) {
      if (inCheck) return -mateValue + searchPly;
      else return 0;
    }

    return alpha;
  }
  
  // search position for the best move
  function searchPosition(depth) {
    let start = new Date().getTime();
    let score = 0;
    let lastBestMove = 0;
    
    clearSearch();

    // iterative deepening
    for (let current_depth = 1; current_depth <= depth; current_depth++) {
      lastBestMove = pvTable[0];
      score = negamax(-infinity, infinity, current_depth);
      if (timing.stopped == 1) break;
      
      let info = '';
      
      if (score > -mateValue && score < -mateScore) {
        info = 'info score mate ' + (parseInt(-(score + mateValue) / 2 - 1)) + 
               ' depth ' + current_depth +
               ' nodes ' + nodes +
               ' time ' + (new Date().getTime() - start) +
               ' pv ';
      
      } else if (score > mateScore && score < mateValue) {
        info = 'info score mate ' + (parseInt((mateValue - score) / 2 + 1)) + 
               ' depth ' + current_depth +
               ' nodes ' + nodes +
               ' time ' + (new Date().getTime() - start) +
               ' pv ';
      
      } else {
        info = 'info score cp ' + score + 
               ' depth ' + current_depth +
               ' nodes ' + nodes +
               ' time ' + (new Date().getTime() - start) +
               ' pv ';

        for (let count = 0; count < pvLength[0]; count++)
          info += moveToString(pvTable[count]) + ' ';
      }
      
      console.log(info);
    }

    console.log('bestmove ' + ( (timing.stopped == 1) ? moveToString(lastBestMove):
                                                        moveToString(pvTable[0])) + '\n');
  }


  /****************************\
   ============================
   
          INPUT & OUTPUT

   ============================              
  \****************************/
  
  // castling bits
  var KC = 1, QC = 2, kc = 4, qc = 8;

  // decode promoted pieces
  var promotedPieces = {
    [Q]: 'q', [R]: 'r', [B]: 'b', [N]: 'n',
    [q]: 'q', [r]: 'r', [b]: 'b', [n]: 'n'
  };

  // encode ascii pieces
  var charPieces = {
      'P': P, 'N': N, 'B': B, 'R': R, 'Q': Q, 'K': K,
      'p': p, 'n': n, 'b': b, 'r': r, 'q': q, 'k': k,
  };
  
  // unicode piece representation
  const unicodePieces = [
    '.', '\u2659', '\u2658', '\u2657', '\u2656', '\u2655', '\u2654',
         '\u265F', '\u265E', '\u265D', '\u265C', '\u265B', '\u265A'
  ];

  // set board position from FEN
  function setBoard(fen) {
    resetBoard();
    var index = 0;
    
    // parse board position
    for (var rank = 0; rank < 8; rank++) {
      for (var file = 0; file < 16; file++) {
        var square = rank * 16 + file;
        if ((square & 0x88) == 0) {
          if ((fen[index].charCodeAt() >= 'a'.charCodeAt() &&
               fen[index].charCodeAt() <= 'z'.charCodeAt()) || 
              (fen[index].charCodeAt() >= 'A'.charCodeAt() &&
               fen[index].charCodeAt() <= 'Z'.charCodeAt())) {
            if (fen[index] == 'K') kingSquare[white] = square;
            else if (fen[index] == 'k') kingSquare[black] = square;
            board[square] = charPieces[fen[index]];
            index++;
          }
          if (fen[index].charCodeAt() >= '0'.charCodeAt() &&
              fen[index].charCodeAt() <= '9'.charCodeAt()) {
            var offset = fen[index] - '0';
            if (!(board[square])) file--;
            file += offset;
            index++;
          }
          if (fen[index] == '/') index++;
        }
      }
    }
    
    // parse side to move
    index++;
    side = (fen[index] == 'w') ? white : black;
    index += 2;
    
    // parse castling rights
    while (fen[index] != ' ') {
      switch(fen[index]) {
        case 'K': castle |= KC; break;
        case 'Q': castle |= QC; break;
        case 'k': castle |= kc; break;
        case 'q': castle |= qc; break;
        case '-': break;
      }

      index++;
    }
    
    index++;
    
    // parse enpassant square
    if (fen[index] != '-') {
      var file = fen[index].charCodeAt() - 'a'.charCodeAt();
      var rank = 8 - (fen[index + 1].charCodeAt() - '0'.charCodeAt());
      enpassant = rank * 16 + file;
    } else enpassant = noEnpassant;
    
    // parse 50 rule move counter
    fifty = parseInt(fen.slice(index, fen.length - 1).split(' ')[1]);

    // parse full move counter
    gamePly = parseInt(fen.slice(index, fen.length + 1).split(' ')[2]) * 2;

    // generate unique position identifier
    hashKey = generateHashKey();

    // init piece list
    initPieceList();
    
    // render board in browser
    if (typeof(document) != 'undefined') updateBoard();
  }
  
  // load move sequence
  function loadMoves(moves) {
    moves = moves.split(' ');
    
    for (const index in moves) {
      let move = moves[index];
      let moveString = moves[index];
      let validMove = isValid(move);
      if (validMove) makeMove(validMove);
    }
    
    searchPly = 0;
  }
  
  // print chess board to console
  function printBoard() {
    var boardString = '';
    
    // print board position
    for (var rank = 0; rank < 8; rank++) {
      for (var file = 0; file < 16; file++) {
        var square = rank * 16 + file;
        if (file == 0) boardString += '   ' + (8 - rank).toString() + ' ';
        if ((square & 0x88) == 0) boardString += unicodePieces[board[square]] + ' ';
      }
      boardString += '\n'
    }
    
    boardString += '     a b c d e f g h';
    
    // print board state variables
    boardString += '\n\n     Side:     ' + ((side == 0) ? 'white': 'black');
    boardString += '\n     Castling:  ' + ((castle & KC) ? 'K' : '-') + 
                                        ((castle & QC) ? 'Q' : '-') +
                                        ((castle & kc) ? 'k' : '-') +
                                        ((castle & qc) ? 'q' : '-');
    boardString += '\n     Ep:          ' + ((enpassant == noEnpassant) ? 'no': coordinates[enpassant]);
    boardString += '\n\n     Key: ' + hashKey;
    boardString += '\n 50 rule:          ' + fifty;
    boardString += '\n   moves:          ' + ((gamePly % 2) ? Math.round(gamePly / 2) - 1 : Math.round(gamePly / 2));
    console.log(boardString + '\n');
  }
  
  // print move
  function moveToString(move) {
    if (getMovePromoted(move)) {
      return coordinates[getMoveSource(move)] +
             coordinates[getMoveTarget(move)] +
             promotedPieces[getMovePromoted(move)];
    } else {
      return coordinates[getMoveSource(move)] +
             coordinates[getMoveTarget(move)];
    }
  }

  // print move list
  function printMoveList(moveList) {
    var listMoves = '   Move     Capture  Double   Enpass   Castling  Score\n\n';
    
    for (var index = 0; index < moveList.length; index++) {
      var move = moveList[index].move;
      listMoves += '   ' + coordinates[getMoveSource(move)] + coordinates[getMoveTarget(move)];
      listMoves += (getMovePromoted(move) ? promotedPieces[getMovePromoted(move)] : ' ');
      listMoves += '    ' + getMoveCapture(move) +
                    '        ' + getMovePawn(move) +
                    '        ' + getMoveEnpassant(move) +
                    '        ' + getMoveCastling(move) + 
                    '         ' + moveList[index].score + '\n';
    }
    
    listMoves += '\n   Total moves: ' + moveList.length;
    console.log(listMoves);
  }
  
  // print piece list & material counts
  function printPieceList() {
    var materialCountString = '    Material counts:\n\n';
    
    // print material count
    for (var piece = P; piece <= k; piece++)
      materialCountString += '    ' + unicodePieces[piece] + ': ' + pieceList[piece] + '\n';

    console.log(materialCountString);
    var pieceListString = '    Piece list:\n\n';
    
    // print piece-square pairs
    for (var piece = P; piece <= k; piece++)
      for (var pieceNumber = 0; pieceNumber < pieceList[piece]; pieceNumber++)
        pieceListString += '    ' + unicodePieces[piece] + ': ' + 
                                    coordinates[pieceList.pieces[piece * 10 + pieceNumber]] + '\n';

    console.log(pieceListString);
  }

  /****************************\
   ============================
   
               GUI

   ============================              
  \****************************/
  
  // browser mode [TODO: fix inbalanced tags in firefox]
  if (typeof(document) != 'undefined') { 
    // color theme
    var LIGHT_SQUARE = '#f0d9b5';
    var DARK_SQUARE = '#b58863';
    var SELECT_COLOR = 'brown';
    
    // square size
    var CELL_WIDTH = 50;
    var CELL_HEIGHT = 50;
    
    // override board appearance
    if (boardSize) { CELL_WIDTH = boardSize / 8; CELL_HEIGHT = boardSize / 8; }
    if (lightSquare) LIGHT_SQUARE = lightSquare;
    if (darkSquare) DARK_SQUARE = darkSquare;
    if (selectColor) SELECT_COLOR = selectColor;
      
    // render board in browser
    function drawBoard() {      
      var chessBoard = '<table align="center" cellspacing="0">'
      
      chessBoard += '<tr><td></td>';
      
      

      for (let index in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
        chessBoard += 
          '<td align="center" height="30" style="' + 
          'border-bottom: 1px solid black;' +
          'font-size: 18px; font-weight: bold"></td>';
      }
      
      chessBoard += '</td>';
      
      // board table
      for (var row = 0; row < 8; row++) {
        chessBoard += '<tr>'
        for (var col = 0; col < 16; col++) {
          var square = row * 16 + col;
          
          // board ranks
          if (col == 0) chessBoard += 
            '<td width="15" style="border-right: 1px solid black; font-size: 18px; font-weight: bold">' + 
            (8 - row ) + '</td>';
          
          // hack to avoid border overlap
          if (col == 8) chessBoard += 
            '<td style="border-left: 1px solid black"></td>';
          
          if ((square & 0x88) == 0)
            chessBoard += 
              '<td align="center" id="' + square + 
              '"bgcolor="' + ( ((col + row) % 2) ? DARK_SQUARE : LIGHT_SQUARE) + 
              '" width="' + CELL_WIDTH + 'px" height="' + CELL_HEIGHT +  'px" ' +
              'onclick="tapPiece(this.id)" ' + 
              'ondragstart="dragPiece(event, this.id)" ' +
              'ondragover="dragOver(event, this.id)"'+
              'ondrop="dropPiece(event, this.id)"' +
              '></td>';
        }

        chessBoard += '</tr>';
      }
      
      chessBoard += '<tr><td></td>';
      
      // board files
      let files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

      for (let index in files) {
        chessBoard += 
          '<td align="center" height="30" style="' + 
          'border-top: 1px solid black;' +
          'font-size: 18px; font-weight: bold">' + files[index] + '</td>';
      }

      chessBoard += '</tr></table>';
      document.getElementById('chessboard').innerHTML = chessBoard;
    }

    // draw pieces
    function updateBoard() {
      for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 16; col++) {
          var square = row * 16 + col;
          if ((square & 0x88) == 0)
            document.getElementById(square).innerHTML = 
              '<img style="width: ' + 
               (boardSize ? boardSize / 8: 400 / 8) + 
              'px" draggable="true" id="' + 
               board[square] + '" src ="Images/' + 
              (board[square]) +'.gif">';
        }
      }
    }
    
    // move piece in GUI
    function movePiece(userSource, userTarget, promotedPiece) {
      let moveString = coordinates[userSource] + coordinates[userTarget] + promotedPieces[promotedPiece];
      engine.loadMoves(moveString);
      console.log(gamePly);
      drawBoard();
      updateBoard();
    }

    // render board initially
    drawBoard();
    updateBoard();
  }
  

  /****************************\
   ============================
   
               INIT

   ============================              
  \****************************/
  
  // init all
  (function initAll() {
    initRandomKeys();
    hashKey = generateHashKey();
    initPieceList();
  }())


  /****************************\
   ============================
   
              TESTS

   ============================              
  \****************************/
  
  function debug() {
    // parse position from FEN string
    //setBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ');
    //setBoard('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 10 ');
    //setBoard('r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10');
    //setBoard('rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8');
    //setBoard('rnbqkbnr/pp4pp/2p5/3Npp2/2PpP3/3P1P2/PP4PP/R1BQKBNR b KQkq e3 0 6 ');
    
    //setBoard('rn2kb1r/pp5p/5n2/2p5/4pN2/111P4/PPP2PPP/R2Q1RK1 w kq - 0 15 ');
    
    
    /*setBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ');
    printPieceList();
    negamax(-50000, 50000, 4);
    console.log('nodes:', nodes);
    nodes = 0;
    printPieceList();*/
    
    //initPieceList();
    //setBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ');
    //negamax(-50000, 50000, 4);
    //console.log('nodes:', nodes);
    
    /*var moveList = [];
    generateMoves(moveList);
    
    for (let index = 0; index < moveList.length; index++)
      sortMove(index, moveList)

    printMoveList(moveList);
    
    // perft test
    perftTest(4);
    */
  }
  
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
    
    // engine methods [BROWSER MODE]
    drawBoard: function() { return drawBoard(); },
    updateBoard: function() { return updateBoard(); },
    
    // engine methods [CONSOLE MODE]
    printBoard: function() { printBoard(); },
    setBoard: function(fen) { setBoard(fen); },
    loadMoves: function(moves) { loadMoves(moves); },
    getPiece: function(square) { getPiece(square); },
    setPiece: function(piece, square) { setPiece(piece, square); },
    getSide: function() { return side; },
    takeBack: function() { if (backup.length) takeBack(); },
    movePiece: function(userSource, userTarget, promotedPiece) { movePiece(userSource, userTarget, promotedPiece); },
    perft: function(depth) { perftTest(depth); },
    search: function(depth) { searchPosition(depth) },
    resetTimeControl: function() { resetTimeControl(); },
    setTimeControl: function(timeControl) { setTimeControl(timeControl); },
    getTimeControl: function() { return JSON.parse(JSON.stringify(timing))},
    debug: function() { debug(); }
  }
}

if (typeof(document) != 'undefined') {

  /****************************\
   ============================

         WEB BROWSER MODE

   ============================              
  \****************************/
  
  // auto init in stand alone mode
  if (document.body == null) {
    // run in browser mode  
    console.log('\n  Wukong JS - BROWSER MODE - v' + VERSION + '\n\n');
  
    // create basic HTML structure
    var html = 
      '<html>\n' + 
        '<head>\n' +
          '<title>Wukong JS v' + VERSION + '</title>\n' +
        '</head>\n' +
        '<body>\n' +
          '<h4 style="text-align: center; position: relative; top: 10px;">\n' +
            'Wukong JS - CHESS ENGINE - v' + VERSION + '\n' +
           '</h4>\n' +
          '<div id="chessboard"></div>\n' +
        '</body>\n' +
      '</html>';

    // render HTML
    document.write(html);

    // init engine
    var engine = new Engine();
    engine.debug();


    /****************************\
     ============================
   
            GUI EVENT BINDS

     ============================              
    \****************************/
    
    // user input controls
    var clickLock = 0;
    var userSource, userTarget;
      
    // pick piece handler
    function dragPiece(event, square) { userSource = square; }
    
    // drag piece handler
    function dragOver(event, square) { event.preventDefault();
      if (square == userSource) event.target.src = 'Images/0.gif';
    }
    
    // drop piece handler
    function dropPiece(event, square) {
      userTarget = square;
      engine.movePiece(userSource, userTarget, 5);  // TODO take promoted from GUI  
      clickLock = 0;
      
      if (engine.getPiece(square))
        document.getElementById(square).style.backgroundColor = engine.SELECT_COLOR;
      
      event.preventDefault();
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
        engine.movePiece(userSource, userTarget, 5);  // TODO take promoted from GUI
        clickLock = 0;
      }
    }
  }
} else if (typeof(exports) != 'undefined') {

  /****************************\
   ============================

             UCI MODE

   ============================              
  \****************************/

  // init engine
  var engine = new Engine();
  //engine.debug();
  //return;

  process.stdin.setEncoding('utf-8');
  console.log('\n  Wukong JS - UCI mode - v' + VERSION + '\n\n');
  
  // parse UCI "go" command
  function parseGo(command) {
    if (command.includes('infinite')) return;

    engine.resetTimeControl();
    timing = engine.getTimeControl();

    var go = command.split(' ');
    var depth = -1;
    var movestogo = 30;
    var movetime = -1;
    var inc = 0;

    if (go[1] == 'wtime' && engine.getSide() == engine.WHITE ) { timing.time = parseInt(go[2]); }
    if (go[3] == 'btime' && engine.getSide() == engine.BLACK ) { timing.time = parseInt(go[4]); }
    if (go[5] == 'winc' && engine.getSide() == engine.WHITE) { inc = parseInt(go[6]); }
    if (go[7] == 'binc' && engine.getSide() == engine.BLACK) { inc = parseInt(go[8]); }
    if (go[9] == 'movestogo') { movestogo = parseInt(go[10]); }
    if (go[1] == 'movetime') { movetime = parseInt(go[2]); }
    if (go[1] == 'depth') { depth = parseInt(go[2]); }

    if(movetime != -1) {
      timing.time = movetime;
      movestogo = 1;
    }
    
    var startTime = new Date().getTime();
    
    if(timing.time != -1) {
      timing.timeSet = 1;
      timing.time /= movestogo;
      timing.time = parseInt(timing.time);
      timing.time -= 50;
      
      if (timing.time < 0) {
          timing.time = 0;
          inc -= 50;
          if (inc < 0) inc = 1;
      }
      
      timing.stopTime = startTime + timing.time + inc;        
    }

    // "infinite" depth if it's not specified
    if (depth == -1) depth = 64;

    // set time control
    engine.setTimeControl(timing);
    console.log(
      'time:', timing.time,
      'inc', inc,
      'start', startTime,
      'stop', timing.stopTime,
      'depth', depth,
      'timeset', timing.timeSet
    );

    // search position
    engine.search(depth);
  }
  
  // parse UCI "position" command
  function parsePosition(command) {
      let position = command.split(' ');
      
      if (position[1].includes('startpos')) engine.setBoard(engine.START_FEN);
      else if (position[1] == 'fen') engine.setBoard(command.split('position fen ')[1]);
      
      let moves = command.split('moves ')[1];
      if (moves) { engine.loadMoves(moves); };
      
      engine.printBoard();
  }

  // create CLI interface
  var readline = require('readline');
  var uci = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // UCI loop
  uci.on('line', function(command){
    if (command == 'uci') {
      console.log('id name WukongJS ' + VERSION);
      console.log('id author Code Monkey King');
    }

    if (command == 'isready') console.log('readyok');
    if (command == 'quit') process.exit();
    if (command == 'ucinewgame') parsePosition("position startpos");
    if (command.includes('position')) parsePosition(command);
    if (command.includes('go')) parseGo(command);
  })
}






