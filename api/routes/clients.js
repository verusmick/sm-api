var express = require('express');
var router = express.Router();
var userHandlers = require('../controllers/clients.cntrl.js');

/* GET users listing. */
router.get('/', userHandlers.getClients);

module.exports = router;
