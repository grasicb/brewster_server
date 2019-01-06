const net = require('net');
const port = 8081
const websocket = require('./web_socket');

let client = null;

const server = net.createServer((c) => {
  // Initialization of client connection
  console.log('Client connected (' + c.localAddress + ')');
  client = c;
  let inputStringBuffer = '';
  sendWelcomeMessage();
  
  ////////////////////////////////////////
  // Handler for incoming data
  c.on('data', (input) => {
    let begin = 0;
    let charFound = false;

    //Check for NULL character, once it is found, complete the string and convert it into JS Object
    for (let i = 0; i < input.length; i++) {
      if (input[i] == 0) {
        inputStringBuffer += input.slice(begin, i);
        begin = i+1;
        console.log('Command received: ' + inputStringBuffer);

        //Creating object from the String
        let event = JSON.parse(inputStringBuffer);
        if(event.type=="event") {
          websocket.broadcastEvent(event);
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
    console.log('Sending welcome message to client: ' + eventString);
    client.write(eventString+'\0');
  }
};

////////////////////////////////////////
// Factory method for events
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