const createError = require('http-errors');
const express = require('express');
require('./db/db');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const csurf = require('csurf');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const app = express();
const authRouter = require('./routes/api/v1/auth');
const feedRouter = require('./routes/api/v1/feed');
const postRouter = require('./routes/api/v1/post');
const userRouter = require('./routes/api/v1/user');
const commentRouter = require('./routes/api/v1/comment');

app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  preflightContinue: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(hpp());

// app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = {
  key: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 14 * 24 * 60 * 60 * 1000,
    secure: false,
  }, //14 days expiration
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'session'
  })
};


console.log('NODE_ENV =', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
  sessionOptions.cookie.httpOnly = true // serve secure cookies
}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', [feedRouter, authRouter, postRouter, userRouter, commentRouter]);
app.use(csurf());

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
  res.render('server-error', { title: 'Server Error' });
});

require('./config/passport')(passport);

module.exports = app;
