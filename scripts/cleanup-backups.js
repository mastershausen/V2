#!/usr/bin/env node

/**
 * Script zum Löschen aller Backup-Dateien (*.bak)
 * 
 * Dieses Script entfernt alle .bak-Dateien, die während des
 * Refactoring-Prozesses erstellt wurden.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Konfiguration
const CONFIG = {
  dryRun: false,           // Wenn true, werden Dateien nicht wirklich gelöscht
  verbose: true,           // Ausführlichere Ausgaben 
  includePatterns: [       // Zu löschende Dateitypen
    '*.ts.bak',
    '*.tsx.bak',
    '*.js.bak'
  ],
  excludeDirs: [           // Zu ignorierende Verzeichnisse
    'node_modules',
    '.git',
    'dist',
    'build'
  ]
};

// Logger-Funktion
function log(message, isVerbose = false) {
  if (isVerbose && !CONFIG.verbose) return;
  console.log(message);
}

// Backup-Dateien finden
function findBackupFiles() {
  try {
    // Erstelle einen find-Befehl mit allen Mustern und Ausschlüssen
    const includeArgs = CONFIG.includePatterns
      .map(pattern => `-name "${pattern}"`)
      .join(' -o ');
    
    const excludeArgs = CONFIG.excludeDirs
      .map(dir => `-not -path "*/${dir}/*"`)
      .join(' ');
    
    const findCommand = `find . ${excludeArgs} \\( ${includeArgs} \\)`;
    log(`Ausführung: ${findCommand}`, true);
    
    const output = execSync(findCommand, { encoding: 'utf8' });
    const files = output.trim().split('\n').filter(Boolean);
    
    return files;
  } catch (error) {
    log(`Fehler beim Suchen der Backup-Dateien: ${error.message}`);
    return [];
  }
}

// Dateien löschen
function deleteFiles(files) {
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    try {
      log(`Lösche Datei: ${file}`);
      
      if (!CONFIG.dryRun) {
        fs.unlinkSync(file);
      } else {
        log(`[DRY RUN] Würde löschen: ${file}`);
      }
      
      successCount++;
    } catch (error) {
      log(`Fehler beim Löschen von ${file}: ${error.message}`);
      errorCount++;
    }
  }
  
  return { successCount, errorCount };
}

// Hauptfunktion
function main() {
  log('🔍 Suche nach Backup-Dateien...');
  const backupFiles = findBackupFiles();
  
  if (backupFiles.length === 0) {
    log('✨ Keine Backup-Dateien gefunden.');
    return;
  }
  
  log(`🧹 ${backupFiles.length} Backup-Dateien gefunden. Starte Bereinigung...`);
  
  const { successCount, errorCount } = deleteFiles(backupFiles);
  
  log('\n📊 Zusammenfassung:');
  log(`✅ ${successCount} Dateien erfolgreich ${CONFIG.dryRun ? 'markiert für Löschung' : 'gelöscht'}`);
  
  if (errorCount > 0) {
    log(`❌ ${errorCount} Dateien mit Fehlern`);
  }
  
  log('🎉 Fertig!');
}

// Script ausführen
main(); 