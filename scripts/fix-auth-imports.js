#!/usr/bin/env node

/**
 * Script zur automatischen Korrektur von Auth-Typimporten
 * 
 * Dieses Script sucht nach Dateien, die AuthStatus und UserType aus alten
 * Quellen importieren, und ändert sie so, dass sie diese Typen aus
 * '@/features/auth/types' importieren.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Verzeichnisse, die ausgeschlossen werden sollen
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.expo'
];

// Dateien mit alten Imports finden
function findFilesToFix() {
  try {
    // AuthStatus-Importe finden
    const authStatusFiles = execSync(
      `find . -name "*.ts" -o -name "*.tsx" | grep -v "${EXCLUDED_DIRS.join('" | grep -v "')}" | xargs grep -l "import.*AuthStatus.*from.*'@/types"`,
      { encoding: 'utf8' }
    ).trim().split('\n').filter(Boolean);

    // UserType-Importe finden
    const userTypeFiles = execSync(
      `find . -name "*.ts" -o -name "*.tsx" | grep -v "${EXCLUDED_DIRS.join('" | grep -v "')}" | xargs grep -l ".*UserType.*from.*'@/types"`,
      { encoding: 'utf8' }
    ).trim().split('\n').filter(Boolean);

    // Duplikate entfernen
    return [...new Set([...authStatusFiles, ...userTypeFiles])];
  } catch (error) {
    console.error('Fehler beim Suchen der Dateien:', error);
    return [];
  }
}

// Importe in einer Datei korrigieren
function fixImportsInFile(filePath) {
  try {
    console.log(`Verarbeite Datei: ${filePath}`);
    
    // Deklariere die Variablen innerhalb dieser Funktion
    let needsAuthStatusImport = false;
    let needsUserTypeImport = false;
    
    // Dateiinhalt lesen
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Kein Backup mehr erstellen
    // fs.writeFileSync(`${filePath}.bak`, content, 'utf8');

    // AuthStatus-Importe ersetzen
    content = content.replace(
      /import\s+\{([^}]*)(AuthStatus)([^}]*)\}\s+from\s+['"]@\/types\/auth['"]|import\s+\{([^}]*)(AuthStatus)([^}]*)\}\s+from\s+['"]@\/types\/auth\/statusTypes['"]|import\s+\{([^}]*)(AuthStatus)([^}]*)\}\s+from\s+['"]@\/types\/userTypes['"]/g,
      (match, pre1 = '', _type1 = '', post1 = '', pre2 = '', _type2 = '', post2 = '', pre3 = '', _type3 = '', post3 = '') => {
        // Nur die AuthStatus entfernen, andere Typen in diesem Import belassen
        const pre = pre1 || pre2 || pre3 || '';
        const post = post1 || post2 || post3 || '';
        
        // Wenn keine anderen Typen importiert werden, den ganzen Import entfernen
        if (!pre.trim() && !post.trim()) {
          // Markiere diese Datei für einen neuen Import
          needsAuthStatusImport = true;
          return '';
        }
        
        // Sonst den AuthStatus-Teil aus dem Import entfernen
        let result = `import {${pre}`;
        // Kommas bereinigen
        result = result.replace(/,\s*,/g, ',');
        result = result.replace(/{\s*,/g, '{');
        result = result.replace(/,\s*}/g, '}');
        
        if (post) {
          result += `${post}`;
        }
        
        result += `} from '@/types/auth'`;
        needsAuthStatusImport = true;
        return result;
      }
    );

    // UserType-Importe ersetzen
    content = content.replace(
      /import\s+\{([^}]*)(UserType)([^}]*)\}\s+from\s+['"]@\/types\/auth['"]|import\s+\{([^}]*)(UserType)([^}]*)\}\s+from\s+['"]@\/types\/auth\/userTypes['"]|import\s+\{([^}]*)(UserType)([^}]*)\}\s+from\s+['"]@\/types\/userTypes['"]/g,
      (match, pre1 = '', _type1 = '', post1 = '', pre2 = '', _type2 = '', post2 = '', pre3 = '', _type3 = '', post3 = '') => {
        // Nur die UserType entfernen, andere Typen in diesem Import belassen
        const pre = pre1 || pre2 || pre3 || '';
        const post = post1 || post2 || post3 || '';
        
        // Wenn keine anderen Typen importiert werden, den ganzen Import entfernen
        if (!pre.trim() && !post.trim()) {
          // Markiere diese Datei für einen neuen Import
          needsUserTypeImport = true;
          return '';
        }
        
        // Sonst den UserType-Teil aus dem Import entfernen
        let result = `import {${pre}`;
        // Kommas bereinigen
        result = result.replace(/,\s*,/g, ',');
        result = result.replace(/{\s*,/g, '{');
        result = result.replace(/,\s*}/g, '}');
        
        if (post) {
          result += `${post}`;
        }
        
        result += `} from '@/types/auth'`;
        needsUserTypeImport = true;
        return result;
      }
    );

    // AuthStatus-Import hinzufügen, falls nötig
    if (needsAuthStatusImport && !content.includes("import { AuthStatus } from '@/features/auth/types'")) {
      // Alle Imports finden
      const lastImportMatch = content.match(/import.*from.*['"].*['"]\s*;?(?=\s|\n)/g);
      
      if (lastImportMatch) {
        // Nach dem letzten Import einfügen
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const importPos = content.lastIndexOf(lastImport) + lastImport.length;
        
        content = content.slice(0, importPos) + 
                 '\nimport { AuthStatus } from \'@/features/auth/types\';' + 
                 content.slice(importPos);
      } else {
        // Am Anfang der Datei einfügen
        content = 'import { AuthStatus } from \'@/features/auth/types\';\n\n' + content;
      }
    }

    // UserType-Import hinzufügen, falls nötig
    if (needsUserTypeImport && !content.includes("import { UserType } from '@/features/auth/types'")) {
      // Prüfen, ob bereits ein AuthStatus-Import existiert
      if (content.includes("import { AuthStatus } from '@/features/auth/types'")) {
        // Zu dem bestehenden AuthStatus-Import hinzufügen
        content = content.replace(
          /import\s+\{\s*AuthStatus\s*\}\s+from\s+['"]@\/features\/auth\/types['"]/,
          'import { AuthStatus, UserType } from \'@/features/auth/types\''
        );
      } else {
        // Alle Imports finden
        const lastImportMatch = content.match(/import.*from.*['"].*['"]\s*;?(?=\s|\n)/g);
        
        if (lastImportMatch) {
          // Nach dem letzten Import einfügen
          const lastImport = lastImportMatch[lastImportMatch.length - 1];
          const importPos = content.lastIndexOf(lastImport) + lastImport.length;
          
          content = content.slice(0, importPos) + 
                  '\nimport { UserType } from \'@/features/auth/types\';' + 
                  content.slice(importPos);
        } else {
          // Am Anfang der Datei einfügen
          content = 'import { UserType } from \'@/features/auth/types\';\n\n' + content;
        }
      }
    }

    // Datei mit korrigierten Imports speichern
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Datei erfolgreich aktualisiert: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Fehler beim Verarbeiten von ${filePath}:`, error);
    return false;
  }
}

// Hauptfunktion
function main() {
  console.log('🔍 Suche nach Dateien mit alten Auth-Typimporten...');
  const filesToFix = findFilesToFix();
  
  if (filesToFix.length === 0) {
    console.log('✨ Keine Dateien mit alten Auth-Typimporten gefunden.');
    return;
  }
  
  console.log(`🔧 ${filesToFix.length} Dateien mit alten Auth-Typimporten gefunden. Starte Korrektur...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of filesToFix) {
    const success = fixImportsInFile(file);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log('\n📊 Zusammenfassung:');
  console.log(`✅ ${successCount} Dateien erfolgreich aktualisiert`);
  console.log(`❌ ${errorCount} Dateien mit Fehlern`);
  console.log('🎉 Fertig! Bitte überprüfe die Änderungen und führe die Tests aus.');
}

// Script ausführen
main(); 