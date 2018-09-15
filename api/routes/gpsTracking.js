var express = require('express');
var router = express.Router();
var gpsTrackingHandlers = require('../models/gpsTracking.model');

/* GET users listing. */
router.get('/sellers', gpsTrackingHandlers.sellersTrack);

module.exports = router;
