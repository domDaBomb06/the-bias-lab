
//This will help to read the 30 responses (responses.json) and writes the scoredResponses.json to display on the application. It copies the text exactly, so nothing is retyped or changed. It also checks that every response was generated with the same settings, and records them.


import fs from 'node:fs';

const INPUT = 'research/responses.json';
const OUTPUT = 'src/data/scoredResponses.json';

const all = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

const responses = {};
const settings = new Set();
const times = [];

for (const r of all) {
  // Record the settings of EVERY response
  settings.add(
    JSON.stringify({
      model: r.model,
      temperature: r.temperature,
      maxOutputTokens: r.maxOutputTokens,
    })
  );
  times.push(r.generatedAt);

  // The app only shows conditions A and B. The controlled response stays in responses.json.
  if (r.condition === 'baseline') continue;

  responses[r.promptId] ??= {};
  responses[r.promptId][r.condition] = r.text;
}

// Check 1:
if (settings.size !== 1) {
  console.error('The responses were not all generated with the same settings:');
  for (const s of settings) console.error(' ', s);
  process.exit(1);
}

// Check 2: 
for (let id = 1; id <= 10; id++) {
  for (const condition of ['A', 'B']) {
    if (!responses[id]?.[condition]) {
      console.error(`Missing or empty response: prompt ${id}, condition ${condition}`);
      process.exit(1);
    }
  }
}

times.sort();
const meta = {
  ...JSON.parse([...settings][0]),
  firstGeneratedAt: times[0],
  lastGeneratedAt: times[times.length - 1],
};

fs.writeFileSync(OUTPUT, JSON.stringify({ meta, responses }, null, 2));
console.log(`Wrote ${OUTPUT}: 10 prompts x 2 conditions.`);
console.log('Settings:', meta);