#!/usr/bin/env node

/**
 * Feature-Flag-Cleanup-Script
 * 
 * Dieses Script identifiziert abgelaufene Feature-Flags, erstellt Codeänderungen 
 * zur Entfernung und generiert Pull Requests.
 * 
 * Funktionsweise:
 * 1. Identifiziert abgelaufene Feature-Flags mit dem Flag-Audit
 * 2. Sucht alle Verwendungen dieser Flags im Code
 * 3. Ersetzt Feature-Flag-Aufrufe durch ihren aktuellen Wert oder durch Ersatz-Flags
 * 4. Erzeugt einen Branch und erstellt einen Pull Request
 * 
 * Verwendung:
 * - `node scripts/flag-cleanup.js` - Prüft Flags und schlägt Änderungen vor (ohne tatsächlichen PR)
 * - `node scripts/flag-cleanup.js --create-pr` - Erstellt tatsächlich PRs für abgelaufene Flags
 * - `node scripts/flag-cleanup.js --flag=FLAG_NAME` - Nur ein spezifisches Flag bearbeiten
 * 
 * Abhängigkeiten (müssen installiert sein):
 * - jscodeshift: `npm install -g jscodeshift` oder als devDependency
 * - @octokit/rest: für GitHub API
 * - simple-git: für Git-Operationen
 */

import { Octokit } from "@octokit/rest";
import { execSync } from 'child_process';
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI-Argumente verarbeiten
program
  .option('--create-pr', 'Tatsächlich PRs erstellen (Standard: Nur simulieren)')
  .option('--flag <flag>', 'Nur ein bestimmtes Flag bearbeiten')
  .option('--dry-run', 'Keine Änderungen vornehmen, nur ausgeben was gemacht werden würde')
  .parse(process.argv);

const options = program.opts();
const DRY_RUN = options.dryRun || !options.createPr;
const SPECIFIC_FLAG = options.flag;

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
 * Extrahiert Feature-Flag-Konfigurationen aus der TypeScript-Datei
 */
function extractFeatureConfigs() {
  // Pfad zur Feature-Flag-Definition
  const featuresPath = path.resolve(__dirname, '../config/features/index.ts');
  
  if (!fs.existsSync(featuresPath)) {
    console.error(`❌ Fehler: Feature-Flag-Datei nicht gefunden: ${featuresPath}`);
    process.exit(1);
  }
  
  // Datei als String einlesen
  const fileContent = fs.readFileSync(featuresPath, 'utf-8');
  
  // featureConfigs-Objekt aus dem Code extrahieren
  const configRegex = /const\s+featureConfigs\s*=\s*({[\s\S]*?});/;
  const configMatch = fileContent.match(configRegex);
  
  if (!configMatch || !configMatch[1]) {
    console.error('❌ Fehler: Konnte featureConfigs nicht aus der Datei extrahieren');
    process.exit(1);
  }
  
  // Feature-Flag-Typen extrahieren
  const flagTypeRegex = /export\s+type\s+FeatureFlag\s*=\s*\n?([\s\S]*?);/;
  const flagTypeMatch = fileContent.match(flagTypeRegex);
  
  if (!flagTypeMatch || !flagTypeMatch[1]) {
    console.error('❌ Fehler: Konnte FeatureFlag-Typen nicht aus der Datei extrahieren');
    process.exit(1);
  }
  
  // Einzelne Flags aus dem Typen extrahieren
  const flagRegex = /'([A-Z_]+)'/g;
  const flags = [];
  let match;
  
  while ((match = flagRegex.exec(flagTypeMatch[1])) !== null) {
    flags.push(match[1]);
  }
  
  // Das extrahierte Objekt in eine Zeichenkette umwandeln (vereinfachte Version)
  // Hier könnten wir Logik aus flag-audit.js wiederverwenden
  
  // Vereinfachtes Parsing über Mustererkennung
  const result = {};
  
  flags.forEach(flag => {
    const flagRegex = new RegExp(`${flag}:\\s*{([\\s\\S]*?)}`, 'g');
    const flagMatch = flagRegex.exec(configMatch[1]);
    
    if (flagMatch && flagMatch[1]) {
      const configText = flagMatch[1];
      
      // Einfaches Pattern-Matching für wichtige Eigenschaften
      const expiresAtMatch = /expiresAt:\s*['"](.+?)['"]/g.exec(configText);
      const ownerMatch = /owner:\s*['"](.+?)['"]/g.exec(configText);
      const lifecycleStageMatch = /lifecycleStage:\s*['"](.+?)['"]/g.exec(configText);
      const replacedByMatch = /replacedBy:\s*['"](.+?)['"]/g.exec(configText);
      const enabledInProdMatch = /enabledInProduction:\s*(true|false)/g.exec(configText);
      
      result[flag] = {
        expiresAt: expiresAtMatch ? expiresAtMatch[1] : undefined,
        owner: ownerMatch ? ownerMatch[1] : 'Unbekannt',
        lifecycleStage: lifecycleStageMatch ? lifecycleStageMatch[1] : 'stable',
        replacedBy: replacedByMatch ? replacedByMatch[1] : undefined,
        enabledInProduction: enabledInProdMatch ? enabledInProdMatch[1] === 'true' : false
      };
    }
  });
  
  return result;
}

/**
 * Findet alle abgelaufenen Feature-Flags
 */
function findExpiredFlags() {
  const configs = extractFeatureConfigs();
  const expiredFlags = {};
  
  Object.keys(configs).forEach(flag => {
    if (SPECIFIC_FLAG && flag !== SPECIFIC_FLAG) {
      return; // Überspringen, wenn nicht das spezifizierte Flag
    }
    
    if (isDateExpired(configs[flag].expiresAt) || 
        configs[flag].lifecycleStage === 'deprecated') {
      expiredFlags[flag] = configs[flag];
    }
  });
  
  return expiredFlags;
}

/**
 * Findet alle Verwendungen eines Feature-Flags im Code
 * @param flag
 */
function findFlagUsages(flag) {
  try {
    // Verwende grep, um alle Vorkommen im Code zu finden
    const grepCommand = `grep -r "isEnabled(\\'${flag}\\'" --include="*.ts" --include="*.tsx" src features app`;
    const result = execSync(grepCommand, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    return result.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const [filePath, ...contentParts] = line.split(':');
        const content = contentParts.join(':');
        return { filePath, content };
      });
  } catch (error) {
    // grep gibt Exit-Code 1 zurück, wenn nichts gefunden wurde
    if (error.status === 1) {
      return [];
    }
    console.error(`Fehler beim Suchen von ${flag}:`, error);
    return [];
  }
}

/**
 * Ersetzt einen Feature-Flag-Aufruf durch einen festen Wert oder ein Ersatz-Flag
 * @param filePath
 * @param flag
 * @param replacement
 * @param isReplacementFlag
 */
function replaceFeatureFlagInFile(filePath, flag, replacement, isReplacementFlag = false) {
  if (DRY_RUN) {
    console.log(`Würde in ${filePath} ersetzen: isEnabled('${flag}') -> ${isReplacementFlag ? `isEnabled('${replacement}')` : replacement}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Verschiedene Muster für die Verwendung von isEnabled
  const patterns = [
    // Standard-Verwendung: FeatureFlags.isEnabled('FLAG')
    new RegExp(`FeatureFlags\\.isEnabled\\(\\s*['"]${flag}['"]\\s*\\)`, 'g'),
    // Mit zweitem Parameter: FeatureFlags.isEnabled('FLAG', { screenName: '...' })
    new RegExp(`FeatureFlags\\.isEnabled\\(\\s*['"]${flag}['"]\\s*,\\s*\\{[^}]*\\}\\s*\\)`, 'g'),
    // Variable mit destructuring: const { isEnabled } = FeatureFlags; isEnabled('FLAG')
    new RegExp(`isEnabled\\(\\s*['"]${flag}['"]\\s*\\)`, 'g'),
    // Mit zweitem Parameter nach Destrukturierung: isEnabled('FLAG', { screenName: '...' })
    new RegExp(`isEnabled\\(\\s*['"]${flag}['"]\\s*,\\s*\\{[^}]*\\}\\s*\\)`, 'g')
  ];
  
  // Ersetze alle Vorkommen
  patterns.forEach(pattern => {
    if (isReplacementFlag) {
      // Ersetze Flag durch einen anderen Flag-Namen
      content = content.replace(pattern, match => {
        // Ersetze nur den Flag-Namen, behalte alle Parameter bei
        return match.replace(`'${flag}'`, `'${replacement}'`).replace(`"${flag}"`, `"${replacement}"`);
      });
    } else {
      // Ersetze durch einen festen Wert (true/false)
      content = content.replace(pattern, replacement);
    }
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Ersetzt in ${filePath}: isEnabled('${flag}') -> ${isReplacementFlag ? `isEnabled('${replacement}')` : replacement}`);
}

/**
 * Entfernt ein Feature-Flag aus der Konfiguration
 * @param flag
 */
function removeFeatureFlagFromConfig(flag) {
  if (DRY_RUN) {
    console.log(`Würde ${flag} aus der Feature-Flag-Konfiguration entfernen`);
    return;
  }
  
  const featuresPath = path.resolve(__dirname, '../config/features/index.ts');
  let content = fs.readFileSync(featuresPath, 'utf-8');
  
  // Entferne das Flag aus dem FeatureFlag-Typ
  // Achtung: Dies ist eine vereinfachte Implementierung, die in komplexeren Fällen
  // möglicherweise nicht funktioniert. Für robustere Lösungen sollten AST-Parser verwendet werden.
  const flagTypeRegex = new RegExp(`\\s*\\| '${flag}'\\s*// .*?\\n`, 'g');
  content = content.replace(flagTypeRegex, '\n');
  
  // Entferne das Flag aus dem featureConfigs-Objekt
  const configRegex = new RegExp(`${flag}: \\{[\\s\\S]*?\\},?\\n`, 'g');
  content = content.replace(configRegex, '');
  
  fs.writeFileSync(featuresPath, content, 'utf-8');
  console.log(`✅ ${flag} aus der Feature-Flag-Konfiguration entfernt`);
}

/**
 * Erstellt einen Branch für die Änderungen
 * @param flag
 */
function createBranch(flag) {
  if (DRY_RUN) {
    console.log(`Würde Branch 'feature/remove-flag-${flag.toLowerCase()}' erstellen`);
    return `feature/remove-flag-${flag.toLowerCase()}`;
  }
  
  const branchName = `feature/remove-flag-${flag.toLowerCase()}`;
  
  try {
    // Stelle sicher, dass wir auf dem aktuellen main/master-Branch sind
    execSync('git checkout main || git checkout master', { stdio: 'ignore' });
    
    // Erstelle und wechsle zu einem neuen Branch
    execSync(`git checkout -b ${branchName}`, { stdio: 'ignore' });
    
    console.log(`✅ Branch '${branchName}' erstellt`);
    return branchName;
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen des Branches:`, error);
    process.exit(1);
  }
}

/**
 * Commitet die Änderungen
 * @param flag
 */
function commitChanges(flag) {
  if (DRY_RUN) {
    console.log(`Würde Änderungen für Feature-Flag ${flag} committen`);
    return;
  }
  
  try {
    execSync('git add .', { stdio: 'ignore' });
    
    const commitMessage = `refactor: Entferne abgelaufenes Feature-Flag ${flag}

Dieses Feature-Flag ist abgelaufen und wird nicht mehr benötigt.
Die Änderung wurde automatisch durch das flag-cleanup-Script generiert.`;
    
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });
    
    console.log(`✅ Änderungen für Feature-Flag ${flag} committed`);
  } catch (error) {
    console.error(`❌ Fehler beim Committen der Änderungen:`, error);
    process.exit(1);
  }
}

/**
 * Pusht den Branch und erstellt einen Pull Request
 * Hinweis: Dies würde in einer vollständigen Implementierung
 * GitHub API über @octokit/rest verwenden
 * @param branchName
 * @param flag
 * @param config
 */
function createPullRequest(branchName, flag, config) {
  if (DRY_RUN) {
    console.log(`Würde Pull Request für Branch ${branchName} erstellen`);
    return;
  }
  
  try {
    // Branch pushen
    execSync(`git push -u origin ${branchName}`, { stdio: 'ignore' });
    
    console.log(`✅ Branch ${branchName} gepusht`);
    
    // Hier würde die GitHub API verwendet werden, um einen PR zu erstellen
    console.log(`
ℹ️ Für eine vollständige Implementierung der PR-Erstellung:
1. Installiere @octokit/rest: npm install @octokit/rest --save-dev
2. Erstelle ein GitHub-Token mit repo-Rechten
3. Implementiere den API-Aufruf für PR-Erstellung

Beispiel-Code für PR-Erstellung mit octokit:
const octokit = new Octokit({ auth: 'GITHUB_TOKEN' });

octokit.pulls.create({
  owner: 'OWNER',
  repo: 'REPO',
  title: 'Entferne abgelaufenes Feature-Flag ${flag}',
  body: 'Dieses Feature-Flag ist abgelaufen und wird nicht mehr benötigt.',
  head: '${branchName}',
  base: 'main'
});
`);
    
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen des Pull Requests:`, error);
    process.exit(1);
  }
}

/**
 * Hauptfunktion des Scripts
 */
async function main() {
  console.log('🔍 Suche nach abgelaufenen Feature-Flags...');
  
  // Finde abgelaufene Feature-Flags
  const expiredFlags = findExpiredFlags();
  
  if (Object.keys(expiredFlags).length === 0) {
    console.log('✅ Keine abgelaufenen Feature-Flags gefunden.');
    return;
  }
  
  console.log(`Gefundene abgelaufene Feature-Flags: ${Object.keys(expiredFlags).join(', ')}`);
  
  // Verarbeite jedes abgelaufene Flag in einem eigenen Branch/PR
  for (const [flag, config] of Object.entries(expiredFlags)) {
    console.log(`\n🔄 Verarbeite Flag: ${flag}`);
    
    // Finde alle Verwendungen dieses Flags im Code
    const usages = findFlagUsages(flag);
    
    if (usages.length === 0) {
      console.log(`Keine Verwendungen für ${flag} gefunden. Es kann sicher entfernt werden.`);
      
      if (!DRY_RUN) {
        const branchName = createBranch(flag);
        removeFeatureFlagFromConfig(flag);
        commitChanges(flag);
        createPullRequest(branchName, flag, config);
      } else {
        removeFeatureFlagFromConfig(flag);
      }
      
      continue;
    }
    
    console.log(`Gefundene Verwendungen für ${flag}: ${usages.length}`);
    
    // Erstelle einen Branch für die Änderungen
    let branchName;
    if (!DRY_RUN) {
      branchName = createBranch(flag);
    }
    
    // Bestimme den Ersatzwert
    let replacement;
    let isReplacementFlag = false;
    
    if (config.replacedBy) {
      replacement = config.replacedBy;
      isReplacementFlag = true;
      console.log(`Flag ${flag} wird durch ${replacement} ersetzt`);
    } else {
      replacement = config.enabledInProduction ? 'true' : 'false';
      console.log(`Flag ${flag} wird durch konstanten Wert ${replacement} ersetzt`);
    }
    
    // Ersetze alle Verwendungen
    usages.forEach(usage => {
      replaceFeatureFlagInFile(usage.filePath, flag, replacement, isReplacementFlag);
    });
    
    // Entferne das Flag aus der Konfiguration
    removeFeatureFlagFromConfig(flag);
    
    // Commit und PR
    if (!DRY_RUN) {
      commitChanges(flag);
      createPullRequest(branchName, flag, config);
    }
  }
  
  console.log('\n✅ Feature-Flag-Cleanup abgeschlossen!');
}

// Script ausführen
main().catch(error => {
  console.error('❌ Unerwarteter Fehler:', error);
  process.exit(1);
}); 