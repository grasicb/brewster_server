var iot = require('../brewster/IOT_Server.js');

// Display list of all Authors.
exports.led_update_post = function(req, res) {
  console.log(req.body.value);

  let event = iot.prepareEvent('ledDimm');
  event['payload'] = {
    value: parseInt(req.body.value)
  }
  iot.send_event(event);
  
  res.send('Update received, value: ' + req.body.value);
};
