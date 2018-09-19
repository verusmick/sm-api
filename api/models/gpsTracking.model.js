// const sanaMedicDB = require('../Database/sanaMedicDB')
const express = require('express');
const app = express();
const sanaMedicDB = require('../Database/sanaMedicDB')

exports.postSellersTrack = function (req, res, next) {
  let coordinate = req.body[0];
// console.log('coordinate')
// console.log(req)

  app.emit('coordinate', {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    timestamp: new Date()
  });

  let ts= parseInt(new Date());
  console.log(new Date())

  let query = `INSERT INTO coordinates (id_user, latitude, longitude, timestamp) VALUES ('7029468LP','${coordinate.latitude}','${coordinate.longitude}','${new Date(new Date()).getTime()}')`;
  console.log('query')
  console.log(query)
  sanaMedicDB.query(query, (err, results) => {
    if (err) throw next(err);
    res.json({status: "success", message: "coordinate added successfully!!!", data: null});
  })
}

exports.sellersTrackEvents = (req, res, next) => {
  // SSE Setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('\n');
  // sseDemo(req, res);
// console.log('---->on')
// console.log(app)
  /////
  let messageId = 7029468;
  app.on('coordinate', data => {
    res.write(`id: ${messageId}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}