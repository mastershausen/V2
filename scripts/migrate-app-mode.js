#!/usr/bin/env node

/**
 * Migration Script für AppMode-Konstanten
 * 
 * Dieses Skript hilft bei der Migration von alten AppMode-Werten ('development', 'demo', 'live')
 * zu den neuen, kanonischen Werten ('DEVELOPMENT', 'DEMO', 'PRODUCTION').
 * 
 * Wichtig: Dieses Skript sollte nur als Unterstützung dienen, nicht als vollständige Lösung.
 * Überprüfe immer den Code nach der Ausführung auf korrekte Funktionalität.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Definieren der Mapping für alte zu neue Werte
const APP_MODE_MAPPING = {
  'development': 'DEVELOPMENT',
  'demo': 'DEMO',
  'live': 'PRODUCTION'
};

/**
 * Diese Dateiendungen werden durchsucht
 */
const TARGET_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

/**
 * Führt eine Suchoperation durch, um Dateien zu finden, die den alten AppMode-Wert enthalten
 * @param pattern
 */
function findFilesWithPattern(pattern) {
  try {
    // Führt den Grep-Befehl aus und gibt die Dateien zurück
    const command = `grep -r "${pattern}" --include="*.{ts,tsx,js,jsx}" . | cut -d':' -f1 | sort | uniq`;
    const output = execSync(command, { encoding: 'utf-8' });
    return output.trim().split('\n').filter(file => file);
  } catch (error) {
    // Bei einem Grep-Error (z.B. kein Treffer) geben wir ein leeres Array zurück
    return [];
  }
}

/**
 * Ersetzt im Text die alten AppMode-Werte durch neue, aber nur wenn sie in Anführungszeichen sind
 * @param content
 */
function replaceAppModeValues(content) {
  // Regex für 'value' oder "value" wo value einer der alten AppMode-Werte ist
  const appModeRegex = /(["'])([^"']*?)(development|demo|live)([^"']*?)\1/g;
  
  // Ersetzt mit dem neuen Wert nur wenn exakt übereinstimmend
  return content.replace(appModeRegex, (match, quote, prefix, mode, suffix) => {
    // Wenn es ein exakter Wert ist, ersetzen wir ihn
    if (prefix === '' && suffix === '' && APP_MODE_MAPPING[mode]) {
      return `${quote}${APP_MODE_MAPPING[mode]}${quote}`;
    }
    
    // Andernfalls behalten wir den Original-Treffer bei
    return match;
  });
}

/**
 * Aktualisiert eine Datei, indem sie die alten AppMode-Werte durch neue ersetzt
 * @param file
 */
function updateFile(file) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const updatedContent = replaceAppModeValues(content);
    
    // Nur schreiben, wenn sich der Inhalt geändert hat
    if (content !== updatedContent) {
      fs.writeFileSync(file, updatedContent, 'utf-8');
      console.log(`✅ Aktualisiert: ${file}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Fehler beim Aktualisieren von ${file}:`, error.message);
    return false;
  }
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🔄 Starte Migration der AppMode-Werte...');
  
  let updatedFiles = 0;
  
  // Für jeden alten AppMode-Wert
  for (const oldMode of Object.keys(APP_MODE_MAPPING)) {
    console.log(`🔍 Suche nach Dateien mit AppMode '${oldMode}'...`);
    const files = findFilesWithPattern(oldMode);
    
    if (files.length > 0) {
      console.log(`🧰 ${files.length} Dateien gefunden, die '${oldMode}' verwenden.`);
      
      for (const file of files) {
        const wasUpdated = updateFile(file);
        if (wasUpdated) updatedFiles++;
      }
    } else {
      console.log(`ℹ️ Keine Dateien gefunden, die '${oldMode}' verwenden.`);
    }
  }
  
  console.log(`\n✨ Migration abgeschlossen. ${updatedFiles} Dateien aktualisiert.`);
  console.log('⚠️ Denke daran, deinen Code zu testen und zu prüfen!');
}

// Starte das Skript
main(); 