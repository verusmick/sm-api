var express = require('express');
var router = express.Router();
var employerHandlers = require('../models/employers.model.js');

/* GET users listing. */
router.get('/', employerHandlers.getEmployers);

module.exports = router;
