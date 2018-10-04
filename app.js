var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./api/routes/index');
var usersRouter = require('./api/routes/users');
var clientsRouter = require('./api/routes/clients');
var rolesRouter = require('./api/routes/roles');
var employersRouter = require('./api/routes/employers');
var inventoryRouter = require('./api/routes/inventory');
var gpsTrackingRouter = require('./api/routes/gpsTracking');
var history = require('./api/routes/history');
var jwt = require('jsonwebtoken');
var cors = require('cors')


var app = express();

app.set('secretKey', 'sanamedicApi'); // jwt secret token

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/clients',validateUser, clientsRouter);
app.use('/roles',validateUser, rolesRouter);
app.use('/employers', validateUser, employersRouter);
app.use('/inventory',validateUser, inventoryRouter);
app.use('/gpsTracking', gpsTrackingRouter);
app.use('/history', validateUser, history);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
