var express = require('express');
var router = express.Router();
var userHandlers = require('../models/users.model');

/* GET users listing. */
router.post('/', userHandlers.create);
router.post('/authenticate', userHandlers.authenticate);
router.get('/', userHandlers.getUsers);

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//
// module.exports = router;

module.exports = router;