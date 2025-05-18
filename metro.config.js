// Einfache Basiskonfiguration für Metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Einfache Erweiterung der Standardkonfiguration
config.resolver.assetExts.push('ttf');

// Aliase für den Import-Resolver
config.resolver.alias = {
  '@': path.resolve(__dirname),
  '@features': path.resolve(__dirname, 'features'),
  '@shared-components': path.resolve(__dirname, 'shared-components'),
  '@services': path.resolve(__dirname, 'services'),
  '@hooks': path.resolve(__dirname, 'hooks'),
  '@contexts': path.resolve(__dirname, 'contexts')
};

module.exports = config;