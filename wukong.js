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
    [P]: 0, [N]: 0, [B]: 0, [R]: 0, [Q]: 0, [K]: 0,
    [P]: 0, [N]: 0, [B]: 0, [R]: 0, [Q]: 0, [K]: 0,
    pieces: new Array(13 * 10)
  };
  
  // move stack
  var moveStack = {
    moves: new Array(1000),
    count: 0,
    size: 0
  }
  
  // board state variables backup stack
  var backup = [];
  

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
    for (var square = 0; square < 128; square++) {
      if ((square & 0x88) == 0)	{
        var piece = board[square];
        if (piece != e) finalKey ^= pieceKeys[(piece * 128) + square];
      }		
    }
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
  
  // reset chess board
  function resetBoard() {
    for (var rank = 0; rank < 8; rank++) {
      for (var file = 0; file < 16; file++) {
        var square = rank * 16 + file;
        if ((square & 0x88) == 0) board[square] = e;
      }
    }
    side = -1;
    enpassant = noEnpassant;
    castle = 0;
    fifty = 0;
    hashKey = 0;
    kingSquare = [0, 0];
    moveStack = { moves: new Array(1000), count: 0, size: 0 }
  }
  
  // init piece list
  function initPieceList() {
    for (var piece = P; piece <= k; piece++) pieceList[piece] = 0;
    for (var index = 0; index < 13 * 10; index++) pieceList.pieces[index] = 0;
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
  
  /****************************\
   ============================
   
             ATTACKS

   ============================              
  \****************************/
  
  // square attacked
  function isSquareAttacked(square, side) {    
    for (let index = 0; index < 2; index++) {
      let direction = pawnDirections.offsets[side][index];
      if (((square + direction) & 0x88) == 0 &&
           (board[square + direction] == pawnDirections.pawn[side])) return 1;
    }
    for (let piece in leaperPieces) {      
      for (let index = 0; index < 8; index++) {
        let targetSquare = square + leaperPieces[piece].offsets[index];
        let targetPiece = board[targetSquare];
        if ((targetSquare & 0x88) == 0)
          if ((side == white) ? targetPiece == leaperPieces[piece].side[white] :
                                targetPiece == leaperPieces[piece].side[black]) return 1;
      }
    }
    for (let piece in sliderPieces) {
      for (let index = 0; index < 4; index++) {
        let targetSquare = square + sliderPieces[piece].offsets[index];
        while ((targetSquare & 0x88) == 0) {
          var targetPiece = board[targetSquare];
          if (!side ? (targetPiece == sliderPieces[piece].side[white][0] ||
                       targetPiece == sliderPieces[piece].side[white][1]) :
                      (targetPiece == sliderPieces[piece].side[black][0] ||
                       targetPiece == sliderPieces[piece].side[black][1])) return 1;
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
  
  // pawn directions to side mapping
  var pawnDirections = {
    offsets: [[17, 15], [-17, -15]],
    pawn: [P, p]
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
    moveList.push({
      move: move,
      score: 0
    });
  }

  // move generator
  function generateMoves(moveList) {
    for (var sourceSquare = 0; sourceSquare < 128; sourceSquare++) {
      if ((sourceSquare & 0x88) == 0) {
        if (side == white) {
          if (board[sourceSquare] == P) {
            var targetSquare = sourceSquare - 16;
            if (!(targetSquare & 0x88) && !board[targetSquare]) {   
              if (sourceSquare >= a7 && sourceSquare <= h7) {
                addMove(moveList, encodeMove(sourceSquare, targetSquare, Q, 0, 0, 0, 0));
                addMove(moveList, encodeMove(sourceSquare, targetSquare, R, 0, 0, 0, 0));
                addMove(moveList, encodeMove(sourceSquare, targetSquare, B, 0, 0, 0, 0));
                addMove(moveList, encodeMove(sourceSquare, targetSquare, N, 0, 0, 0, 0));                            
              } else {
                addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
                if ((sourceSquare >= a2 && sourceSquare <= h2) && !board[sourceSquare - 32])
                  addMove(moveList, encodeMove(sourceSquare, sourceSquare - 32, 0, 0, 1, 0, 0));
              }
            }
            for (var index = 0; index < 4; index++) {
              var pawn_offset = bishopOffsets[index];
              if (pawn_offset < 0) {
                var targetSquare = sourceSquare + pawn_offset;
                if (!(targetSquare & 0x88)) {
                  if ((sourceSquare >= a7 && sourceSquare <= h7) &&
                      (board[targetSquare] >= 7 && board[targetSquare] <= 12)
                     ) {
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, Q, 1, 0, 0, 0));
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, R, 1, 0, 0, 0));
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, B, 1, 0, 0, 0));
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, N, 1, 0, 0, 0));
                  } else {
                    if (board[targetSquare] >= 7 && board[targetSquare] <= 12)
                      addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                    if (targetSquare == enpassant)
                      addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 1, 0));
                  }
                }
              }
            }
          }
          if (board[sourceSquare] == K) {
            if (castle & KC) {
              if (!board[f1] && !board[g1]) {
                if (!isSquareAttacked(e1, black) && !isSquareAttacked(f1, black))
                  addMove(moveList, encodeMove(e1, g1, 0, 0, 0, 0, 1));
              }
            }
            if (castle & QC) {
              if (!board[d1] && !board[b1] && !board[c1]) {
                if (!isSquareAttacked(e1, black) && !isSquareAttacked(d1, black))
                  addMove(moveList, encodeMove(e1, c1, 0, 0, 0, 0, 1));
              }
            }
          }
        } else {
          if (board[sourceSquare] == p) {
            var targetSquare = sourceSquare + 16;
            if (!(targetSquare & 0x88) && !board[targetSquare]) {   
              if (sourceSquare >= a2 && sourceSquare <= h2) {
                addMove(moveList, encodeMove(sourceSquare, targetSquare, q, 0, 0, 0, 0));
                addMove(moveList, encodeMove(sourceSquare, targetSquare, r, 0, 0, 0, 0));
                addMove(moveList, encodeMove(sourceSquare, targetSquare, b, 0, 0, 0, 0));
                addMove(moveList, encodeMove(sourceSquare, targetSquare, n, 0, 0, 0, 0));
              } else {
                addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
                if ((sourceSquare >= a7 && sourceSquare <= h7) && !board[sourceSquare + 32])
                  addMove(moveList, encodeMove(sourceSquare, sourceSquare + 32, 0, 0, 1, 0, 0));
              }
            }
            for (var index = 0; index < 4; index++) {
              var pawn_offset = bishopOffsets[index];
              if (pawn_offset > 0) {
                var targetSquare = sourceSquare + pawn_offset;
                if (!(targetSquare & 0x88)) {
                  if ((sourceSquare >= a2 && sourceSquare <= h2) &&
                      (board[targetSquare] >= 1 && board[targetSquare] <= 6)
                     ) {
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, q, 1, 0, 0, 0));
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, r, 1, 0, 0, 0));
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, b, 1, 0, 0, 0));
                    addMove(moveList, encodeMove(sourceSquare, targetSquare, n, 1, 0, 0, 0));
                  } else {
                    if (board[targetSquare] >= 1 && board[targetSquare] <= 6)
                      addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                    if (targetSquare == enpassant)
                      addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 1, 0));
                  }
                }
              }
            }
          }
          if (board[sourceSquare] == k) {
            if (castle & kc) {
              if (!board[f8] && !board[g8]) {
                if (!isSquareAttacked(e8, white) && !isSquareAttacked(f8, white))
                  addMove(moveList, encodeMove(e8, g8, 0, 0, 0, 0, 1));
              }
            }
            if (castle & qc) {
              if (!board[d8] && !board[b8] && !board[c8]) {
                if (!isSquareAttacked(e8, white) && !isSquareAttacked(d8, white))
                  addMove(moveList, encodeMove(e8, c8, 0, 0, 0, 0, 1));
              }
            }
          }
        }
        if ((side == white) ? board[sourceSquare] == N : board[sourceSquare] == n) {
          for (var index = 0; index < 8; index++) {
            var targetSquare = sourceSquare + knightOffsets[index];
            var piece = board[targetSquare];
            if (!(targetSquare & 0x88)) {
              if (!side ? (!piece || (piece >= 7 && piece <= 12)) : 
                          (!piece || (piece >= 1 && piece <= 6))
                 ) {
                if (piece) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                else addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
              }
            }
          }
        }
        if ((side == white) ? board[sourceSquare] == K : board[sourceSquare] == k) {
          for (var index = 0; index < 8; index++) {
            var targetSquare = sourceSquare + kingOffsets[index];
            var piece = board[targetSquare];
            if (!(targetSquare & 0x88)) {
              if (!side ? (!piece || (piece >= 7 && piece <= 12)) : 
                          (!piece || (piece >= 1 && piece <= 6))
                 ) {
                  if (piece) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                  else addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
              }
            }
          }
        }
        if ((side == white) ? (board[sourceSquare] == B) || (board[sourceSquare] == Q) :
                              (board[sourceSquare] == b) || (board[sourceSquare] == q)
           ) {
          for (var index = 0; index < 4; index++) {
            var targetSquare = sourceSquare + bishopOffsets[index];
            while (!(targetSquare & 0x88)) {
              var piece = board[targetSquare];
              if ((side == white) ? (piece >= 1 && piece <= 6) : ((piece >= 7 && piece <= 12))) break;
              if ((side == white) ? (piece >= 7 && piece <= 12) : ((piece >= 1 && piece <= 6))) {
                addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                break;
              }
              if (piece == e) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
              targetSquare += bishopOffsets[index];
            }
          }
        }
        if ((side == white) ? (board[sourceSquare] == R) || (board[sourceSquare] == Q) :
                              (board[sourceSquare] == r) || (board[sourceSquare] == q)
           ) {
          for (var index = 0; index < 4; index++) {
            var targetSquare = sourceSquare + rookOffsets[index];
            while (!(targetSquare & 0x88)) {
              var piece = board[targetSquare];
              if ((side == white) ? (piece >= 1 && piece <= 6) : ((piece >= 7 && piece <= 12))) break;
              if ((side == white) ? (piece >= 7 && piece <= 12) : ((piece >= 1 && piece <= 6))) {
                addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 1, 0, 0, 0));
                break;
              }
              if (piece == 0) addMove(moveList, encodeMove(sourceSquare, targetSquare, 0, 0, 0, 0, 0));
              targetSquare += rookOffsets[index];
            }
          }
        }
      }
    }
  }

  // make deep copy of board
  function boardDeepCopy() {
    var deepCopy = [];
    for (var square = 0; square < 128; square++) deepCopy.push(board[square]);
    return deepCopy;
  }
  
  // make deep copy of king squares
  function kingSquareDeepCopy() {
    var deepCopy = [];
    for (var square = 0; square < 2; square++) deepCopy.push(kingSquare[square]);
    return deepCopy;
  }

  // move piece on chess board
  function moveCurrentPiece(piece, sourceSquare, targetSquare) {
    board[targetSquare] = board[sourceSquare];
    board[sourceSquare] = e;
    hashKey ^= pieceKeys[piece * 128 + sourceSquare];
    hashKey ^= pieceKeys[piece * 128 + targetSquare];
  }

  // make move
  function makeMove(move) {
    let sourceSquare = getMoveSource(move);
    let targetSquare = getMoveTarget(move);
    let promotedPiece = getMovePromoted(move);
    let enpass = getMoveEnpassant(move);
    let doublePush = getMovePawn(move);
    let castling = getMoveCastling(move);
    let piece = board[sourceSquare];
    let capturedPiece = board[targetSquare];
    backup.push({
      board: boardDeepCopy(),
      side: side,
      enpassant: enpassant,
      castle: castle,
      fifty: fifty,
      hash: hashKey,
      kingSquare: kingSquareDeepCopy()
    });
    moveCurrentPiece(piece, sourceSquare, targetSquare);
    fifty++;
    if (getMoveCapture(move)) {
      if (capturedPiece) hashKey ^= pieceKeys[capturedPiece * 128 + targetSquare];
      fifty = 0;
    } else if (board[sourceSquare] == P || board[sourceSquare] == p)
      fifty = 0;
    if (enpassant != noEnpassant) hashKey ^= pieceKeys[enpassant];
    enpassant = noEnpassant;
    if (doublePush) {
      if (side == white) {
        enpassant = targetSquare + 16;
        hashKey ^= pieceKeys[targetSquare + 16];
      } else {
        enpassant = targetSquare - 16;
        hashKey ^= pieceKeys[targetSquare - 16];
      }
    } else if (promotedPiece) {
      if (side == white) hashKey ^= pieceKeys[P * 128 + targetSquare];
      else hashKey ^= pieceKeys[p * 128 + targetSquare];
      board[targetSquare] = promotedPiece;
      hashKey ^= pieceKeys[promotedPiece * 128 + targetSquare];
    } else if (enpass) {
      if (side == white) {
        board[targetSquare + 16] = e;
        hashKey ^= pieceKeys[p * 128 + targetSquare + 16];
      } else {
        board[targetSquare - 16] = e;
        hashKey ^= pieceKeys[(P * 128) + (targetSquare - 16)];
      }
    } else if (castling) {
      switch(targetSquare) {
        case g1: moveCurrentPiece(R, h1, f1); break;
        case c1: moveCurrentPiece(R, a1, d1); break;
        case g8: moveCurrentPiece(r, h8, f8); break;
        case c8: moveCurrentPiece(r, a8, d8); break;
      }
    }
    if (board[targetSquare] == K || board[targetSquare] == k) kingSquare[side] = targetSquare;
    hashKey ^= castleKeys[castle];
    castle &= castlingRights[sourceSquare];
    castle &= castlingRights[targetSquare];
    hashKey ^= castleKeys[castle];
    side ^= 1;
    hashKey ^= sideKey;
    if (isSquareAttacked(!side ? kingSquare[side ^ 1] : kingSquare[side ^ 1], side)) {
      takeBack();
      return 0;
    } else return 1;
  }
  
  // take move back
  function takeBack() {
    let moveIndex = backup.length - 1;
    board = backup[moveIndex].board;
    side = backup[moveIndex].side;
    enpassant = backup[moveIndex].enpassant;
    castle = backup[moveIndex].castle;
    hashKey = backup[moveIndex].hash;
    fifty = backup[moveIndex].fifty;
    kingSquare = backup[moveIndex].kingSquare;
    backup.pop();
  }


  /****************************\
   ============================
   
          INPUT & OUTPUT

   ============================              
  \****************************/
  
  // castling bits
  const KC = 1, QC = 2, kc = 4, qc = 8;

  // decode promoted pieces
  var promotedPieces = {
    [Q]: 'q',
    [R]: 'r',
    [B]: 'b',
    [N]: 'n',
    [q]: 'q',
    [r]: 'r',
    [b]: 'b',
    [n]: 'n'
  };

  // encode ascii pieces
  var charPieces = {
      'P': P,
      'N': N,
      'B': B,
      'R': R,
      'Q': Q,
      'K': K,
      'p': p,
      'n': n,
      'b': b,
      'r': r,
      'q': q,
      'k': k,
  };
  
  // unicode piece representation
  const unicodePieces = [
    // use dot for empty squares 
    '.',
    
    //  ♙         ♘         ♗         ♖         ♕         ♔  
    '\u2659', '\u2658', '\u2657', '\u2656', '\u2655', '\u2654',
    
    //  ♟︎         ♞         ♝         ♜         ♛         ♚
    '\u265F', '\u265E', '\u265D', '\u265C', '\u265B', '\u265A'
  ];

  // parse FEN string to init board position
  function parseFen(fen) {
    // reset chess board and state variables
    resetBoard();
    
    // FEN char index
    var index = 0;
    
    // loop over board ranks
    for (var rank = 0; rank < 8; rank++) {
      // loop over board files
      for (var file = 0; file < 16; file++) {
        // convert file & rank to square
        var square = rank * 16 + file;
           
        // make sure that the square is on board
        if ((square & 0x88) == 0) {
          // match pieces
          if ((fen[index].charCodeAt() >= 'a'.charCodeAt() &&
               fen[index].charCodeAt() <= 'z'.charCodeAt()) || 
              (fen[index].charCodeAt() >= 'A'.charCodeAt() &&
               fen[index].charCodeAt() <= 'Z'.charCodeAt())) {
            // set up kings' squares
            if (fen[index] == 'K')
              kingSquare[white] = square;
            
            else if (fen[index] == 'k')
              kingSquare[black] = square;
            
            // set the piece on board
            board[square] = charPieces[fen[index]];
            
            // increment FEN pointer
            index++;
          }
          
          // match empty squares
          if (fen[index].charCodeAt() >= '0'.charCodeAt() &&
              fen[index].charCodeAt() <= '9'.charCodeAt()) {
            // calculate offset
            var offset = fen[index] - '0';
            
            // decrement file on empty squares
            if (!(board[square]))
                file--;
            
            // skip empty squares
            file += offset;
            
            // increment FEN pointer
            index++;
          }
          
          // match end of rank
          if (fen[index] == '/')
            // increment FEN pointer
            index++;
        }
      }
    }
    
    // go to side parsing
    index++;
    
    // parse side to move
    side = (fen[index] == 'w') ? white : black;
    
    // go to castling rights parsing
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
      
      // increment pointer
      index++;
    }
    
    // got to empassant square
    index++;
    
    // parse empassant square
    if (fen[index] != '-') {
      // parse enpassant square's file & rank
      var file = fen[index].charCodeAt() - 'a'.charCodeAt();
      var rank = 8 - (fen[index + 1].charCodeAt() - '0'.charCodeAt());

      // set up enpassant square
      enpassant = rank * 16 + file;
    }
    
    else
      // set enpassant to no square (offboard)
      enpassant = noEnpassant;
    
    // parse 50 move count
    fifty = Number(fen.slice(index, fen.length - 1).split(' ')[1]);

    // init hash key
    hashKey = generateHashKey();
    
    // init piece list
    initPieceList();
    
    // update board on GUI mode
    if (typeof(document) != 'undefined')
      updateBoard();
  }
  
  // print chess board to console
  function printBoard() {
    // chess board string
    var boardString = '';
    
    // loop over board ranks
    for (var rank = 0; rank < 8; rank++) {
      // loop over board files
      for (var file = 0; file < 16; file++) {
        // convert file & rank to square
        var square = rank * 16 + file;
        
        // print ranks
        if (file == 0)
          boardString += '   ' + (8 - rank).toString() + ' ';
        
        // make sure that the square is on board
        if ((square & 0x88) == 0)
        {
          // init piece
          var piece = board[square];
          
          // append pieces to board string
          boardString += unicodePieces[piece] + ' ';
        }
      }
      
      // append new line to chess board
      boardString += '\n'
    }
    
    // append files to board string
    boardString += '     a b c d e f g h';
    
    // append board state variables
    boardString += '\n\n     Side:     ' + ((side == 0) ? 'white': 'black');
    boardString += '\n     Castling:  ' + ((castle & KC) ? 'K' : '-') + 
                                        ((castle & QC) ? 'Q' : '-') +
                                        ((castle & kc) ? 'k' : '-') +
                                        ((castle & qc) ? 'q' : '-');
                                        
    boardString += '\n     Ep:          ' + ((enpassant == noEnpassant) ? 'no': coordinates[enpassant]);
    boardString += '\n\n     50 moves:    ' + fifty; 
    boardString += '\n     Key: ' + hashKey;
    
    // print board string to console
    console.log(boardString + '\n');
  }
  
  // print move
  function moveToString(move) {
    if (getMovePromoted(move))
      return coordinates[getMoveSource(move)] +
             coordinates[getMoveTarget(move)] +
             promotedPieces[getMovePromoted(move)];
      
    else
      return coordinates[getMoveSource(move)] +
             coordinates[getMoveTarget(move)];
  }
  
  // print piece list & material counts
  function printPieceList() {
    // material output string
    var materialCountString = '    Material counts:\n\n';

    // material counts output
    for (var piece = P; piece <= k; piece++)
      materialCountString += '    ' + unicodePieces[piece] + ': ' + pieceList[piece] + '\n';

    console.log(materialCountString);
    
    // piece list output string
    var pieceListString = '    Piece list:\n\n';
    
    // piece list output
    for (var piece = P; piece <= k; piece++)
      for (var pieceNumber = 0; pieceNumber < pieceList[piece]; pieceNumber++)
        pieceListString += '    ' + unicodePieces[piece] + ': ' + 
                                    coordinates[pieceList.pieces[piece * 10 + pieceNumber]] + '\n';

    console.log(pieceListString);
  }
	
  // print move list
  function printMoveList(moveList) {
    // print table header
    var listMoves = '   Move     Capture  Double   Enpass   Castling\n\n';

    // loop over moves in a movelist
    for (var index = 0; index < moveList.length; index++) {
      var move = moveList[index].move;
      listMoves += '   ' + coordinates[getMoveSource(move)] + coordinates[getMoveTarget(move)];
      listMoves += (getMovePromoted(move) ? promotedPieces[getMovePromoted(move)] : ' ');
      listMoves += '    ' + getMoveCapture(move) +
                    '        ' + getMovePawn(move) +
                    '        ' + getMoveEnpassant(move) +
                    '        ' + getMoveCastling(move) + '\n';
    }
    
    // append total moves
    listMoves += '\n   Total moves: ' + moveList.count;
    
    // print move list to console
    console.log(listMoves);
    
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
    // escape condition
    if  (depth == 0) {
      // count current position
      nodes++;
      return;
    }
    
    // create move list
    var moveList = [];
    
    // generate moves
    generateMoves(moveList);
    
    // loop over the generated moves
    for (var moveCount = 0; moveCount < moveList.length; moveCount++) {      
      // make only legal moves
      if (!makeMove(moveList[moveCount].move))
        // skip illegal move
        continue;
      
      // recursive call
      perftDriver(depth - 1);
      
      // take move back
      takeBack();
    }
  }

  // perft test
  function perftTest(depth) {
    console.log('   Performance test:\n');
    resultString = '';
    
    // init start time
    var startTime = new Date().getTime();

    // create move list    
    var moveList = [];
    
    // generate moves
    generateMoves(moveList);

    // loop over the generated moves      
    for (var moveCount = 0; moveCount < moveList.length; moveCount++) {      
      // make only legal moves
      if (!makeMove(moveList[moveCount].move))
        // skip illegal move
        continue;

      // cummulative nodes
      var cumNodes = nodes;
      
      // recursive call
      perftDriver(depth - 1);
      
      // old nodes
      var oldNodes = nodes - cumNodes;

      // take move back
      takeBack();
      
      // print current move
      console.log(  '   move' +
                    ' ' + (moveCount + 1) + ((moveCount < 9) ? ':  ': ': ') +
                    coordinates[getMoveSource(moveList[moveCount].move)] +
                    coordinates[getMoveTarget(moveList[moveCount].move)] +
                    (getMovePromoted(moveList[moveCount].move) ?
                    promotedPieces[getMovePromoted(moveList[moveCount].move)]: ' ') +
                    '    nodes: ' + oldNodes);
    }
    
    // append results
    resultString += '\n   Depth: ' + depth;
    resultString += '\n   Nodes: ' + nodes;
    resultString += '\n    Time: ' + (new Date().getTime() - startTime) + ' ms\n';
    
    // print results
    console.log(resultString);
  }


  /****************************\
   ============================
   
               GUI

   ============================              
  \****************************/
  
  if (typeof(document) != 'undefined') { 
    // board appearence
    var LIGHT_SQUARE = '#f0d9b5';
    var DARK_SQUARE = '#b58863';
    var SELECT_COLOR = 'brown';

    // board square size
    var CELL_WIDTH = 50;
    var CELL_HEIGHT = 50;
    
    // override board size
    if (boardSize) {
      CELL_WIDTH = boardSize / 8;
      CELL_HEIGHT = boardSize / 8;
    }
    
    // override board appearence settings
    if (lightSquare) LIGHT_SQUARE = lightSquare;
    if (darkSquare) DARK_SQUARE = darkSquare;
    if (selectColor) SELECT_COLOR = selectColor;
      
    // variable to check click-on-piece state
    var clickLock = 0;

    // user input variables
    var userSource, userTarget;

    function drawBoard() {      
      // create HTML rable tag
      var chessBoard = '<table align="center" cellspacing="0" style="border: 1px solid black">';
      
      // loop over board rows
      for (var row = 0; row < 8; row++) {
        // create table row
        chessBoard += '<tr>'
        
        // loop over board columns
        for (var col = 0; col < 16; col++) {
          // init square
          var square = row * 16 + col;
          
          // make sure square is on board
          if ((square & 0x88) == 0)
            // create table cell
            chessBoard += '<td align="center" id="' + square + 
                           '"bgcolor="' + ( ((col + row) % 2) ? DARK_SQUARE : LIGHT_SQUARE) + 
                           '" width="' + CELL_WIDTH + 'px" height="' + CELL_HEIGHT +  'px" ' +
                           ' onclick="engine.makeMove(this.id)" ' + 
                           'ondragstart="engine.dragPiece(event, this.id)" ' +
                           'ondragover="engine.dragOver(event, this.id)"'+
                           'ondrop="engine.dropPiece(event, this.id)"' +
                           '></td>'
        }
        
        // close table row tag
        chessBoard += '</tr>'
      }
      
      // close div tag
      chessBoard += '</table>';
      
      // render chess board to screen
      document.getElementById('chessboard').innerHTML = chessBoard;
    }

    // update board position (draw pieces)
    function updateBoard() {
      // loop over board rows
      for (var row = 0; row < 8; row++) {
        // loop over board columns
        for (var col = 0; col < 16; col++) {
          // init square
          var square = row * 16 + col;
          
          // make sure square is on board
          if ((square & 0x88) == 0)
            // draw pieces
            document.getElementById(square).innerHTML = '<img style="width: ' + 
                                                         (boardSize ? boardSize / 8: 400 / 8) + 
                                                        'px" draggable="true" id="' + 
                                                         board[square] + '" src ="Images/' + 
                                                        (board[square]) +'.gif">';
        }
      }
    }
    
    // pick piece
    function dragPiece(event, square) {
      // init source square
      userSource = square;
    }
    
    // drag piece
    function dragOver(event, square) {        
      // needed to allow drop
      event.preventDefault();

      // erase source image of dragged piece
      if (square == userSource)
        event.target.src = 'Images/0.gif';
    }
    
    // drop piece
    function dropPiece(event, square) {
      // init target square
      userTarget = square;

      // move piece
      movePiece(square);    
      
      // highlight square
      if (board[square])
        document.getElementById(square).style.backgroundColor = SELECT_COLOR;
      
      // do not open image file in the tab
      event.preventDefault();
    }
    
    function tapPiece(square) {
      // update board
      drawBoard();
      updateBoard();
      
      // highlight square if piece is on it
      if (board[square])
        document.getElementById(square).style.backgroundColor = SELECT_COLOR;
    
      // convert div ID to square index
      var clickSquare = parseInt(square, 10)
      
      // if user clicks on source square 
      if(!clickLock && board[clickSquare]) {      
        // init user source square
        userSource = clickSquare;
        
        // lock click
        clickLock ^= 1;
      } else if(clickLock) {      
        // init user target square
        userTarget = clickSquare;
        
        // make move on GUI board
        movePiece(square);
      }
    }
    
    function movePiece(square) {
      // promoted piece
      var promotedPiece = Q;
          
      // make move on internal board
      let move_str = coordinates[userSource] + 
                     coordinates[userTarget] + 
                     promotedPieces[promotedPiece];
      
      // move to make
      /*var valid_move  = is_valid(move_str);
      
      // if move is valid
      if (valid_move) {
        // push first move into move stack
        if (move_stack.count == 0) push_move(valid_move);
        
        // make move on internal board
        makeMove(valid_move, all_moves);
        
        // push move into move stack
        pushMove(valid_move);
        
        // update board
        updateBoard();
      }*/
      
      board[userTarget] = board[userSource];
      board[userSource] = e;

      // update position
      drawBoard();
      
      // highlight target square if piece is on it
      if (board[userTarget])
        document.getElementById(userTarget).style.backgroundColor = SELECT_COLOR;
      
      // draw pieces
      updateBoard();
      
      // reset click lock
      clickLock = 0;
    }
    
    // draw board initially
    drawBoard();
    updateBoard();
  }

  /****************************\
   ============================
   
               INIT

   ============================              
  \****************************/
  
  // init all when Chess() object is created
  (function init_all() {
    // init random keys
    initRandomKeys();
    
    // init hash key for starting position
    hashKey = generateHashKey();
    
    // init piece list for starting position
    initPieceList();
    
  }())


  /****************************\
   ============================
   
              TESTS

   ============================              
  \****************************/

  function debug() {
    // parse position from FEN string
    //parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ');
    parseFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 ');
    printBoard();
    
    // perft test
    perftTest(3);
    
    //  VICE in C  tricky depth 4:    1575
    //  VICE in JS tricky depth 4:    2224
    // Wukong in C tricky depth 4:    1400
  }
  
  return {

    /****************************\
     ============================
   
            GUI EVENT BINDS

     ============================              
    \****************************/
    
    // move piece on chess board
    makeMove: function(square) { tapPiece(square); },
    
    // event handlers
    dragPiece: function(event, square) { dragPiece(event, square); },
    dragOver: function(event, square) { dragOver(event, square); },
    dropPiece: function(event, square) { dropPiece(event, square); },  
  
    /****************************\
     ============================
   
          PUBLIC API REFERENCE

     ============================              
    \****************************/
    
    debug: function() { debug(); }
  }
}

if (typeof(document) != 'undefined') {

  /****************************\
   ============================

         WEB BROWSER MODE

   ============================              
  \****************************/
  
  // run in browser mode  
  console.log('\n  Wukong JS - CHESS ENGINE - v' + VERSION + '\n\n');
  
  // create basic HTML structure
  var html = '<html><head><title>Wukong JS v' + VERSION +
             '</title></head>' +
             '<h4 style="text-align: center; position: relative; top: 10px;">' +
             'Wukong JS - CHESS ENGINE - v' + VERSION +
             '</h4><body><div id="chessboard"></div></body></html>';
  
  // render HTML
  document.write(html);
  
  // init engine
  var engine = new Engine();
  engine.debug();

} else if (typeof(exports) != 'undefined') {

  /****************************\
   ============================

             UCI MODE

   ============================              
  \****************************/

  // run in UCI mode  
  console.log('\n  Wukong JS - CHESS ENGINE - v' + VERSION + '\n\n');
  
  // init engine
  var engine = new Engine();
  engine.debug();

}






