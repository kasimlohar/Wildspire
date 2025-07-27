const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'SESSION_SECRET',
  'CLOUD_NAME',
  'CLOUD_API_KEY',
  'CLOUD_API_SECRET',
  'MAP_TOKEN'
];

// Check for missing variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 8080,
  mongoUri: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  cloudinary: {
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.CLOUD_API_KEY,
    apiSecret: process.env.CLOUD_API_SECRET
  },
  mapbox: {
    token: process.env.MAP_TOKEN
  },
  isProduction: process.env.NODE_ENV === 'production'
};