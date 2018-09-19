// const sanaMedicDB = require('../Database/sanaMedicDB')
const express = require('express');
const app = express();

exports.postSellersTrack = function (req, res) {
  let coordinate = req.body[0];
  app.emit('coordinate', {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    timestamp: new Date()
  });
  res.json({status: "success", message: "coordinate added successfully!!!", data: null});
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