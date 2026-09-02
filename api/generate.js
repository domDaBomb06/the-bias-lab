// This file runs on Vercel's server, NOT in the browser.


export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }



  const { prompt, systemPrompt } = req.body;

  if (!prompt || !systemPrompt) {
    return res.status(400).json({ error: 'Missing prompt or systemPrompt in request' });
  }



  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY' });
  }

    // This is the actual address of Google's Gemini API that we're sending our
    // request to. "gemini-3.6-flash" is the specific model we're using.
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
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
        },
      }),
    });

    const data = await geminiResponse.json();


    
    if (!geminiResponse.ok) {
      console.error('Gemini API error:', data);
      return res.status(geminiResponse.status).json({
        error: data.error?.message || 'Gemini API request failed',
      });
    }


    
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return res.status(500).json({ error: 'No text found in Gemini response' });
    }


    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error('Server error calling Gemini:', error);
    return res.status(500).json({ error: 'Something went wrong contacting Gemini' });
  }
}