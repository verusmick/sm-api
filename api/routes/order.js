var express = require('express');
var router = express.Router();
var orderHandlers = require('../models/order.model.js');

/* GET users listing. */
router.get('/', orderHandlers.getAll);
router.post('/', orderHandlers.create);
router.get('/:orderId', orderHandlers.getById);
router.delete('/:orderId', orderHandlers.deleteById);
router.put('/:orderId', orderHandlers.updateById);

module.exports = router;
