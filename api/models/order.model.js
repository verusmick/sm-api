/**
 * Created by Micky on 11/12/2018.
 */
const sanaMedicDB = require('../Database/sanaMedicDB')
const sicivDB = require('../Database/sicivDB')
var _ = require('lodash');
const moment = require('moment');

exports.getAll = (req, res, next) => {
  let query = `SELECT 
  orders.order_id AS orderId, 
  orders.client_cache_id AS clientId, 
  orders.user_id AS userId,
  orders.order_date AS orderDate,
  orders.delivery_date AS deliveryDate,
  orders.pay_type_id AS payType,
  orders.total AS total,
  orders.nit AS nit,
  orders.bill_name AS billName
  FROM orders`;

  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      let promises = [];
      results.forEach(product => {
        promises.push(getItems(product.orderId));
      });
      Promise.all(promises).then(collectionList => {
        results.forEach((product, index) => {
          product['items'] = collectionList[index];
        });
        res.json({status: "success", message: "orders list found!!!", data: results});
      })
    }
  })
}

exports.create = (req, res, next) => {
  let body = req.body, userId = req.headers.userid;
  createOrRefreshUser(body).then(_ => {
    let query = `INSERT INTO 
    orders (    
    client_cache_id, 
    user_id, 
    order_date, 
    delivery_date, 
    pay_type_id, 
    total, 
    nit, 
    bill_name) VALUES (
    '${body.clientId}',
     '${userId}', 
    '${moment().format('YYYY-MM-DD HH:mm:ss')}',NULL, 
    '${body.payType}', '${body.total}', '${body.nit}','${body.billName}')`;
    sanaMedicDB.query(query, (err, results) => {
      if (err) throw next(err);
      let promises = [];
      body.items.forEach(item => {
        promises.push(addItem(item, results.insertId));
      })
      Promise.all(promises).then(() => {
          res.json({status: "success", message: "Order added successfully!!!", data: null});
        }
      )
    })
  })
}

exports.getById = (req, res, next) => {
  let orderId = req.params.orderId;
  let query = `SELECT 
  orders.order_id AS orderId, 
  orders.client_cache_id AS clientId, 
  orders.user_id AS userId,
  orders.order_date AS orderDate,
  orders.delivery_date AS deliveryDate,
  orders.pay_type_id AS payType,
  orders.total AS total,
  orders.nit AS nit,
  orders.bill_name AS billName
  FROM orders WHERE orders.order_id = '${orderId}'`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) {
      next(err)
    } else {
      let promises = [];
      results.forEach(product => {
        promises.push(getItems(product.orderId));
      })
      Promise.all(promises).then(collectionList => {
        results.forEach((product, index) => {
          product['items'] = collectionList[index];
        })
        if (results.length > 0) {
          res.json({status: "success", message: "Order Found!!", data: results});
        } else {
          res.json({status: "error", message: "Order not Found!!", data: []});
        }

      })
    }
  })
}

exports.deleteById = (req, res, next) => {
  let orderId = req.params.orderId;
  deleteItems(orderId).then(_ => {
    let query = `DELETE FROM orders WHERE order_id = "${req.params.orderId}"`;
    sanaMedicDB.query(query, function (err, results) {
      if (err)
        next(err);
      else {
        res.json({
          status: "success",
          message: "Order deleted successfully!!!",
          data: null
        });
      }
    })
  })
}

exports.updateById = (req, res, next) => {
  let body = req.body, userId = req.headers.userid;
  let deliveryDate= !body.deliveryDate? null:`'${body.deliveryDate}'`
  let query = `UPDATE orders SET
  client_cache_id = '${body.clientId}', 
  user_id = '${userId}',   
  delivery_date = ${deliveryDate}, 
  pay_type_id = '${body.payType}', 
  total = '${body.total}', 
  nit = '${body.nit}', 
  bill_name = '${body.billName}'   
  WHERE orders.order_id = ${body.orderId}`;
  sanaMedicDB.query(query, (err, results) => {
    let promises = [];
    body.items.forEach(item => {
      promises.push(updateItem(item));
    })
    Promise.all(promises).then(() => {
        res.json({status: "success", message: "Order updated successfully!!!", data: null});
      }
    )
  })
}

function getItems(orderId) {
  return new Promise((resolve, reject) => {
    let query = `SELECT
    orders_detail.orders_detail_id AS orderDetailId,
    orders_detail.order_id AS orderId,
    orders_detail.product_id AS productId,
    orders_detail.quantity AS quantity,
    orders_detail.sub_total AS subTotal
   FROM orders_detail WHERE orders_detail.order_id = '${orderId}'`;
    sanaMedicDB.query(query, function (err, results) {
      resolve(results)
    })
  })
}

function addItem(item, orderId) {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO orders_detail (     
    order_id, 
    product_id, 
    quantity, 
    sub_total) 
    VALUES ('${orderId}', '${item.productId}', '${item.quantity}', '${item.subTotal}')`;
    sanaMedicDB.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    })
  });
}

function createOrRefreshUser(userData) {
  return new Promise((resolve, reject) => {
    getCacheClient(userData.clientId).then(result => {
      if (result.length === 0) {
        createCacheClient(userData).then(_ => {
          resolve();
        });
      } else {
        resolve();
      }
    })
  })
}

// function updateCacheClient(userData) {
//   let queryBill = userData.billName ? `bill_name = '${userData.billName}'` : '';
//   let queryNit = userData.nit? ` ${queryBill?',':''}nit = '${userData.nit}'`:'';
//   return new Promise((resolve, reject) => {
//     if(!queryBill || !queryNit){
//       resolve();
//     }
//     let query = `UPDATE cache_clients
//     SET
//     ${queryBill}
//     ${queryNit}
//     WHERE cache_clients.id_cliente = ${userData.clientId}`;
//     sanaMedicDB.query(query, (err, results) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(results);
//       }
//     })
//   });
// }

function createCacheClient(userData) {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO cache_clients (
    id_cliente, 
    address,
    latitude,
    longitude,
    nit,
    bill_name)
    VALUES ('${userData.clientId}', NULL, NULL, NULL, NULL, NULL)`;
    sanaMedicDB.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    })
  });
}

function getCacheClient(clientId) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM cache_clients WHERE id_cliente = '${clientId}'`;
    sanaMedicDB.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    })
  });
}

function deleteItems(orderId) {
  return new Promise((resolve, reject) => {
    let query = `DELETE FROM orders_detail WHERE order_id = '${orderId}'`;
    sanaMedicDB.query(query, function (err, results) {
      if (err)
        reject(err);
      else {
        resolve(results)
      }
    })
  })
}

function updateItem(item) {
  return new Promise((resolve, reject) => {
    let query = `UPDATE orders_detail SET
     order_id = '${item.orderId}',
     product_id = '${item.productId}', 
     quantity = '${item.quantity}',
     sub_total = '${item.subTotal}'
     WHERE orders_detail.orders_detail_id = ${item.orderDetailId}`;
    sanaMedicDB.query(query, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    })
  })
}

