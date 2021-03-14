import connectMongo from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';

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
      secure: env !== 'dev',
      sameSite: env === 'dev' ? 'strict' : 'none',
      httpOnly: env !== 'dev'
    }, //14 days expiration
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'session'
    })
  },
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    preflightContinue: true
  },
  gCloudStorage: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
}
