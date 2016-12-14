var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var http = require('http');
var multer = require('multer');
var isAuth = require('./api/Util/isAuth.js');
var events = require('./api/routes/events');
var sermons = require('./api/routes/sermons');
var gallery = require('./api/routes/gallery');
var announcement = require('./api/routes/announcement');
var fileRouter = require('./api/routes/files');
var range = require('express-range');
var app = express();
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var Account = require('./api/schema/account');

var conn = mongoose.createConnection('localhost:27017/KmDb');

conn.once('open', function(){
  var gfs = Grid(conn.db, mongoose.mongo);
  app.set('gridfs', gfs);
});

//mongoose.connect('localhost:27017/KmDb');

// Setup express routes
app.use(sermons);
app.use(events);
app.use(announcement);
app.use(gallery);
app.use(fileRouter);

//Setup multer file upload location and onError
multer({
  dest: "./uploads/",
  onError: function (error, next) {
	  console.log(error)
	  next(error)
	}
});

// Setup language cookie
app.use(function(req, res, next) {
	if(req.cookies == undefined){
		res.cookie('language', 'English');
		req.cookies = {language: 'English'};
	}
	res.locals.language = req.cookies.language;
	next();
});

//Handle Content-Range header
app.use(range({
  accept: 'bytes'
}));


// Authentication Layer
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error/error', {
            message: err.message,
            error: err
        });
    });
}else{
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error/error', {
          message: err.message,
          error: {}
      });
  });
}
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res, next) {
    res.sendFile('./public/index.html');
});

module.exports = app;
