/**
 * Architektur-Prüfskript
 * 
 * Dieses Skript überprüft, ob die Architekturrichtlinien aus dem Guide eingehalten werden.
 * Es führt statische Analysen durch und gibt Warnungen aus, wenn Verstöße gefunden werden.
 */

import chalk from 'chalk';
import fs from 'fs';
import * as glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguration
const projectRoot = path.resolve(__dirname, '..');
const featuresDir = path.join(projectRoot, 'features');
const sharedComponentsDir = path.join(projectRoot, 'shared-components');
const storesDir = path.join(projectRoot, 'stores');

// Fehlerzähler
let errorCount = 0;
let warningCount = 0;

console.log(chalk.blue('🔍 Überprüfe Architektur basierend auf dem Architektur-Guide...'));
console.log();

// 1. Screen-Komponenten-Prüfung (sollten Default-Export verwenden)
console.log(chalk.cyan('Überprüfe Screen-Komponenten...'));
const screenFiles = glob.sync(path.join(featuresDir, '*/screens/*.tsx'));

screenFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  
  // Prüfe auf Default-Export
  if (!content.includes('export default function')) {
    console.log(chalk.red(`❌ ${fileName}: Verwendet keinen Default-Export mit Funktionsdeklaration`));
    errorCount++;
  }
  
  // Prüfe auf direkte Store-Importe (sollten über Hooks erfolgen)
  if (content.includes('from \'@/stores/') && !content.includes('Store.ts')) {
    console.log(chalk.yellow(`⚠️ ${fileName}: Direkter Import aus Stores. Verwende stattdessen Hooks.`));
    warningCount++;
  }
});

// 2. Komponenten-Prüfung (sollten Named-Export verwenden)
console.log(chalk.cyan('\nÜberprüfe Komponenten...'));
const componentFiles = [
  ...glob.sync(path.join(featuresDir, '*/components/*.tsx')),
  ...glob.sync(path.join(sharedComponentsDir, '**/*.tsx'))
];

componentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  
  // Prüfe auf benannten Export
  if (content.includes('export default function') && !fileName.endsWith('Screen.tsx')) {
    console.log(chalk.red(`❌ ${fileName}: Komponente verwendet Default-Export statt Named-Export`));
    errorCount++;
  }
  
  // Prüfe auf Arrow Functions für Komponenten
  if (content.includes('export const') && content.includes(' = (') && content.includes(') =>')) {
    console.log(chalk.red(`❌ ${fileName}: Verwendet Arrow-Funktion statt Funktionsdeklaration für Komponente`));
    errorCount++;
  }
});

// 3. Store-Struktur-Prüfung
console.log(chalk.cyan('\nÜberprüfe Store-Struktur...'));
const storeFiles = glob.sync(path.join(storesDir, '*.ts'));
const storeActionsDir = path.join(storesDir, 'actions');
const storeSelectorsDir = path.join(storesDir, 'selectors');
const storeTypesDir = path.join(storesDir, 'types');

// Prüfe, ob die Store-Verzeichnisstruktur korrekt ist
if (!fs.existsSync(storeActionsDir)) {
  console.log(chalk.red(`❌ Store-Verzeichnisstruktur: 'actions'-Verzeichnis fehlt`));
  errorCount++;
}

if (!fs.existsSync(storeSelectorsDir)) {
  console.log(chalk.red(`❌ Store-Verzeichnisstruktur: 'selectors'-Verzeichnis fehlt`));
  errorCount++;
}

if (!fs.existsSync(storeTypesDir)) {
  console.log(chalk.red(`❌ Store-Verzeichnisstruktur: 'types'-Verzeichnis fehlt`));
  errorCount++;
}

// 4. App-Modi-Verwendung prüfen
console.log(chalk.cyan('\nÜberprüfe App-Modi-Verwendung...'));
const allFiles = glob.sync(path.join(projectRoot, '**/*.{ts,tsx}'), {
  ignore: ['**/node_modules/**', '**/build/**', '**/dist/**']
});

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  
  // Prüfe auf direkten Zugriff auf appMode Variable
  if (content.includes('appMode ===') && !file.includes('config/app/env.ts')) {
    console.log(chalk.red(`❌ ${fileName}: Direkter Zugriff auf 'appMode'. Verwende stattdessen Hilfsfunktionen.`));
    errorCount++;
  }
});

// 5. Prüfe auf Barrel-File-Nutzung
console.log(chalk.cyan('\nÜberprüfe auf Barrel-File-Verwendung...'));

// Erlaubte Barrel-Files (spezielle Ausnahmen)
const allowedBarrelFiles = [
  'shared-components/theme/index.ts',
  'shared-components/media/index.ts'
];

// Finde alle Barrel-Files
const barrelFiles = glob.sync(path.join(projectRoot, '**/index.ts'), {
  ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/types/index.d.ts', '**/types/index.ts']
});

// Prüfe Barrel-Files
barrelFiles.forEach(file => {
  // Relativer Pfad für bessere Lesbarkeit
  const relativePath = path.relative(projectRoot, file);
  
  // Überprüfe, ob es sich um eine erlaubte Barrel-Datei handelt
  if (allowedBarrelFiles.some(allowed => relativePath.includes(allowed))) {
    return; // Diese Barrel-Files sind ausdrücklich erlaubt
  }
  
  console.log(chalk.yellow(`⚠️ Barrel-File gefunden: ${relativePath}. Sollte direkt aus der Quellkomponente importieren.`));
  warningCount++;
});

// Suche nach Verwendung von Barrel-Imports in Code
const allTsFiles = glob.sync(path.join(projectRoot, '**/*.{ts,tsx}'), {
  ignore: ['**/node_modules/**', '**/build/**', '**/dist/**', '**/index.ts']
});

// Regex für typische Barrel-Importe (endet mit Verzeichnisname ohne explizite Datei)
const barrelImportRegex = /from\s+['"](@\/[^'"]+|\.\.\/[^'"]+)['"];\s*$/gm;

allTsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const fileName = path.basename(file);
  const relativePath = path.relative(projectRoot, file);
  
  const matches = [...content.matchAll(barrelImportRegex)];
  
  matches.forEach(match => {
    const importPath = match[1];
    // Ignoriere erlaubte Barrel-Importe
    if (allowedBarrelFiles.some(allowed => importPath.includes(allowed.replace('/index.ts', '')))) {
      return;
    }
    
    console.log(chalk.yellow(`⚠️ ${relativePath}: Verwendet möglicherweise Barrel-Import: ${match[0]}`));
    warningCount++;
  });
});

// Ergebnis ausgeben
console.log();
if (errorCount === 0 && warningCount === 0) {
  console.log(chalk.green('✅ Alle Architekturrichtlinien werden eingehalten!'));
} else {
  console.log(chalk.yellow(`⚠️ ${warningCount} Warnungen und ${errorCount} Fehler gefunden.`));
  console.log(chalk.yellow('Bitte konsultiere den Architektur-Guide unter docs/architecture-guide.md, um die Probleme zu beheben.'));
  
  if (errorCount > 0) {
    process.exit(1);
  }
} 