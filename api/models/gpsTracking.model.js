const express = require('express');
const app = express();
const sanaMedicDB = require('../Database/sanaMedicDB');
const moment = require('moment');
const logs = require('../logs/logs.service');

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
    if (err){
      logs.write(req.headers.username, req.headers.ci, `Error al establecer el estado del GPS a: ${statusTrackId}`);
      throw next(err);
    }
    logs.write(req.headers.username, req.headers.ci, `Establecer el estado del GPS a: ${statusTrackId}`);
    return res.json({
      status: "success",
      message: "TrackStatus added successfully!!!",
      data: null
    })
  })
}

exports.gpsStatus = (req, res, next) => {
  let userId = req.params.userId;
  let query = `SELECT * FROM track_detail WHERE user_id = '${userId}' ORDER BY TIMESTAMP DESC LIMIT 1`;
  sanaMedicDB.query(query, function (err, results) {
    if (err){
      logs.write(req.headers.username, req.headers.ci, `Error en obtener la lista de estados del GPS por usuario.`);
      throw next(err);
    }
    if (results.length === 0) {
      return res.json({})
    }
    let parseObj = {
      status: results[0].status_track_id === 1 ? 'on' : 'off',
      userId: results[0].user_id,
      timestamp: results[0].timestamp
    };
    logs.write(req.headers.username, req.headers.ci, `Lista de estados del GPS por usuario.`);
    return res.json(parseObj)
  })
}