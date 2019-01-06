var express = require('express');
var router = express.Router();
var led_controller = require('../controllers/ledController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Led brightness');
});

// POST request to update Book.
router.post('/update', led_controller.led_update_post);

module.exports = router;
