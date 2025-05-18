#!/usr/bin/env node

/**
 * Feature-Flag-Audit-Script
 * 
 * Dieses Script prüft alle Feature-Flags auf abgelaufene Flags und gibt eine 
 * Übersicht des Status aller Flags zurück. Es kann in CI/CD-Pipelines verwendet 
 * werden, um auf veraltete Flags hinzuweisen.
 * 
 * Verwendung:
 * - `node scripts/flag-audit.js` - Prüft alle Flags und gibt eine Übersicht aus
 * - `node scripts/flag-audit.js --strict` - Schlägt fehl, wenn abgelaufene Flags gefunden werden
 * - `node scripts/flag-audit.js --check-usage` - Warnt auch bei Flags ohne Nutzung
 * 
 * Exit-Codes:
 * - 0: Alles in Ordnung
 * - 1: Abgelaufene Flags gefunden (nur im strict-Modus)
 * - 2: Fehler bei der Ausführung
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parameter auswerten
const args = process.argv.slice(2);
const STRICT_MODE = args.includes('--strict');
const CHECK_USAGE = args.includes('--check-usage');

/**
 * Prüft, ob ein Datum abgelaufen ist
 * @param dateString
 */
function isDateExpired(dateString) {
  if (!dateString) return false;
  try {
    return new Date(dateString) < new Date();
  } catch (e) {
    console.error(`Ungültiges Datum: ${dateString}`);
    return false;
  }
}

/**
 * Führt das Audit der Feature-Flags durch
 */
async function auditFeatureFlags() {
  try {
    // Pfad zur Feature-Flag-Definition
    const featuresPath = path.resolve(__dirname, '../config/features/index.ts');
    
    // Prüfen, ob die Datei existiert
    if (!fs.existsSync(featuresPath)) {
      console.error(`❌ Fehler: Feature-Flag-Datei nicht gefunden: ${featuresPath}`);
      process.exit(2);
    }
    
    // Datei als String einlesen
    const fileContent = fs.readFileSync(featuresPath, 'utf-8');
    
    // featureConfigs-Objekt aus dem Code extrahieren
    const configRegex = /const\s+featureConfigs\s*=\s*({[\s\S]*?});/;
    const configMatch = fileContent.match(configRegex);
    
    if (!configMatch || !configMatch[1]) {
      console.error('❌ Fehler: Konnte featureConfigs nicht aus der Datei extrahieren');
      process.exit(2);
    }
    
    // Das extrahierte Objekt in eine Zeichenkette umwandeln
    const configString = configMatch[1]
      .replace(/\/\/.*/g, '') // Kommentare entfernen
      .replace(/(\w+):/g, '"$1":') // Objektschlüssel in Anführungszeichen setzen
      .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}])/g, '"$1"$2') // Werte ohne Anführungszeichen in Anführungszeichen setzen
      .replace(/(\w+)'(\w+)'(\w+)/g, '$1"$2"$3') // Fallback für spezielle String-Formate
      .replace(/'/g, '"'); // Einfache Anführungszeichen in doppelte umwandeln
    
    // Versuchen, das Objekt zu parsen
    let featureConfigs;
    try {
      featureConfigs = JSON.parse(`{${configString}}`);
    } catch (error) {
      console.error('❌ Fehler beim Parsen des featureConfigs-Objekts:', error);
      console.error('String zum Parsen:', configString);
      process.exit(2);
    }
    
    // Ergebnisse sammeln
    const results = {
      totalFlags: 0,
      expiredFlags: 0,
      deprecatedFlags: 0,
      unusedFlags: 0,
      flagDetails: []
    };
    
    // Alle Flags durchgehen
    for (const [flagName, config] of Object.entries(featureConfigs)) {
      results.totalFlags++;
      
      const isExpired = isDateExpired(config.expiresAt);
      const isDeprecated = config.lifecycleStage === 'deprecated';
      const isUnused = CHECK_USAGE && (config.usageCount === 0 || config.usageCount === undefined);
      
      if (isExpired) results.expiredFlags++;
      if (isDeprecated) results.deprecatedFlags++;
      if (isUnused) results.unusedFlags++;
      
      results.flagDetails.push({
        name: flagName,
        expired: isExpired,
        deprecated: isDeprecated,
        unused: isUnused,
        expiresAt: config.expiresAt || 'Kein Ablaufdatum',
        owner: config.owner || 'Unbekannt',
        stage: config.lifecycleStage || 'Unbekannt',
        replacedBy: config.replacedBy || 'N/A'
      });
    }
    
    // Ergebnisse ausgeben
    console.log('\n📊 Feature-Flag-Audit-Ergebnisse:');
    console.log(`Insgesamt: ${results.totalFlags} Flags gefunden`);
    console.log(`Abgelaufen: ${results.expiredFlags} Flags`);
    console.log(`Veraltet: ${results.deprecatedFlags} Flags`);
    if (CHECK_USAGE) {
      console.log(`Ungenutzt: ${results.unusedFlags} Flags`);
    }
    console.log('\n');
    
    // Details zu problematischen Flags ausgeben
    const problematicFlags = results.flagDetails.filter(
      f => f.expired || f.deprecated || (CHECK_USAGE && f.unused)
    );
    
    if (problematicFlags.length > 0) {
      console.log('🚨 Problematische Flags:');
      problematicFlags.forEach(flag => {
        const warnings = [];
        if (flag.expired) warnings.push('ABGELAUFEN');
        if (flag.deprecated) warnings.push('VERALTET');
        if (flag.unused && CHECK_USAGE) warnings.push('UNGENUTZT');
        
        console.log(`- ${flag.name} [${warnings.join(', ')}]`);
        console.log(`  Ablaufdatum: ${flag.expiresAt}`);
        console.log(`  Verantwortlich: ${flag.owner}`);
        console.log(`  Status: ${flag.stage}`);
        if (flag.replacedBy !== 'N/A') {
          console.log(`  Ersetzt durch: ${flag.replacedBy}`);
        }
        console.log('');
      });
    }
    
    // Im strict-Modus fehlschlagen, wenn abgelaufene oder veraltete Flags gefunden wurden
    if (STRICT_MODE && (results.expiredFlags > 0 || results.deprecatedFlags > 0)) {
      console.error('❌ Fehler: Abgelaufene oder veraltete Feature-Flags gefunden!');
      console.error('   Bitte bereinigen Sie diese Flags oder aktualisieren Sie deren Ablaufdatum.');
      process.exit(1);
    }
    
    console.log('✅ Feature-Flag-Audit abgeschlossen');
    
  } catch (error) {
    console.error('❌ Unerwarteter Fehler:', error);
    process.exit(2);
  }
}

// Script ausführen
auditFeatureFlags(); 