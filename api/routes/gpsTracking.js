var express = require('express');
var router = express.Router();
var gpsTrackingHandlers = require('../models/gpsTracking.model');

/* GET users listing. */
router.get('/sellers', gpsTrackingHandlers.sellersTrackEvents);
router.post('/sellers', gpsTrackingHandlers.postSellersTrack);

module.exports = router;
