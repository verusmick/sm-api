var express = require('express');
var router = express.Router();
var employerHandlers = require('../models/history.model.js');

/* GET users listing. */
router.get('/sellers', employerHandlers.getSellerHistoryPerDay);

module.exports = router;
