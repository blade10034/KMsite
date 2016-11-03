var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var http = require('http');
var multer = require('multer');
var isAuth = require('./Util/isAuth.js');

var routes = require('./routes/index');
var events = require('./routes/events');
var sermons = require('./routes/sermons');
var gallery = require('./routes/gallery');
var announcement = require('./routes/announcement');
var fileRouter = require('./routes/files');
var range = require('express-range');

var app = express();
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var conn = mongoose.createConnection('localhost:27017/KmDb');
var db = conn.db;

conn.once('open', function(){
  var gfs = Grid(conn.db, mongoose.mongo);
  app.set('gridfs', gfs);
});

mongoose.connect('localhost:27017/KmDb');



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use(multer({
  dest: "./uploads/",
  onError: function (error, next) {
	  console.log(error)
	  next(error)
	}
}));

app.use(function(req, res, next) {
	if(req.cookies == undefined){
		res.cookie('language', 'English');
		req.cookies = {language: 'English'};
	}
	res.locals.language = req.cookies.language;
	next();
});

app.use(range({
  accept: 'bytes'
}));

app.use('/', routes);
app.use('/sermons', sermons);
app.use('/events', events);
app.use('/announcement', announcement);
app.use('/gallery', gallery);
app.use('/media', fileRouter);


var Account = require('./schema/account');
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
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error/error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
