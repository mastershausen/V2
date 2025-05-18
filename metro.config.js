const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@features': path.resolve(__dirname, 'features'),
  '@shared-components': path.resolve(__dirname, 'shared-components'),
  '@services': path.resolve(__dirname, 'services'),
  '@hooks': path.resolve(__dirname, 'hooks'),
  '@contexts': path.resolve(__dirname, 'contexts')
};

module.exports = config;