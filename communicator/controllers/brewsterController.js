var iot = require('../brewster/IOT_Server.js');


// Export functions which send events to the Brewster
exports.refreshSensors = function(req, res) {
  let event = iot.prepareEvent('refreshSensors');
  event['payload'] = 'ALL';
  iot.send_event(event);
  
  res.send('Request to refresh sensors has been sent.');
};

exports.refreshOutputs = function(req, res) {
  let event = iot.prepareEvent('refreshOutputs');
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

exports.setPower = async function(req, res) {
  let event = iot.prepareFunctionCall('setPower');

  event['payload'] = {
    value: req.body.value,
    output: req.params.oID
  }
 
  iot.send_event(event);

  try {
    let result = await iot.get_function_output(event.signature);
    
    res.send(result);
  }
  catch(e) {
    console.log('Error in function healthInfo:' +e);
    res.send('Timeout');
  } 
}

exports.setOutput = async function(req, res) {
  let event = iot.prepareFunctionCall('setOutput');

  if(req.body.output_value) {
    event['payload'] = {
      output_value: req.body.output_value,
      output: req.params.oID
    };
  } else if (req.body.target_temperature) {
    event['payload'] = {
      target_temperature: req.body.target_temperature,
      output: req.params.oID
    };
  } else {
    return res.status(400).send({
      message: 'Invalid input.'
    });
  }
 
  iot.send_event(event);

  try {
    let result = await iot.get_function_output(event.signature);
    
    res.send(result);
  }
  catch(e) {
    res.status(500).send({
      message: 'Timeout'
    });
  } 
}

exports.setOutputMode = async function(req, res) {
  let event = iot.prepareFunctionCall('setOutputMode');

  

  if(req.body.target_sensor) {
    event['payload'] = {
      mode: req.body.mode,
      output: req.params.oID,
      target_sensor: req.body.target_sensor
    };
  } else {
    event['payload'] = {
      mode: req.body.mode,
      output: req.params.oID
    };
  }
 
  iot.send_event(event);

  try {
    let result = await iot.get_function_output(event.signature);
    
    if(result['success']) {
      res.send(result);
    } else {
      res.status(400).send(result);
    }
  }
  catch(e) {
    res.status(500).send({
      message: 'Timeout'
    });
  } 
}