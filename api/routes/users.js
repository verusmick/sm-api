var express = require('express')
var router = express.Router()
var userHandlers = require('../models/users.model')
var jwt = require('jsonwebtoken')

router.post('/authenticate', userHandlers.authenticate)

router.get('/', validateUser, userHandlers.getAll)
router.post('/', validateUser, userHandlers.create)
router.get('/:userId', validateUser, userHandlers.getById)
// router.put('/:userId', validateUser, userHandlers.updateById) //todo: implement later
router.delete('/:userId', validateUser, userHandlers.deleteById)

// Token interceptor
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.status(403).json({status: "error", message: err.message, data: null});
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}
module.exports = router;