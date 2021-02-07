import connectMongo from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
const path = require('path');

const MongoStore = connectMongo(session);
const env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
  require('dotenv').config({
    path: path.join(__dirname, '../../.env-dev')
  })
}

export default {
  server: {
    env,
    port: process.env.PORT || 9000,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  session: {
    key: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "none",
      httpOnly: env === 'dev' ? false : true
    }, //14 days expiration
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'session'
    })
  },
  cors: {
    origin: 'https://foodie.jgudo.vercel.app',
    credentials: true,
    preflightContinue: true
  },
  gCloudStorage: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLIACATION_CREDENTIALS
  }
}
