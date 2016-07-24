import annyang from 'annyang';
import commands from './commands';

//Start annyang voice listening
export var beginListening = function(debug) {
  if(debug){
    annyang.debug();
  }

  annyang.addCommands(commands);
  annyang.start();
}
