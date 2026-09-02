import { useState, useEffect } from 'react';
import systemPrompts from '../data/systemPrompts.json';
import cachedResponses from '../data/cachedResponses.json';

function ResponseComparison({ prompt, onShowWhatChanged }) {
  const [responses, setResponses] = useState({ A: null, B: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCached, setIsCached] = useState(false);

  async function fetchResponse(condition) {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt.text,
        systemPrompt: systemPrompts[condition],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to get a response');
    }

    return data.text;
  }

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setIsCached(false);
    setResponses({ A: null, B: null });

    Promise.all([fetchResponse('A'), fetchResponse('B')])
      .then(([textA, textB]) => {
        if (cancelled) return;
        setResponses({ A: textA, B: textB });
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Live call failed, trying cache:', err);
        const cached = cachedResponses[prompt.id];

        if (cached) {
          setResponses({ A: cached.A, B: cached.B });
          setIsCached(true);
          setLoading(false);
        } else {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [prompt]);

  // --- THE FOLLOWING IS WHAT WILL BE SHOWN ON THE USER'S SCREEN ---

  if (loading) {
    return (
      <div className="loading-block">
        <p className="prompt-text">{prompt.text}</p>
        <p className="status-message">Generating both responses… this can take a few seconds.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="prompt-text">{prompt.text}</p>
        <p className="error-message">Something went wrong: {error}</p>
        <p className="status-message">No cached response is available for this prompt yet.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="prompt-text">{prompt.text}</p>

      {isCached && (
        <p className="cached-warning">⚠ Showing cached responses (live API call failed)</p>
      )}

      <div className="comparison-grid">
        <div className="response-card condition-a">
          <h3>Response A</h3>
          <p>{responses.A}</p>
        </div>
        <div className="response-card condition-b">
          <h3>Response B</h3>
          <p>{responses.B}</p>
        </div>
      </div>

      <button className="next-button" onClick={onShowWhatChanged}>
        What changed?
      </button>
    </div>
  );
}

export default ResponseComparison;
