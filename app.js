var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  req.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err, status || 500);
	app.render('error');
});

module.exports = app;
