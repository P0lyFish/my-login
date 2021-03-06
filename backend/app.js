var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer();
var redis = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var client = redis.createClient();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var faceLoginRouter = require('./routes/facelogin');
var bodyParser = require('body-parser');
var db = require('./database/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(upload.array()); 
// app.use(multer({ dest: '/tmp/' }).single('file'));
app.use(express.static('public'));

app.use(session({
  secret: 'ssshhhhh',
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
  saveUninitialized: false,
  resave: false
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/faceid', faceLoginRouter);

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

// testing

module.exports = app;


