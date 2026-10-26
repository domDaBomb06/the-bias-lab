//this will generate all 30 research responses (10 prompts x 3 conditions: sychophantic, balanced and no instrucction)
//the results will go to research/responses.json

import fs from 'node:fs';

const CONFIG = {
  model: 'gemini-3.5-flash-lite',
  temperature: 1.0,
  maxOutputTokens: 2048, 
};

const LENGTH_LINE =
  'Respond in plain prose of about 200 to 250 words, with no headings, bullet points or bold text.';

const DELAY_MS = 6000; // pause between calls to stay under the per-minute limit
const OUTPUT_FILE = 'research/responses.json';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    'GEMINI_API_KEY not found. Run with: node --env-file=.env.local research/generate-responses.mjs'
  );
  process.exit(1);
}

const prompts = JSON.parse(fs.readFileSync('src/data/prompts.json', 'utf8'));
const basePrompts = JSON.parse(fs.readFileSync('src/data/systemPrompts.json', 'utf8'));

const conditions = {
  A: `${basePrompts.A} ${LENGTH_LINE}`,
  B: `${basePrompts.B} ${LENGTH_LINE}`,
  baseline: LENGTH_LINE,
};

fs.mkdirSync('research', { recursive: true });

// If the script stopped part-way (e.g. quota ran out), pick up where it left off.
const results = fs.existsSync(OUTPUT_FILE)
  ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
  : [];
const done = new Set(results.map((r) => `${r.promptId}-${r.condition}`));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const countWords = (text) => (text ? text.trim().split(/\s+/).length : 0);

async function generate(promptText, systemPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: CONFIG.temperature,
        maxOutputTokens: CONFIG.maxOutputTokens,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error?.message || 'API error');
    err.status = res.status;
    throw err;
  }

  const candidate = data.candidates?.[0];

  const text = (candidate?.content?.parts || [])
    .filter((part) => !part.thought)
    .map((part) => part.text || '')
    .join('')
    .trim();

  return { text, finishReason: candidate?.finishReason };
}

for (const prompt of prompts) {
  for (const [condition, systemPrompt] of Object.entries(conditions)) {
    const key = `${prompt.id}-${condition}`;
    if (done.has(key)) continue;

    let attempt = 0;
    while (true) {
      try {
        const { text, finishReason } = await generate(prompt.text, systemPrompt);
        const wordCount = countWords(text);

        results.push({
          promptId: prompt.id,
          condition,
          text,
          wordCount,
          finishReason,
          ...CONFIG,
          systemPromptUsed: systemPrompt,
          generatedAt: new Date().toISOString(),
        });
        // Save after every response so nothing is lost if the script stops.
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

        const warnings = [];
        if (finishReason !== 'STOP') warnings.push('not a clean finish');
        if (wordCount < 150 || wordCount > 300) warnings.push('length outside 150-300');
        const flag = warnings.length ? `  <-- CHECK: ${warnings.join(', ')}` : '';
        console.log(`Prompt ${prompt.id} / ${condition}: ${wordCount} words${flag}`);
        break;
      } catch (err) {
        attempt++;
        if (err.status === 429 && attempt <= 3) {
          console.log('Rate limited, waiting 65 seconds...');
          await sleep(65000);
          continue;
        }
        console.error(`Failed on ${key}: ${err.message}`);
        console.error('Progress is saved. Fix the problem (or wait for the quota to reset) and run the script again to resume.');
        process.exit(1);
      }
    }

    await sleep(DELAY_MS);
  }
}

console.log('All done. Saved to', OUTPUT_FILE);
