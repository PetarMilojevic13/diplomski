const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'baza', 'diplomski.films.json');
const backupPath2 = filePath + '.fmt.bak';

function formatNumberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatMoney(val) {
  if (val == null) return null;
  if (typeof val !== 'number') return val; // already formatted

  const n = val;
  if (Math.abs(n) >= 1_000_000_000) {
    const v = +(n / 1_000_000_000).toFixed(3);
    // keep up to 3 decimals but strip trailing zeros
    const s = (v % 1 === 0) ? String(v) : String(parseFloat(v.toFixed(3)));
    return `${s} milijardi $`;
  }
  if (Math.abs(n) >= 1_000_000) {
    const v = +(n / 1_000_000).toFixed(1);
    const s = (v % 1 === 0) ? String(v) : String(parseFloat(v.toFixed(1)));
    // use singular "milion" for exactly 1.0
    if (parseFloat(s) === 1) return `1 milion $`;
    return `${s} miliona $`;
  }
  // for values less than 1 million, show with commas
  return `${formatNumberWithCommas(n)} $`;
}

function run() {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  if (!fs.existsSync(backupPath2)) {
    fs.copyFileSync(filePath, backupPath2);
    console.log('Created secondary backup at', backupPath2);
  } else {
    console.log('Secondary backup already exists at', backupPath2);
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
    const beforeBud = f.budzet;
    const beforeBox = f.boxOffice;

    // Only convert numbers to formatted strings
    if (typeof beforeBud === 'number') f.budzet = formatMoney(beforeBud);
    if (typeof beforeBox === 'number') f.boxOffice = formatMoney(beforeBox);

    changes.push({ naslov: f.naslov, budzetOld: beforeBud, budzetNew: f.budzet, boxOld: beforeBox, boxNew: f.boxOffice });
  }

  fs.writeFileSync(filePath, JSON.stringify(films, null, 2), 'utf8');
  fs.writeFileSync(path.join(path.dirname(filePath), 'format_money_report.json'), JSON.stringify({ updatedAt: new Date().toISOString(), count: changes.length, sample: changes.slice(0,20) }, null, 2), 'utf8');
  console.log('Updated file:', filePath);
  console.log('Wrote report: format_money_report.json');
  console.table(changes.slice(0, 12));
}

run();

// Usage: node scripts/format_money_fields.js
