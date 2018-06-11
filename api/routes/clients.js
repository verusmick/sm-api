var express = require('express');
var router = express.Router();
var clientHandlers = require('../models/clients.model.js');

/* GET users listing. */
router.get('/', clientHandlers.getClients);

module.exports = router;
