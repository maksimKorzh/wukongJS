/************************************************\
 ================================================
 
                      WUKONG
              javascript chess engine
           
                        by
                        
                 Code Monkey King
 
 ===============================================
\************************************************/

// engine version
const VERSION = '1.0';

// encapsulate engine object
var Engine = function(boardSize, lightSquare, darkSquare, selectColor) {

  /****************************\
   ============================
   
         BOARD DEFINITIONS

   ============================              
  \****************************/
  
  // sides to move  
  const white = 0;
  const black = 1;
  
  // piece encoding  
  const P = 1;    // white pawn
  const N = 2;    // white knight
  const B = 3;    // white bishop
  const R = 4;    // white rook
  const Q = 5;    // white queen
  const K = 6;    // white king

  const p = 7;    // black pawn
  const n = 8;    // black knight
  const b = 9;    // black bishop
  const r = 10;   // black rook
  const q = 11;   // black queen
  const k = 12;   // black king
  
  const o = 13;   // "piece" at offboard sqaure
  const e = 0;    // "piece" at empty square
  
  // square encoding
  const a8 = 0,    b8 = 1,    c8 = 2,   d8 = 3,   e8 = 4,   f8 = 5,   g8 = 6,   h8 = 7;
  const a7 = 16,   b7 = 17,   c7 = 18,  d7 = 19,  e7 = 20,  f7 = 21,  g7 = 22,  h7 = 23;
  const a6 = 32,   b6 = 33,   c6 = 34,  d6 = 35,  e6 = 36,  f6 = 37,  g6 = 39,  h6 = 40;
  const a5 = 48,   b5 = 49,   c5 = 50,  d5 = 51,  e5 = 52,  f5 = 53,  g5 = 54,  h5 = 55;
  const a4 = 64,   b4 = 65,   c4 = 66,  d4 = 67,  e4 = 68,  f4 = 69,  g4 = 70,  h4 = 71;
  const a3 = 80,   b3 = 81,   c3 = 82,  d3 = 83,  e3 = 84,  f3 = 85,  g3 = 86,  h3 = 87;
  const a2 = 96,   b2 = 97,   c2 = 98,  d2 = 99,  e2 = 100, f2 = 101, g2 = 102, h2 = 103;
  const a1 = 112,  b1 = 113,  c1 = 114, d1 = 115, e1 = 116, f1 = 117, g1 = 118, h1 = 119;
  const no_square = 120;
  
  // convert board square indexes to coordinates
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

  // 0x88 chess board representation & PST scores
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
  
  // side to move
  var side = white;

  // enpassant square
  var enpassant = no_square;

  // castling rights (dec 15 => bin 1111 => both kings can castle to both sides)
  var castle = 15;
  
  // fifty move counter
  var fifty = 0;
  
  // position hash key
  var hashKey = 0;

  // kings' squares
  var kingSquare = [e1, e8];
  
  // move stack
  var moveStack = {
    moves: new Array(1000),
    count: 0,
    size: 0
  }


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

  /****************************\
   ============================
   
               GUI

   ============================              
  \****************************/
  
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
    // create project title
    var chessBoard = '<h4 style="text-align: center; position: relative; top: 10px;">' +
                       'Wukong CHESS ENGINE v' + VERSION +
                     '</h4>';
    
    // create HTML rable tag
    chessBoard += '<table align="center" cellspacing="0" style="border: 1px solid black">';
    
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
                         '" width="' + CELL_WIDTH + '" height="' + CELL_HEIGHT + 
                         '" onclick="engine.makeMove(this.id)" ' + 
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
    }
    
    // if user clicks on destination square
    else if(clickLock) {      
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


  /****************************\
   ============================
   
               INIT

   ============================              
  \****************************/
  
  // init all when Chess() object is created
  (function init_all() {
    // init random keys
    //init_random_keys();
    
    // init hash key for starting position
    //hash_key = generate_hash_key();

    // draw board initially
    drawBoard();
    updateBoard();
    
  }())


  /****************************\
   ============================
   
              TESTS

   ============================              
  \****************************/

  /*function tests() {
    // parse position from FEN string
    set_fen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 ');
    print_board();
    
    // create move list
    var move_list = {
      moves: new Array(256),
      count: 0
    }
    
    // generate moves
    generate_moves(move_list);
    
    // print move list
    print_move_list(move_list);

    // perft test
    //perft_test(3);
    console.log(move_stack)
    print_attacked_squares(side);
  }*/
  
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
  }
}

if (typeof(document) != 'undefined') {

  /****************************\
   ============================

         WEB BROWSER MODE

   ============================              
  \****************************/
  
  // init engine
  var engine = new Engine();

} else if (typeof(exports) != 'undefined') {

  /****************************\
   ============================

             UCI MODE

   ============================              
  \****************************/

  // run in UCI mode  
  console.log('Wukong CHESS ENGINE v' + VERSION);
}






