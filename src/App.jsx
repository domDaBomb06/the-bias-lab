import { useState, useEffect } from 'react';
import Introduction from './components/Introduction';
import GuessRound from './components/GuessRound';
import Reflection from './components/Reflection';
import ProgressBar from './components/ProgressBar';
import prompts from './data/prompts.json';
import scored from './data/scoredResponses.json';

function App() {
  const [screen, setScreen] = useState('intro'); //intro then round then outro
  const [promptIndex, setPromptIndex] = useState(0);

  // Keeps track of how many guesses were correct.
  const [correctCount, setCorrectCount] = useState(0);

  const isLastPrompt = promptIndex === prompts.length - 1;

    useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, promptIndex]) //this makes sure that it scrolls back to the top every time you press a button to the next 'page' 

  function handleGuess(wasCorrect) {
    if (wasCorrect) setCorrectCount((count) => count + 1);
  }

  function handleNext() {
    if (isLastPrompt) {
      setScreen('outro');
    } else {
      setPromptIndex(promptIndex + 1);
    }
  }

  const { model, temperature, lastGeneratedAt } = scored.meta;
  const generatedOn = new Date(lastGeneratedAt).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="app-container">
      {screen === 'round' && (
        <ProgressBar current={promptIndex + 1} total={prompts.length} />
      )}

      {screen === 'intro' && <Introduction onStart={() => setScreen('round')} />}

      {screen === 'round' && (
        <GuessRound
          key={prompts[promptIndex].id}
          prompt={prompts[promptIndex]}
          onGuess={handleGuess}
          onNext={handleNext}
          isLastPrompt={isLastPrompt}
        />
      )}

      {screen === 'outro' && (
        <Reflection correctCount={correctCount} total={prompts.length} />
      )}

      <footer className="app-footer">
        The scored responses were generated on {generatedOn} with {model} at
        temperature {temperature}.
      </footer>
    </div>
  );
}

export default App;