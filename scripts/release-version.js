#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const packagePath = path.join(process.cwd(), 'package.json');
const packageJsonContent = fs.readFileSync(packagePath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);
const currentVersion = packageJson.version;

console.log(`\n📦 Release-Tool für Solvbox App\n`);
console.log(`Aktuelle Version: ${currentVersion}\n`);

// Fragt nach dem Versionstyp
const askVersionType = () => {
  console.log('Welche Art von Version möchtest du erstellen?');
  console.log('1) Patch (1.0.0 -> 1.0.1) - für Bugfixes');
  console.log('2) Minor (1.0.0 -> 1.1.0) - für neue Features');
  console.log('3) Major (1.0.0 -> 2.0.0) - für breaking changes');
  console.log('4) Benutzerdefinierte Version eingeben');
  console.log('5) Abbrechen');

  rl.question('\nWähle eine Option (1-5): ', (answer) => {
    switch (answer) {
      case '1':
        updateVersion('patch');
        break;
      case '2':
        updateVersion('minor');
        break;
      case '3':
        updateVersion('major');
        break;
      case '4':
        askCustomVersion();
        break;
      case '5':
        console.log('Release abgebrochen.');
        rl.close();
        break;
      default:
        console.log('Ungültige Eingabe. Bitte wähle 1-5.');
        askVersionType();
        break;
    }
  });
};

// Fragt nach einer benutzerdefinierten Version
const askCustomVersion = () => {
  rl.question('\nGib die neue Version ein (z.B. 1.2.3): ', (version) => {
    if (/^\d+\.\d+\.\d+$/.test(version)) {
      updateVersion(null, version);
    } else {
      console.log('Ungültiges Versionformat. Bitte im Format X.Y.Z eingeben.');
      askCustomVersion();
    }
  });
};

// Aktualisiert die Version in package.json und app.json
const updateVersion = (type, customVersion = null) => {
  try {
    let newVersion;
    
    if (customVersion) {
      newVersion = customVersion;
    } else {
      const [major, minor, patch] = currentVersion.split('.').map(Number);
      
      if (type === 'patch') {
        newVersion = `${major}.${minor}.${patch + 1}`;
      } else if (type === 'minor') {
        newVersion = `${major}.${minor + 1}.0`;
      } else if (type === 'major') {
        newVersion = `${major + 1}.0.0`;
      }
    }
    
    rl.question(`\nDie neue Version wird ${newVersion} sein. Fortfahren? (j/n): `, (answer) => {
      if (answer.toLowerCase() === 'j') {
        // package.json aktualisieren
        packageJson.version = newVersion;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
        
        // app.json aktualisieren, falls vorhanden
        const appJsonPath = path.join(process.cwd(), 'app.json');
        if (fs.existsSync(appJsonPath)) {
          const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
          const appJson = JSON.parse(appJsonContent);
          if (appJson.expo && appJson.expo.version) {
            appJson.expo.version = newVersion;
            
            // Auch buildNumber erhöhen, falls vorhanden
            if (appJson.expo.ios && appJson.expo.ios.buildNumber) {
              appJson.expo.ios.buildNumber = String(parseInt(appJson.expo.ios.buildNumber, 10) + 1);
            }
            if (appJson.expo.android && appJson.expo.android.versionCode) {
              appJson.expo.android.versionCode = parseInt(appJson.expo.android.versionCode, 10) + 1;
            }
            
            fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
          }
        }
        
        console.log(`\n✅ Version auf ${newVersion} aktualisiert.`);
        askCommitAndTag(newVersion);
      } else {
        console.log('\nAktualisierung abgebrochen.');
        rl.close();
      }
    });
  } catch (error) {
    console.error('❌ Fehler beim Aktualisieren der Version:', error.message);
    rl.close();
  }
};

// Fragt, ob Änderungen committed und getaggt werden sollen
const askCommitAndTag = (version) => {
  rl.question('\nÄnderungen committen und taggen? (j/n): ', (answer) => {
    if (answer.toLowerCase() === 'j') {
      try {
        // Änderungen committen
        execSync('git add package.json app.json', { stdio: 'inherit' });
        execSync(`git commit -m "chore: bump version to ${version}"`, { stdio: 'inherit' });
        
        // Mit Tag versehen
        execSync(`git tag -a v${version} -m "Version ${version}"`, { stdio: 'inherit' });
        
        console.log(`\n✅ Änderungen committed und als v${version} getaggt.`);
        
        // Fragen, ob Tag gepusht werden soll
        askPushTag(version);
      } catch (error) {
        console.error('❌ Fehler beim Committen/Taggen:', error.message);
        rl.close();
      }
    } else {
      console.log('\nÄnderungen wurden nur lokal aktualisiert, aber nicht committed.');
      rl.close();
    }
  });
};

// Fragt, ob Tags gepusht werden sollen
const askPushTag = (version) => {
  rl.question('\nTag zum Remote-Repository pushen? (j/n): ', (answer) => {
    if (answer.toLowerCase() === 'j') {
      try {
        execSync('git push', { stdio: 'inherit' });
        execSync('git push --tags', { stdio: 'inherit' });
        console.log(`\n✅ Änderungen und Tag v${version} wurden gepusht.`);
        console.log('\n🚀 Die CI/CD-Pipeline sollte nun automatisch starten.');
      } catch (error) {
        console.error('❌ Fehler beim Pushen:', error.message);
      } finally {
        rl.close();
      }
    } else {
      console.log(`\nTag wurde lokal erstellt. Du kannst ihn später mit 'git push --tags' pushen.`);
      rl.close();
    }
  });
};

// Starte den Prozess
askVersionType(); 