
process.on('message', function(m) { 
  console.log('Child process received:', m.command);
  
  if (m.command == 'uci') process.send({ command: 'seen uci' });
  else if (m.command == 'quit') process.exit();
   
}); 
  

