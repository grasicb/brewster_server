const net = require('net');
const port = 8081
const websocket = require('./web_socket');
var fs = require('fs'); 

let client = null;
let ind = 0;
var functionResults = new Map();

const server = net.createServer((c) => {
  // Initialization of client connection
  console.log('Client connected (' + c.localAddress + ')');
  client = c;
  let inputStringBuffer = '';
  sendWelcomeMessage();
  
  ////////////////////////////////////////
  // Handler for incoming data
  c.on('data', (input) => {
    //console.log(new Date().toISOString(), 'DEBUG', 'Command received: ' + input);
    //console.log('Input..');


    let begin = 0;
    let charFound = false;

    //Check for NULL character, once it is found, complete the string and convert it into JS Object
    for (let i = 0; i < input.length; i++) {
      if (input[i] === 0) {
        inputStringBuffer += input.slice(begin, i);
        begin = i+1;
        //console.log('DEBUG', 'Command received: ' + inputStringBuffer);
        let printCommand = true;

        //Creating object from the String
        try {
          let event = JSON.parse(inputStringBuffer);
          if(event.type=="event") {
            console.log(new Date().toISOString(), 'DEBUG', 'Event received (' + event.event + ')');

            ind++;

            //If it is a logging event, then it writes the content to the log file
            if(event.event == 'logging') {
              fs.appendFile('brewster_iot.log', event.payload.message + '\n', function (err) {
                if (err) console.log('error while writing to the log: ' + err);;
              });
              printCommand = false;

            //otherwise it broadcasts the event
            } else {
              websocket.broadcastEvent(event);
            }

          //Received has been result of a function
          } 
          
          if(event.type=="functionResult") { 
            functionResults.set(event.signature, event.result);
            console.log(new Date().toISOString(), 'DEBUG', 'Storing function result (' + event.signature + '::' + event.result + ')');
          }  
        } catch (error) {
          console.error(new Date().toISOString(), 'DEBUG', 'Cannot parse event (error: ' + error + '). Input String: ' + inputStringBuffer);
        }

        if (printCommand === true) {
          console.log(new Date().toISOString(), 'DEBUG', 'Command received: ' + inputStringBuffer);
        }
        

        inputStringBuffer = '';

      }
    }

    //Add remaineder of the string to inputBuffer
    inputStringBuffer += input.slice(begin);
  });

  ////////////////////////////////////////
  // Handler for ending of the connection
  c.on('end', () => {
    console.log('client disconnected');
  });

  ////////////////////////////////////////
  // Handler for socket closing
  c.on('close', (hadError) => {
    console.log('Socket close');
    client = null;
  });

  ////////////////////////////////////////
  // Handler for socket error
  c.on('error', (err) => {
    console.log('Socket error');
  });
});

server.on('error', (err) => {
  throw err;
});
server.listen(port, () => {
  console.log('Brewster communicator server started on port '+port);
});

////////////////////////////////////////
// Prepare and send welcome message
function sendWelcomeMessage() {
  if (client == null) {
    console.error('Cannot send to client, no client connected.');
  }else{
    let date = new Date();
    let event = {
      type: 'connection_established',
      timestamp: date.getTime(),
      timestamp_human: date.toISOString(),
      server: 'Brewster Communicator',
      server_version: '0.1'
    };
    let eventString = JSON.stringify(event);
    console.log('INFO','Sending welcome message to client: ' + eventString);
    client.write(eventString+'\0');
  }
};

////////////////////////////////////////
// Factory method for messages
module.exports.prepareEvent = function(eventName) {
  let date = new Date();
  let event = {
    type: 'event',
    event: eventName,
    timestamp: date.getTime(),
    timestamp_human: date.toISOString(),
  };
  return event;
};

module.exports.prepareFunctionCall = function(functionName) {
  let date = new Date();
  let event = {
    type: 'function',
    function: functionName,
    timestamp: date.getTime(),
    timestamp_human: date.toISOString(),
    signature: date.getTime() + '-' + Math.round(Math.random()*99999),
  };
  return event;
};

////////////////////////////////////////
// Send event to the client
module.exports.send_event = function(event) {
  let eventString = JSON.stringify(event);
  console.log('Sending event to client: ' + eventString);

  if (client == null) {
    console.error('Cannot send to client, no client connected.');
  }else{
    client.write(eventString+'\0');
  }
};


module.exports.get_function_output = function(executionID) {
  return new Promise((resolve, reject) => {
    let i = 1;

    console.log('===== Calling get_function_output =====');

    const interval = setInterval(() => {
      if (i%100 === 0) {
        console.log('-------Iteration ' + i);
      }

      if (i > 500) {
        clearInterval(interval);
        console.log('-------Timeout (executionID: ' + executionID + ')');
        console.log(functionResults.keys());
        
        reject(Error('timeout'));
      }

      else if (functionResults.has(executionID)) {
        clearInterval(interval);
        console.log('-------Successfully finished, ind: ' + ind);
        let res = functionResults.get(executionID);
        functionResults.delete(executionID);
        resolve(res);
      }

      i++;
    }, 10);
  });
}


////////////////////////////////////////
// Change led brightness
/*
module.exports.update_led = function(val) {
  console.log('Led dimm value: ' + val);

  if (client == null) {
    console.error('Cannot send to client, no client connected.');
  }else{
    let event = this.prepareEvent('ledDimm');
    event['payload'] = {
      value: parseInt(val)
    }

    let eventString = JSON.stringify(event);
    console.log(eventString);
    client.write(eventString+'\0');
  }
};
*/