#!/usr/bin/env node

/**
 * Script zur Synchronisierung von UserType zwischen alten und neuen Definitionen
 * 
 * Dieses Script synchronisiert die Definitionen von UserType zwischen den alten
 * Typdefinitionen in @/types/userTypes und den neuen in @/features/auth/types.
 * Dadurch werden Kompatibilitätsprobleme in Tests und Legacy-Code vermieden.
 */

const fs = require('fs');
const path = require('path');

// Konfiguration für das Logging
const CONFIG = {
  enableLogging: true,
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  makeBackups: false // Keine Backups mehr erstellen
};

// Logger-Helfer
const logger = {
  debug: (message, ...args) => {
    if (CONFIG.enableLogging && CONFIG.logLevel === 'debug') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message, ...args) => {
    if (CONFIG.enableLogging && ['debug', 'info'].includes(CONFIG.logLevel)) {
      console.log(message, ...args);
    }
  },
  warn: (message, ...args) => {
    if (CONFIG.enableLogging && ['debug', 'info', 'warn'].includes(CONFIG.logLevel)) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    if (CONFIG.enableLogging) {
      console.error(`❌ ${message}`, ...args);
    }
  }
};

// Funktion zum Extrahieren der UserType-Werte aus dem neuen features/auth/types/index.ts
function extractNewUserTypeValues() {
  try {
    const featureAuthTypesPath = path.resolve(process.cwd(), 'features/auth/types/index.ts');
    
    if (!fs.existsSync(featureAuthTypesPath)) {
      logger.error('Neue Typdefinitionsdatei nicht gefunden: features/auth/types/index.ts');
      return null;
    }
    
    const content = fs.readFileSync(featureAuthTypesPath, 'utf8');
    
    // UserType Typdefinition extrahieren
    let userTypeMatch = content.match(/export type UserType = ([^;]+);/);
    if (!userTypeMatch) {
      userTypeMatch = content.match(/export type UserType =\s*(\{[^}]+\})/s);
    }
    
    if (!userTypeMatch) {
      logger.error('UserType-Definition in der neuen Datei nicht gefunden');
      return null;
    }
    
    // USER_TYPES-Objekt extrahieren
    const userTypesObjMatch = content.match(/export const USER_TYPES = {([^}]+)}/s);
    
    if (!userTypesObjMatch) {
      logger.error('USER_TYPES-Konstante in der neuen Datei nicht gefunden');
      return null;
    }
    
    return {
      typeDefinition: userTypeMatch[1].trim(),
      typesObject: userTypesObjMatch[1].trim()
    };
  } catch (error) {
    logger.error('Fehler beim Extrahieren der UserType-Definitionen:', error);
    return null;
  }
}

// Funktion zum Aktualisieren der alten UserType-Definitionen
function updateOldUserTypeDefinitions(newDefinitions) {
  try {
    // Pfade zu den alten Typdefinitionsdateien
    const oldUserTypesPath = path.resolve(process.cwd(), 'types/userTypes.ts');
    
    if (!fs.existsSync(oldUserTypesPath)) {
      logger.error('Alte Typdefinitionsdatei nicht gefunden: types/userTypes.ts');
      return false;
    }
    
    let content = fs.readFileSync(oldUserTypesPath, 'utf8');
    
    // Keine Backups mehr erstellen
    // fs.writeFileSync(`${oldUserTypesPath}.bak`, content, 'utf8');
    
    // UserType-Definition aktualisieren
    content = content.replace(
      /export type UserType = [^;]+;/,
      `export type UserType = ${newDefinitions.typeDefinition};`
    );
    
    // USER_TYPES-Objekt aktualisieren
    content = content.replace(
      /export const USER_TYPES = {[^}]+}/s,
      `export const USER_TYPES = {${newDefinitions.typesObject}}`
    );
    
    // Datei speichern
    fs.writeFileSync(oldUserTypesPath, content, 'utf8');
    logger.info('✅ Alte UserType-Definitionen aktualisiert in:', oldUserTypesPath);
    
    return true;
  } catch (error) {
    logger.error('Fehler beim Aktualisieren der alten UserType-Definitionen:', error);
    return false;
  }
}

// Funktion zum Aktualisieren der User-Definition in types/auth/userTypes.ts
function updateUserDefinition() {
  try {
    const authUserTypesPath = path.resolve(process.cwd(), 'types/auth/userTypes.ts');
    
    if (!fs.existsSync(authUserTypesPath)) {
      logger.warn('Datei nicht gefunden: types/auth/userTypes.ts');
      return false;
    }
    
    let content = fs.readFileSync(authUserTypesPath, 'utf8');
    
    // Backup nur erstellen, wenn in der Konfiguration aktiviert
    if (CONFIG.makeBackups) {
      fs.writeFileSync(`${authUserTypesPath}.bak`, content, 'utf8');
    }
    
    // Füge Import von UserType aus den neuen Features hinzu
    if (!content.includes("import { UserType } from '@/features/auth/types';")) {
      content = `import { UserType } from '@/features/auth/types';\n${content}`;
    }
    
    // Aktualisiere User-Interface, damit es UserType aus features verwendet
    content = content.replace(
      /type: string;/,
      'type: UserType;'
    );
    
    // Datei speichern
    fs.writeFileSync(authUserTypesPath, content, 'utf8');
    logger.info('✅ User-Interface aktualisiert in:', authUserTypesPath);
    
    return true;
  } catch (error) {
    logger.error('Fehler beim Aktualisieren der User-Definition:', error);
    return false;
  }
}

// Hauptfunktion
function main() {
  logger.info('🔄 Synchronisiere UserType-Definitionen zwischen alten und neuen Typquellen...');
  
  const newDefinitions = extractNewUserTypeValues();
  
  if (!newDefinitions) {
    logger.error('Synchronisierung fehlgeschlagen: Konnte neue Definitionen nicht extrahieren');
    process.exit(1);
  }
  
  const updateResult = updateOldUserTypeDefinitions(newDefinitions);
  if (!updateResult) {
    logger.error('Synchronisierung fehlgeschlagen: Konnte alte Definitionen nicht aktualisieren');
    process.exit(1);
  }
  
  const userDefResult = updateUserDefinition();
  
  logger.info('\n📊 Zusammenfassung:');
  logger.info('✅ Neue Definitionen extrahiert');
  logger.info(`${updateResult ? '✅' : '❌'} Alte UserType-Definitionen aktualisiert`);
  logger.info(`${userDefResult ? '✅' : '⚠️'} User-Interface aktualisiert`);
  logger.info('🎉 UserType-Synchronisierung abgeschlossen!');
}

// Script ausführen
main(); 