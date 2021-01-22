const path = require('path');
const env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
  require('dotenv').config({
    path: path.join(__dirname, '../.env-dev')
  })
}