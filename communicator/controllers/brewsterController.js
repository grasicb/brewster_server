var iot = require('../brewster/IOT_Server.js');

// Export functions which send events to the Brewster
exports.refreshSensors = function(req, res) {
  let event = iot.prepareEvent('refreshSensors');
  event['payload'] = 'ALL';
  iot.send_event(event);
  
  res.send('Request to refresh sensors has been sent.');
};

exports.refreshOutputs = function(req, res) {
  let event = iot.prepareFunctionCall('refreshOutputs');
  event['payload'] = 'ALL';
  iot.send_event(event);
  
  res.send('Request to refresh outputs has been sent.');
};

exports.healthInfo = async function(req, res) {
  let event = iot.prepareFunctionCall('healthInfo');
  event['parameters'] = {};
  iot.send_event(event);

  try {
    let result = await iot.get_function_output(event.signature);
    
    res.send(String(result.info).replace(/\n/g, '<br/>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;'));
  }
  catch(e) {
    console.log('Error in function healthInfo:' +e);
    res.send('Timeout');
  } 
};