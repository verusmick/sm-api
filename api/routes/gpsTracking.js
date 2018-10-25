var express = require('express');
var router = express.Router();
var gpsTrackingHandlers = require('../models/gpsTracking.model');

/* GET users listing. */
router.get('/sellers', gpsTrackingHandlers.sellersTrackEvents);
router.post('/sellers', gpsTrackingHandlers.postSellersTrack);
router.put('/trackStatus/:value', gpsTrackingHandlers.setTrackStatus);
router.get('/gpsStatus/:userId', gpsTrackingHandlers.gpsStatus);

module.exports = router;
