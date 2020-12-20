const createError = require('http-errors');
const express = require('express');
require('./db/db');
const path = require('path');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
var MongoStore = require('connect-mongo')(session);

const app = express();
const authRouter = require('./routes/api/v1/auth');

app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sessionOptions = {
  key: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { expires: 14 * 24 * 60 * 60 * 1000 }, //14 days expiration
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session'
  })
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', authRouter);
app.use('/', (req, res) => {
  res.send('Hoy gago');
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
