// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

// Get the default configuration for your Expo project
const config = getDefaultConfig(__dirname);

// Add the .bin file extension to the list of assets Metro should handle
config.resolver.assetExts.push('bin'); 

module.exports = config;