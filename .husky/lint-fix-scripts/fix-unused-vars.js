#!/usr/bin/env node

/**
 * Script zur automatischen Entfernung ungenutzter Variablen
 * 
 * Dieses Script analysiert die von ESLint identifizierten ungenutzten Variablen
 * und entfernt sie automatisch, um Linter-Fehler zu vermeiden.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Konfiguration
const CONFIG = {
  dryRun: false,          // Wenn true, werden keine Änderungen geschrieben
  debug: false,           // Ausführliche Logging-Ausgaben 
  makeBackups: false,     // Sicherungskopien erstellen
  autoCommit: false       // Automatisch Änderungen committen
};

// Logger-Funktion
function log(message, isDebug = false) {
  if (isDebug && !CONFIG.debug) return;
  console.log(message);
}

// Ausführung eines ESLint-Befehls und Extraktion der Ergebnisse
function runESLintForUnusedVars(targetFiles) {
  try {
    // ESLint-Befehl ausführen und das JSON-Format für die Ausgabe verwenden
    // Wir verwenden die vorhandene ESLint-Konfiguration und filtern nach unused-vars
    const filePaths = targetFiles.map(file => `"${file}"`).join(' ');
    const eslintCommand = `npx eslint --format json ${filePaths}`;
    log(`Ausführung: ${eslintCommand}`, true);
    
    const result = spawnSync('npx', ['eslint', '--format', 'json', ...targetFiles], { 
      encoding: 'utf8',
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    if (result.error) {
      throw new Error(`ESLint-Fehler: ${result.error.message}`);
    }
    
    // Spezialfall: Wenn ESLint mit Exit-Code > 0 beendet wird, ist das normal, weil es Fehler gibt
    const output = result.stdout;
    let results;
    
    try {
      results = JSON.parse(output);
    } catch (e) {
      log(`Konnte ESLint-Ausgabe nicht parsen: ${output}`, true);
      log(`Stderr: ${result.stderr}`, true);
      return [];
    }
    
    // Filtern nach ungenutzten Variablen
    return results
      .filter(result => result.messages && result.messages.length > 0)
      .map(result => {
        const filePath = result.filePath;
        const unusedVarsMessages = result.messages.filter(
          message => message.ruleId === '@typescript-eslint/no-unused-vars'
        );
        
        // Wenn die Datei ungenutzte Variablen enthält
        if (unusedVarsMessages.length > 0) {
          log(`Gefunden: ${unusedVarsMessages.length} ungenutzte Variablen in ${filePath}`, true);
          
          // Extrahierte Informationen zu den ungenutzten Variablen
          return {
            filePath,
            unusedVars: unusedVarsMessages.map(message => {
              const match = message.message.match(/'([^']+)'/);
              if (!match) {
                log(`Konnte Variablennamen nicht extrahieren: ${message.message}`, true);
                return null;
              }
              return {
                name: match[1],
                line: message.line,
                column: message.column
              };
            }).filter(Boolean) // Entferne null-Einträge
          };
        }
        return null;
    }).filter(Boolean); // Entferne null-Einträge
  } catch (error) {
    log(`Fehler bei ESLint-Ausführung: ${error.message}`);
    return [];
  }
}

// Entfernen einer ungenutzten Variable aus einem Import
function removeUnusedVarFromImport(content, unusedVar) {
  const lines = content.split('\n');
  const line = lines[unusedVar.line - 1]; // Zeilennummern beginnen bei 1, Arrays bei 0
  
  log(`Bearbeite Zeile: ${line}`, true);
  
  // Überprüfen, ob es sich um einen Import handelt
  if (!line.includes('import')) {
    log(`Überspringe: Keine Import-Anweisung gefunden`, true);
    return content;
  }
  
  // Importierte Variablen extrahieren
  const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
  if (!importMatch) {
    log(`Überspringe: Kein gültiges Import-Format gefunden`, true);
    return content;
  }
  
  const importedVars = importMatch[1].split(',').map(v => v.trim());
  const varIndex = importedVars.findIndex(v => v === unusedVar.name);
  
  if (varIndex === -1) {
    // Falls der exakte Name nicht gefunden wird, überprüfen wir auf Aliase (z.B. "AuthStatus as OldAuthStatus")
    const aliasMatch = importedVars.findIndex(v => v.startsWith(`${unusedVar.name} as `) || v.endsWith(` as ${unusedVar.name}`));
    if (aliasMatch === -1) {
      log(`Variable ${unusedVar.name} nicht im Import gefunden`, true);
      return content;
    } else {
      log(`Alias für ${unusedVar.name} gefunden: ${importedVars[aliasMatch]}`, true);
      varIndex = aliasMatch;
    }
  }
  
  // Variable aus dem Import entfernen
  importedVars.splice(varIndex, 1);
  
  // Aktualisierte Import-Anweisung
  let newLine;
  if (importedVars.length === 0) {
    // Wenn keine Variablen übrig sind, den ganzen Import entfernen
    log(`Entferne vollständig: ${line}`, true);
    lines[unusedVar.line - 1] = '';
  } else {
    // Sonst nur die Variable entfernen
    newLine = line.replace(importMatch[1], importedVars.join(', '));
    log(`Aktualisiere zu: ${newLine}`, true);
    lines[unusedVar.line - 1] = newLine;
  }
  
  return lines.join('\n');
}

// Ungenutzte Variablen in einer Datei korrigieren
function fixUnusedVarsInFile(fileInfo) {
  const { filePath, unusedVars } = fileInfo;
  
  try {
    // Dateiinhalt lesen
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backup erstellen
    if (CONFIG.makeBackups) {
      fs.writeFileSync(`${filePath}.bak`, content, 'utf8');
    }
    
    // Alle ungenutzten Variablen in umgekehrter Reihenfolge entfernen (um Zeilennummern-Probleme zu vermeiden)
    const sortedVars = [...unusedVars].sort((a, b) => b.line - a.line);
    
    for (const unusedVar of sortedVars) {
      content = removeUnusedVarFromImport(content, unusedVar);
    }
    
    // Datei speichern, wenn nicht im Dry-Run-Modus
    if (!CONFIG.dryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
      log(`✅ Datei aktualisiert: ${filePath}`);
    } else {
      log(`🔍 [DRY RUN] Würde Datei aktualisieren: ${filePath}`);
    }
    
    return true;
  } catch (error) {
    log(`❌ Fehler beim Verarbeiten von ${filePath}: ${error.message}`);
    return false;
  }
}

// Hauptfunktion
async function main() {
  // Überprüfen, ob Dateien als Argumente übergeben wurden
  const targetFiles = process.argv.slice(2);
  
  if (targetFiles.length === 0) {
    log('Keine Dateien angegeben. Verwendung: node fix-unused-vars.js datei1.ts datei2.ts ...');
    return;
  }
  
  log(`🔍 Analysiere ungenutzte Variablen in ${targetFiles.length} Dateien...`);
  const filesWithUnusedVars = runESLintForUnusedVars(targetFiles);
  
  if (filesWithUnusedVars.length === 0) {
    log('✨ Keine ungenutzten Variablen gefunden.');
    return;
  }
  
  log(`🔧 ${filesWithUnusedVars.length} Dateien mit ungenutzten Variablen gefunden. Starte Korrektur...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const fileInfo of filesWithUnusedVars) {
    const success = fixUnusedVarsInFile(fileInfo);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  log('\n📊 Zusammenfassung:');
  log(`✅ ${successCount} Dateien erfolgreich aktualisiert`);
  log(`❌ ${errorCount} Dateien mit Fehlern`);
  
  // Automatisches Committen, falls aktiviert
  if (CONFIG.autoCommit && !CONFIG.dryRun && successCount > 0) {
    try {
      execSync('git add --update', { encoding: 'utf8' });
      execSync('git commit -m "fix: Entferne ungenutzte Variablen"', { encoding: 'utf8' });
      log('🎉 Änderungen wurden automatisch committet.');
    } catch (error) {
      log(`⚠️ Automatisches Committen fehlgeschlagen: ${error.message}`);
    }
  }
  
  log('🎉 Fertig!');
}

// Script ausführen
main().catch(error => {
  console.error('Unerwarteter Fehler:', error);
  process.exit(1);
}); 