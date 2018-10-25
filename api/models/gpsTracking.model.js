const express = require('express');
const app = express();
const sanaMedicDB = require('../Database/sanaMedicDB')
const moment = require('moment');

exports.postSellersTrack = function (req, res, next) {
  let coordinate ={
    userId: req.headers.userid,
    // latitude : req.headers.userid === '7029468'? -16.5007404:-16.5041343,
    latitude :req.body[0].latitude,
    // longitude: req.headers.userid === '7029468'? -68.1407600:-68.1354274,
    longitude: req.body[0].longitude,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
  } ;
  app.emit('changeLocation', JSON.stringify(coordinate));
  let query = `INSERT INTO coordinates (user_id, latitude, longitude, timestamp) 
  VALUES ('${coordinate.userId}','${coordinate.latitude}','${coordinate.longitude}','${moment().format('YYYY-MM-DD HH:mm:ss')}')`;
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

  app.on('changeLocation', data => {
    setMessage('changeLocation', data, null, res);
  });
}

function setMessage(event, data, id, res) {
  let setId = id ? `id:${id}\n` : '';
  res.write(
    setId+`event: ${event}\ndata:${data}`
  );
  res.write('\n\n');
}

exports.setTrackStatus = (req, res, next) => {
  let statusTrackId = req.params.value;
  let trackStatus = req.body;
  let query = `INSERT INTO track_detail (status_track_id, user_id, timestamp) 
  VALUES (${statusTrackId},'${trackStatus.userId}', '${moment().format('YYYY-MM-DD HH:mm:ss')}')`;
  sanaMedicDB.query(query, function (err, results) {
    if (err) throw next(err);
    return res.json(results)
  })
}