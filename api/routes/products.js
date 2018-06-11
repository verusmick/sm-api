var express = require('express');
var router = express.Router();
var productHandlers = require('../models/products.model');

/* GET users listing. */
router.get('/', productHandlers.getProducts);

module.exports = router;
