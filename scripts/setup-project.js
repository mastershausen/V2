import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 Willkommen beim Solvbox App Setup! 🚀\n');

// Funktionen für die Einrichtung
const setupSteps = {
  // Abhängigkeiten installieren
  installDependencies: () => {
    console.log('📦 Installiere Abhängigkeiten...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error('❌ Fehler beim Installieren der Abhängigkeiten:', error.message);
      return false;
    }
  },

  // Expo CLI global installieren, falls nicht vorhanden
  checkExpo: () => {
    console.log('🔍 Prüfe Expo CLI Installation...');
    try {
      execSync('expo --version', { stdio: 'pipe' });
      console.log('✅ Expo CLI ist bereits installiert.');
      return true;
    } catch (error) {
      console.log('⚠️ Expo CLI ist nicht installiert. Installiere jetzt...');
      try {
        execSync('npm install -g expo-cli', { stdio: 'inherit' });
        console.log('✅ Expo CLI erfolgreich installiert.');
        return true;
      } catch (installError) {
        console.error('❌ Fehler beim Installieren von Expo CLI:', installError.message);
        return false;
      }
    }
  },

  // Git-Hooks einrichten
  setupHooks: () => {
    console.log('🔧 Richte Git-Hooks ein...');
    try {
      execSync('npx husky install', { stdio: 'inherit' });
      
      // pre-commit Hook erstellen, falls nicht vorhanden
      const hookDir = path.join(process.cwd(), '.husky');
      if (!fs.existsSync(hookDir)) {
        fs.mkdirSync(hookDir, { recursive: true });
      }
      
      const preCommitPath = path.join(hookDir, 'pre-commit');
      if (!fs.existsSync(preCommitPath)) {
        fs.writeFileSync(
          preCommitPath,
          '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpm run precommit\n',
          { mode: 0o755 }
        );
      }
      
      return true;
    } catch (error) {
      console.error('⚠️ Git-Hooks konnten nicht eingerichtet werden:', error.message);
      console.log('Dies ist optional und kann später manuell eingerichtet werden.');
      return true; // Trotzdem fortfahren
    }
  },

  // Umgebungsvariablen prüfen
  checkEnv: () => {
    console.log('🔐 Prüfe Umgebungsvariablen...');
    const envExample = path.join(process.cwd(), '.env.example');
    const envFile = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envExample) && !fs.existsSync(envFile)) {
      console.log('⚠️ .env Datei fehlt. Kopiere .env.example zu .env...');
      fs.copyFileSync(envExample, envFile);
      console.log('✅ .env Datei erstellt. Bitte die Werte bei Bedarf anpassen.');
    } else if (!fs.existsSync(envExample) && !fs.existsSync(envFile)) {
      console.log('⚠️ Weder .env noch .env.example vorhanden. Umgebungsvariablen könnten später benötigt werden.');
    } else {
      console.log('✅ .env Datei existiert bereits.');
    }
    
    return true;
  },

  // Architektur-Check ausführen
  runArchitectureCheck: () => {
    console.log('🏗️ Führe Architektur-Check aus...');
    try {
      execSync('npm run check-architecture', { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error('⚠️ Architektur-Check fehlgeschlagen:', error.message);
      console.log('Dies ist ein Hinweis - das Setup wird fortgesetzt.');
      return true; // Trotzdem fortfahren
    }
  },

  // Dokumentation öffnen
  openDocs: (callback) => {
    rl.question('📚 Möchtest du die Projekt-Dokumentation öffnen? (j/n): ', (answer) => {
      if (answer.toLowerCase() === 'j') {
        try {
          execSync('npm run docs:open', { stdio: 'inherit' });
        } catch (error) {
          console.error('❌ Fehler beim Öffnen der Dokumentation:', error.message);
        }
      }
      callback(true);
    });
  }
};

// Führe alle Setup-Schritte nacheinander aus
const runSetup = async () => {
  const steps = [
    setupSteps.installDependencies,
    setupSteps.checkExpo,
    setupSteps.setupHooks,
    setupSteps.checkEnv,
    setupSteps.runArchitectureCheck
  ];

  for (const step of steps) {
    const success = step();
    if (!success) {
      console.error('\n❌ Setup fehlgeschlagen. Bitte manuell fortfahren oder Support kontaktieren.\n');
      rl.close();
      return;
    }
  }

  // Abschließender Schritt mit Callback wegen readline
  setupSteps.openDocs(() => {
    console.log('\n✅ Setup abgeschlossen! Die App kann jetzt mit "npm start" gestartet werden.\n');
    rl.close();
  });
};

runSetup(); 