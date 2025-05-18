// scripts/generate-unused-exports-md.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../reports/unused-exports.json');
const outputPath = path.resolve(__dirname, '../reports/unused-exports.md');

function generateTable(entries) {
  const header = '| Dateipfad | Export |\n|----------|-------|';
  const rows = entries.map(({ file, export: exp }) => `| ${file} | ${exp} |`);
  return [header, ...rows].join('\n');
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf-8').trim();
  const lines = raw.split('\n');
  const entries = lines.map(line => {
    const parts = line.split(' - ');
    if (parts.length >= 2) {
      const filePart = parts[0];
      const [file] = filePart.split(':', 2);
      const exportName = parts[1].trim();
      return { file: file.trim(), export: exportName };
    }
    return null;
  }).filter(entry => entry !== null);

  const md = generateTable(entries);
  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`✅ Markdown-Tabelle geschrieben nach ${outputPath}`);
}

main(); 