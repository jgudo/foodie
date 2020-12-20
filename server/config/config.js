const dotenv = require('dotenv');
const path = require('path');
const env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
  dotenv.config({ path: path.join(__dirname, '../.env-dev') });
} else {
  dotenv.config({ path: path.join(__dirname, '../.env-prod') });
}