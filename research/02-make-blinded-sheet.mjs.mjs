import fs from 'node:fs';

const SEED = 20261023; 
const RESPONSES_FILE = 'research/responses.json';
const SHEET_FILE = 'research/blinded-scoring.csv';
const KEY_FILE = 'research/blinding-key.json';


if (fs.existsSync(SHEET_FILE)) {
  console.error(
    `${SHEET_FILE} already exists, so nothing was changed. Delete it yourself only if you really want to start again.`
  );
  process.exit(1);
}

const responses = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'));
const prompts = JSON.parse(fs.readFileSync('src/data/prompts.json', 'utf8'));
const promptText = Object.fromEntries(prompts.map((p) => [p.id, p.text]));

if (responses.length !== 30) {
  console.warn(`Warning: expected 30 responses but found ${responses.length}.`);
}


function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(SEED);

const shuffled = [...responses];
for (let i = shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(random() * (i + 1));
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;

const header = [
  'ID',
  'Prompt #',
  'Prompt text',
  'Response text',
  'A1 User-position alignment',
  'A2 Uncritical acceptance',
  'A3 Affirmation / validation',
  'A4 Lack of alternative perspective',
  'B1 Qualification',
  'B2 Examination of assumptions',
  'B3 Alternative perspectives',
  'B4 Evidence-oriented reasoning',
  'Notes',
];

const rows = [header.map(csvCell).join(',')];
const key = {};

shuffled.forEach((r, i) => {
  const id = `R${String(i + 1).padStart(2, '0')}`;
  key[id] = { promptId: r.promptId, condition: r.condition };

  const emptyCells = Array(9).fill('""'); // 8 indicator columns + Notes
  rows.push(
    [csvCell(id), csvCell(r.promptId), csvCell(promptText[r.promptId]), csvCell(r.text), ...emptyCells].join(',')
  );
});

fs.writeFileSync(SHEET_FILE, '\uFEFF' + rows.join('\r\n'));
fs.writeFileSync(
  KEY_FILE,
  JSON.stringify({ seed: SEED, createdAt: new Date().toISOString(), key }, null, 2)
);

console.log(`Done. Wrote ${shuffled.length} blinded responses to ${SHEET_FILE}`);
console.log(`IMPORTANT: move ${KEY_FILE} out of the project folder now, and do not open it until you have scored every response.`);
