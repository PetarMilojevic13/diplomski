const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'baza', 'diplomski.films.json');
const backupPath = filePath + '.removeDostupno.bak';

function run() {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log('Backup created at', backupPath);
  } else {
    console.log('Backup already exists at', backupPath);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let films;
  try {
    films = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse JSON:', e.message);
    process.exit(1);
  }

  let removedCount = 0;
  for (const f of films) {
    if (Object.prototype.hasOwnProperty.call(f, 'dostupnoKomada')) {
      delete f.dostupnoKomada;
      removedCount++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(films, null, 2), 'utf8');
  console.log(`Removed 'dostupnoKomada' from ${removedCount} film(s) and updated file.`);
}

run();

// Usage: node scripts/remove_dostupnoKomada.js
