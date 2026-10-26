// This file runs on Vercel's server, NOT in the browser.
// The browser is only going to send a prompt number and a condition (response "a" or "b"), but all the prompt text are looked up here to keep my API safe :) 

import prompts from '../src/data/prompts.json' with { type: 'json' };
import systemPrompts from '../src/data/systemPrompts.json' with { type: 'json' };
import { MODEL, GENERATION_CONFIG, LENGTH_LINE } from './_config.js';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }



  const { promptId, condition } = req.body ?? {};

  if (!Number.isInteger(promptId) || promptId < 1 || promptId > 10) {
    return res.status(400).json({ error: 'promptId must be a whole number from 1 to 10' });
  }

  if (!['A', 'B'].includes(condition)) {
    return res.status(400).json({ error: 'condition must be "A" or "B"' });
  }



  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Server is  not configured correctly' });
  }


  // Look up the real text on the server.
  const prompt = prompts.find((p) => p.id === promptId)

  if (!prompt) {
    return res.status(400).json({ error: 'Unknown promptId' });
  }


  const systemPrompt = `${systemPrompts[condition]} ${LENGTH_LINE}`;





    // This is the actual address of Google's Gemini API that Im sending my request to. "gemini-3.6-flash" is the specific model we're using.
    //const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
//side note: when i was testing each response i ran out of requests from the api so im trying this one:

  // This is the actual address of Google's Gemini API that the request is being sent to. It is called "gemini-3.5-flash-lite" and allows 15 requests per minute and its free (hopefully theres no catch)
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;



  try {

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt.text }],
          },
        ],
        generationConfig: GENERATION_CONFIG,
      }),
    });

    const data = await geminiResponse.json();


    
    if (!geminiResponse.ok) {
      // Full details stay in the server log. The browser only gets a short message.
      console.error('Gemini API error:', data);
 
      if (geminiResponse.status === 429) {
        return res.status(429).json({
          error: 'Live generation is busy or out of quota right now. Please try again later.',
        });
      }
      return res.status(502).json({ error: 'The AI service returned an error' });
    }


    
    const candidate = data.candidates?.[0];

    const text = (candidate?.content?.parts ?? [])
      .filter((part) => !part.thought)
      .map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      console.error('No text in Gemini response:', data);
      return res.status(502).json({ error: 'The AI service returned an empty response'
    });
  }

    if (candidate.finishReason !== 'STOP') {
    console.warn('Response did not finish cleanly:', candidate.finishReason);
    }

    return res.status(200).json({ text });
      } catch (error) {
        console.error('Server error calling Gemini:', error);
        return res.status(500).json({ error: 'Something went wrong contacting the AI service' });
      }
    

}