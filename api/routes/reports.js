var express = require('express');
var router = express.Router();
var reportsHandlers = require('../models/reports.model.js');

/* GET users listing. */
router.get('/getStatusGpsPerSeller', reportsHandlers.getStatusGpsPerSeller);

module.exports = router;
