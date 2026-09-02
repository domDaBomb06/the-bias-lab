import annotations from '../data/annotations.json';


function WhatChanged({ prompt, onNext, isLastPrompt }) {
  const tags = annotations[String(prompt.id)];


  if (!tags) {
    return (
      <div>
        <p className="status-message">No annotations found for this prompt yet.</p>
        <button onClick={onNext}>{isLastPrompt ? 'Finish' : 'Next prompt'}</button>
      </div>
    );
  }

  return (
    <div>
      <h2>What's the difference?</h2>
      <p>
        These are some patterns that were identified in each response.
      </p>

      <div className="what-changed-grid">
        <div className="changed-column condition-a">
          <h3>Response A</h3>
          <ul className="condition-a-list">
            {tags.A.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <div className="changed-column condition-b">
          <h3>Response B</h3>
          <ul className="condition-b-list">
            {tags.B.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      <button onClick={onNext} style={{ marginTop: '1.5rem' }}>
        {isLastPrompt ? 'Finish' : 'Next prompt'}
      </button>
    </div>
  );
}

export default WhatChanged;
