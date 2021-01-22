const dotenv = require('dotenv');
const path = require('path');
const env = process.env.NODE_ENV || 'prod';

if (env === 'dev') {
  dotenv.config({ path: path.join(__dirname, '../.env-dev') });
}