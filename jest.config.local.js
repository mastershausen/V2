/**
 * Lokale Jest-Konfiguration für Tests ohne Setup-Datei
 * Dies erlaubt uns, einzelne Tests zu schreiben, die unabhängig von der globalen Konfiguration laufen
 */

/* eslint-env node */
'use strict';

const config = {
  preset: "jest-expo",
  // Keine setupFilesAfterEnv definiert, damit wir die globale Setup-Datei nicht verwenden
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};

module.exports = config; 