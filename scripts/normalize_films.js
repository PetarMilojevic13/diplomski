const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'baza', 'diplomski.films.json');
const backupPath = filePath + '.bak';

function parseMoney(input) {
  if (!input) return null;
  if (typeof input === 'number') return Math.round(input);
  let s = String(input).trim();
  // remove $ and commas
  s = s.replace(/\$/g, '').replace(/,/g, '').toLowerCase();
  // handle ranges like "250-291 milion"
  const rangeMatch = s.match(/([0-9.]+)\s*[-–—]\s*([0-9.]+)\s*(mil|mili|milij)/i);
  if (rangeMatch) {
    const a = parseFloat(rangeMatch[1]);
    const b = parseFloat(rangeMatch[2]);
    const avg = (a + b) / 2;
    s = avg + ' ' + s.replace(rangeMatch[0], '').trim();
  }

  // numeric like "1000000" or "1000000 $"
  const plainNum = s.match(/^[0-9]+(\.[0-9]+)?$/);
  if (plainNum) return Math.round(parseFloat(s));

  // look for words
  if (s.includes('milijard') || s.includes('billion')) {
    const num = parseFloat(s) || 0;
    return Math.round(num * 1_000_000_000);
  }
  if (s.includes('miliona') || s.includes('million') || s.includes('milion')) {
    const num = parseFloat(s) || 0;
    return Math.round(num * 1_000_000);
  }

  // fallback: extract first number
  const numMatch = s.match(/([0-9]+(\.[0-9]+)?)/);
  if (numMatch) return Math.round(parseFloat(numMatch[1]));
  return null;
}

function decideCenaDnevno(boxOfficeNum) {
  // All prices at least 100. Scale by box office bands (simple rule).
  const base = 100;
  if (!boxOfficeNum || boxOfficeNum < 50_000_000) return base; // small films
  if (boxOfficeNum < 100_000_000) return 110;
  if (boxOfficeNum < 200_000_000) return 120;
  if (boxOfficeNum < 500_000_000) return 130;
  if (boxOfficeNum < 1_000_000_000) return 150;
  return 180; // blockbusters
}

function normalize() {
  if (!fs.existsSync(filePath)) {
    console.error('Films JSON not found:', filePath);
    process.exit(1);
  }
  // backup
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

  const changes = [];
  for (const f of films) {
    const oldBudzet = f.budzet;
    const oldBox = f.boxOffice;

    const budzetNum = parseMoney(oldBudzet);
    const boxNum = parseMoney(oldBox);

    // normalize fields: replace with numbers (USD whole dollars) if parsed
    if (budzetNum != null) f.budzet = budzetNum; else f.budzet = null;
    if (boxNum != null) f.boxOffice = boxNum; else f.boxOffice = null;

    // set cenaDnevno minimum 100 if missing or <100
    let newCena = f.cenaDnevno;
    if (!newCena || typeof newCena !== 'number' || newCena < 100) {
      newCena = decideCenaDnevno(boxNum);
      f.cenaDnevno = newCena;
    }

    changes.push({ naslov: f.naslov, oldBudzet, oldBox, budzetNum: f.budzet, boxNum: f.boxOffice, cenaDnevno: f.cenaDnevno });
  }

  // write back pretty-printed
  fs.writeFileSync(filePath, JSON.stringify(films, null, 2), 'utf8');
  console.log('File updated:', filePath);
  console.log('Sample of changes (first 10):');
  console.table(changes.slice(0, 10));
  // also write a small report
  const report = { updatedAt: new Date().toISOString(), changesCount: changes.length, sample: changes.slice(0, 20) };
  fs.writeFileSync(path.join(path.dirname(filePath), 'normalize_films_report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('Report written to normalize_films_report.json');
}

normalize();

// Usage: node scripts/normalize_films.js
