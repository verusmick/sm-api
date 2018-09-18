var express = require('express');
var router = express.Router();
var productHandlers = require('../models/inventory.model');

/* GET users listing. */
router.get('/', productHandlers.getInventory);

module.exports = router;
