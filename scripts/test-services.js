/**
 * Spezialisiertes Test-Skript für Service-Tests
 * 
 * Dieses Skript führt gezielt Unit-Tests für unsere Tab-Service-Layer aus,
 * ohne andere Tests zu beeinflussen oder problematische Mocks zu benötigen.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Workspace-Verzeichnis ermitteln
const workspaceDir = path.resolve(__dirname, '..');
console.log(`Workspace-Verzeichnis: ${workspaceDir}`);

// Temporäre Jest-Konfiguration erstellen
const tempConfigPath = path.join(__dirname, 'temp-jest.config.json');
const jestConfig = {
  "rootDir": workspaceDir,
  "testEnvironment": "node",
  "setupFilesAfterEnv": [],
  "transform": {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  // Gezielt nur unsere neu erstellten Service-Tests ausführen
  "testMatch": [
    "**/features/mysolvbox/services/__tests__/MySolvboxService.test.ts",
    "**/features/solvboxai/services/__tests__/SolvboxAIService.test.ts"
  ],
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
};

fs.writeFileSync(tempConfigPath, JSON.stringify(jestConfig, null, 2));
console.log(`Jest-Konfiguration erstellt unter: ${tempConfigPath}`);

// Überprüfe, ob die Test-Dateien existieren
const testPaths = [
  path.join(workspaceDir, 'features/mysolvbox/services/__tests__/MySolvboxService.test.ts'),
  path.join(workspaceDir, 'features/solvboxai/services/__tests__/SolvboxAIService.test.ts')
];

testPaths.forEach(testPath => {
  const exists = fs.existsSync(testPath);
  console.log(`Test-Datei ${testPath} ${exists ? 'gefunden' : 'NICHT GEFUNDEN'}`);
});

// Führe die Tests mit angepasster Konfiguration aus
try {
  console.log('\n🧪 Führe Service-Tests aus...\n');
  
  const cmd = `npx jest --no-watchman --config=${tempConfigPath}`;
  console.log(`Ausführen: ${cmd}`);
  
  const result = execSync(cmd, { stdio: 'inherit' });
  
  console.log('\n✅ Service-Tests erfolgreich abgeschlossen!');
} catch (error) {
  console.error('\n❌ Service-Tests fehlgeschlagen!');
  console.error('Fehler-Details:', error.message);
  process.exit(1);
} finally {
  // Temporäre Konfigurationsdatei löschen
  if (fs.existsSync(tempConfigPath)) {
    fs.unlinkSync(tempConfigPath);
    console.log(`Temporäre Konfiguration gelöscht.`);
  }
} 