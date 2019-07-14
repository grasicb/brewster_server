var express = require('express');
var router = express.Router();
var brewster_controller = require('../controllers/brewsterController');

router.get('/', function(req, res, next) {
  res.send('Brewster control');
});

// GET request to refresh sensors
router.get('/refreshSensors', brewster_controller.refreshSensors);

// GET request to refresh outputs
router.get('/refreshOutputs', brewster_controller.refreshOutputs);

// GET request to refresh outputs
router.get('/healthInfo', brewster_controller.healthInfo);

// GET request for retrieving all outputs
router.get('/output', function(req, res, next) {
  res.send('AC1<br/>AC2<br/>DC1<br/>DC2');
});

// GET request for retrieving single output
router.get('/output/:oID', function(req, res, next) {
  res.send('Output ' + req.params.oID+'<br/>To be implemented');
});

// POST request for changing output value/target temperature
router.post('/output/:oID', brewster_controller.setOutput);

// POST request for changing output mode of an output
router.post('/output/:oID/mode', brewster_controller.setOutputMode);

// POST request for changing output mode of an output
router.post('/output/:oID/power', brewster_controller.setPower);

module.exports = router;
