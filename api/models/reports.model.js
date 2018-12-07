const sanaMedicDB = require('../Database/sanaMedicDB')
const sicivDB = require('../Database/sicivDB')
var _ = require('lodash');
exports.getStatusGpsPerSeller = (req, res, next) => {
  let since = req.query.since;
  let until = req.query.until;
  let userId = req.query.userId;
  let query = `SELECT
   track_detail.track_detail_id,
   track_detail.user_id,
   track_detail.timestamp,
   status_track.name AS 'status'
   FROM
   track_detail
   INNER JOIN
   status_track ON track_detail.status_track_id = status_track.status_track_id
   WHERE
   user_id = '${userId}' 
   AND TIMESTAMP BETWEEN '${since} 00:00:01' AND '${until} 23:59:59' ORDER BY track_detail.timestamp ASC`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      res.json({status: "success", message: "Report list found!!!", data: results});
    }
  })
}

exports.bestSellers = (req, res, next) => {
  let since = req.query.since;
  let until = req.query.until;
  let query = `SELECT * FROM 
  orders WHERE registered_date BETWEEN '${since} 00:00:01' AND '${until} 23:59:59'`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      res.json({status: "success", message: "Report list found!!!", data: results});
    }
  })
}

exports.getOrders = (req, res, next) => {
  let since = req.query.since;
  let until = req.query.until;
  let query = `SELECT 
  orders.order_id AS orderId, 
  orders.client_cache_id AS clientId, 
  orders.user_id AS userId,
  orders.order_date AS orderDate,
  orders.registered_date AS registeredDate,
  orders.pay_type_id AS payType,
  orders.total AS total,
  orders.nit AS nit,
  orders.bill_name AS billName
  FROM orders WHERE order_date BETWEEN '${since} 00:00:01' AND '${until} 23:59:59' ORDER BY orders.order_date ASC`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      let clientPromises = [];
      results.forEach(product => {
        clientPromises.push(getClientById(product.clientId))
      });
      Promise.all(clientPromises).then(clientsList => {
        results.forEach((product, index) => {
          product['client'] = clientsList[index].length > 0 ? clientsList[index][0] : {};
        });
        res.json({status: "success", message: "Report list found!!!", data: results});
      })
    }
  });
}

function getClientById(clientId) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM clientes WHERE id_cliente = '${clientId}'`;
    sicivDB.query(query, function (err, results) {
      if (err)
        reject(err);
      else {
        resolve(results)
      }
    })
  })
}