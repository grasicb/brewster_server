const net = require('net');
const port = 8081

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('Client connected (' + c.localAddress + ')');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  //c.pipe(c);
  c.on('data', (input) => {
    txt = input;
    if (input[input.length-1] == 10 || input[input.length-1] == 13) {
      txt = input.slice(0,input.length-1);
    }
    console.log('Received: '+ txt);
  });
  c.on('close', (hadError) => {
    console.log('Socket close');
  });
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
