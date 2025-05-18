#!/usr/bin/env node

/**
 * Skript zur automatischen Korrektur von Import-Pfaden im Projekt
 * 
 * Konvertiert:
 * - Relative Parent-Imports (../) zu Alias-Imports (@features/, @services/, etc.)
 * - Alias-Imports innerhalb desselben Features zu relativen Imports (./)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

// Konfiguration
const srcDir = '.';
const filePatterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
const ignorePatterns = [
  'node_modules/**',
  'build/**',
  'dist/**',
  '.expo/**',
  'ios/**',
  'android/**',
  'coverage/**',
  'scripts/**'
];

// Alias-Mappings aus tsconfig.json extrahieren
function getAliasMappings() {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  const paths = tsConfig.compilerOptions.paths || {};
  const baseUrl = tsConfig.compilerOptions.baseUrl || '.';
  
  const mappings = {};
  
  for (const alias in paths) {
    // Format: "@alias/*": ["./real/path/*"]
    const key = alias.replace(/\/\*$/, '');
    const value = paths[alias][0].replace(/\/\*$/, '').replace(/^\.\//, '');
    mappings[key] = value;
  }
  
  return mappings;
}

// Gibt das Feature zurück, in dem die Datei liegt (oder null, wenn außerhalb eines Features)
function getFeatureForFile(filePath) {
  const match = /features\/([^/]+)\//.exec(filePath);
  return match ? match[1] : null;
}

// Konvertiert relative Parent-Imports zu Alias-Imports
function convertParentImportsToAlias(content, filePath, aliasMappings) {
  const importRegex = /import\s+(?:{[^}]*}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
  
  // Konvertiere nur relative Pfade mit ../ zu Aliasen
  return content.replace(importRegex, (match, importPath) => {
    if (!importPath.startsWith('../')) {
      return match;
    }
    
    // Relativpfad zum absoluten Pfad umwandeln
    const absolutePath = path.resolve(path.dirname(filePath), importPath);
    const relativePath = path.relative(process.cwd(), absolutePath);
    
    // Prüfe, ob der Pfad zu einem der konfigurierten Aliase passt
    for (const [alias, aliasPath] of Object.entries(aliasMappings)) {
      if (relativePath.startsWith(aliasPath)) {
        const newImportPath = relativePath.replace(aliasPath, alias);
        return match.replace(importPath, newImportPath);
      }
    }
    
    return match;
  });
}

// Konvertiert Alias-Imports innerhalb desselben Features zu relativen Imports
function convertSameFeatureAliasToRelative(content, filePath) {
  const featureName = getFeatureForFile(filePath);
  if (!featureName) return content;
  
  const importRegex = /import\s+(?:{[^}]*}|\w+|\*\s+as\s+\w+)\s+from\s+['"](@features\/[^'"]+)['"]/g;
  
  return content.replace(importRegex, (match, importPath) => {
    if (importPath.startsWith(`@features/${featureName}/`)) {
      // Konvertiere zu relativem Pfad innerhalb des Features
      const featureRoot = `features/${featureName}`;
      const importTarget = importPath.replace(`@features/${featureName}/`, '');
      
      // Berechne relativen Pfad vom aktuellen File
      const fileDir = path.dirname(filePath);
      const relativeRoot = path.relative(fileDir, featureRoot);
      
      // Erstelle neuen relativen Pfad
      const newPath = path.join(relativeRoot || '.', importTarget);
      const normalizedPath = newPath.replace(/\\/g, '/');
      
      return match.replace(importPath, `./${normalizedPath}`);
    }
    return match;
  });
}

// Hauptfunktion
async function fixImports() {
  try {
    console.log('Import-Pfade korrigieren...');
    
    // Alias-Mappings aus tsconfig.json laden
    const aliasMappings = getAliasMappings();
    console.log('Gefundene Alias-Mappings:', aliasMappings);
    
    // Dateien finden
    const files = [];
    for (const pattern of filePatterns) {
      const matches = glob.sync(pattern, { 
        cwd: srcDir, 
        ignore: ignorePatterns,
        absolute: true
      });
      files.push(...matches);
    }
    
    console.log(`${files.length} Dateien gefunden.`);
    
    // Dateien verarbeiten
    let modifiedCount = 0;
    
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Konvertiere Parent-Imports zu Alias-Imports
      let newContent = convertParentImportsToAlias(content, filePath, aliasMappings);
      
      // Konvertiere Alias-Imports innerhalb desselben Features zu relativen Imports
      newContent = convertSameFeatureAliasToRelative(newContent, filePath);
      
      // Speichere nur, wenn Änderungen vorgenommen wurden
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        modifiedCount++;
        console.log(`Geändert: ${filePath}`);
      }
    }
    
    console.log(`${modifiedCount} Dateien aktualisiert.`);
    
    // ESLint Autofix ausführen
    console.log('ESLint Autofix ausführen...');
    try {
      execSync('npx eslint --fix .', { stdio: 'inherit' });
    } catch (e) {
      console.warn('ESLint hat Fehler gefunden, die nicht automatisch behoben werden konnten.');
    }
    
    console.log('Import-Korrektur abgeschlossen!');
  } catch (error) {
    console.error('Fehler:', error);
    process.exit(1);
  }
}

// Skript ausführen
fixImports(); 