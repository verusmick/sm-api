var express = require('express');
var router = express.Router();
var rolesHandlers = require('../models/roles.model.js');

/* GET users listing. */
router.get('/', rolesHandlers.getAll);

module.exports = router;
