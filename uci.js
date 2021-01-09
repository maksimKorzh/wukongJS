/****************************\
 ============================

           UCI MODE

 ============================              
\****************************/

// init engine
const { Engine } = require('./wukong.js');  
const engine = new Engine();

process.stdin.setEncoding('utf-8');
console.log('\n  Wukong JS - UCI mode - v' + engine.VERSION + '\n\n');

// parse UCI "go" command
function parseGo(command) {
  if (command.includes('infinite')) return;

  engine.resetTimeControl();
  timing = engine.getTimeControl();

  let go = command.split(' ');
  let depth = -1;
  let movestogo = 40;
  let movetime = -1;
  let inc = 0;

  if (go[1] == 'wtime' && engine.getSide() == engine.COLOR['WHITE'] ) { timing.time = parseInt(go[2]); }
  if (go[3] == 'btime' && engine.getSide() == engine.COLOR['BLACK'] ) { timing.time = parseInt(go[4]); }
  if (go[5] == 'winc' && engine.getSide() == engine.COLOR['WHITE']) { inc = parseInt(go[6]); }
  if (go[7] == 'binc' && engine.getSide() == engine.COLOR['BLACK']) { inc = parseInt(go[8]); }
  if (go[9] == 'movestogo') { movestogo = parseInt(go[10]); }
  if (go[1] == 'movetime') { movetime = parseInt(go[2]); }
  if (go[1] == 'depth') { depth = parseInt(go[2]); }

  if(movetime != -1) {
    timing.time = movetime;
    movestogo = 1;
  }

  let startTime = new Date().getTime();

  if(timing.time != -1) {
    let timeLeft = timing.time;
    timing.timeSet = 1;
    timing.time /= movestogo;
    timing.time = parseInt(timing.time);

    if (movestogo == 1) {
      timing.stopTime = startTime + timing.time;
    } else if (timeLeft <= 1000) {
      inc -= 150
      if (inc <= 0) inc = 100;
      timing.stopTime = startTime + inc;
    } else {
      timing.stopTime = startTime + timing.time + inc;
    }
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
    console.log('id name WukongJS ' + engine.VERSION);
    console.log('id author Code Monkey King');
    console.log('uciok');
  }

  if (command == 'isready') console.log('readyok');
  if (command == 'quit') process.exit();
  if (command == 'ucinewgame') parsePosition("position startpos");
  if (command.includes('position')) parsePosition(command);
  if (command.includes('go')) parseGo(command);
  
  // perft (non UCI command)
  if (command.includes('perft')) engine.perft(command.split(' ')[1]);
})






