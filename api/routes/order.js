var express = require('express');
var router = express.Router();
var orderHandlers = require('../models/order.model.js');

/* GET users listing. */
router.get('/', orderHandlers.getAll);

module.exports = router;
