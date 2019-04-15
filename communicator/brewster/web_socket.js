const net = require('net');
const port = 8082

let client = null;


const io = require('socket.io')(8082);

io.on('connection', function(socket) {
    console.log('WebSocket connected: ' + socket.id)
    socket.on('SEND_MESSAGE', function(data) {
      console.log('WS SEND_MESSAGE: ' + data);
      io.emit('MESSAGE', data)
    });
    socket.on('disconnect', function(){
      console.log('WS user disconnected');
    });
    socket.on('pingServer', function(msg){
      console.log('WS message: ' + msg);
    });

    /*
    function intervalFunc() {
      console.log('WS Emit event to client - ' + socket.id);
      //socket.broadcast.emit('Event');
      socket.emit('new_event', 'WS event@'+ Date.now());
    }
    setInterval(intervalFunc, 1500);
    */
});

module.exports.broadcastEvent = function(event) {
  console.log('WS broadcasting event: ' + event.event + ', ' + JSON.stringify(event.payload));
  io.emit(event.event, event);
};

/*
const server = net.createServer((c) => {
  // 'connection' listener
  console.log('WS client connected (' + c.localAddress + ')');
  client = c;

  c.on('end', () => {
    console.log('WS client disconnected');
  });
  //c.write('WS Connected');

  //c.pipe(c);
  c.on('data', (input) => {
    txt = input;
    if (input[input.length-1] == 10 || input[input.length-1] == 13) {
      txt = input.slice(0,input.length-1);
    }
    console.log('WS Received: '+ txt);
  });
  c.on('close', (hadError) => {
    console.log('WS socket close');
  });
  c.on('error', (err) => {
    console.log('WS socket error');
  });

  function intervalFunc() {
    console.log('Cant stop me now!');
    c.write('WS Connected');
  }
  //setInterval(intervalFunc, 1500);
});
server.on('error', (err) => {
  throw err;
});
server.listen(port, () => {
  console.log('Communicator WebSocket for client started on port '+port);
});

module.exports.send_msg = function(val) {
  if (client == null) {
    console.log('WS client null');
  }else{
    console.log('WS sending to client: ' + val);
    client.write(val);
  }
};
*/
