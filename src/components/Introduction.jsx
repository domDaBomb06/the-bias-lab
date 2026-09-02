function Introduction({ onStart }) {
  return (
    <div className="intro-screen">
      <h1>AI can sound convincing without helping you think critically.</h1>
      <p>
        This app compares two different ways of instructing the same AI model. 
        Over a series of 10 prompts, you will see two different responses side by side.
        One from an AI told to prioritise agreement and validation, and one from an AI
        told to think critically about the assumptions behind what's being
        said.

      </p>
      <p>
        The point isn't that one response is "correct." It's to show that an
        AI agreeing with you isn't the same as an AI being right.
      </p>
      <button onClick={onStart}>Start</button>
    </div>
  );
}

export default Introduction;
