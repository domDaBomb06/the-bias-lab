import { useState } from 'react';
import Introduction from './components/Introduction';
import ResponseComparison from './components/ResponseComparison';
import WhatChanged from './components/WhatChanged';
import Reflection from './components/Reflection';
import ProgressBar from './components/ProgressBar';
import prompts from './data/prompts.json';



function App() {
  const [screen, setScreen] = useState('intro');
  const [promptIndex, setPromptIndex] = useState(0);


  function handleStart() {
    setScreen('compare');
  }


  function handleShowWhatChanged() {
    setScreen('whatChanged');
  }


  function handleNext() {
    if (promptIndex < prompts.length - 1) {
      setPromptIndex(promptIndex + 1);
      setScreen('compare');
    } else {
      setScreen('reflection');
    }
  }

  const isLastPrompt = promptIndex === prompts.length - 1;

    const showProgress = screen === 'compare' || screen === 'whatChanged';

  return (
    <div className="app-container">
      {showProgress && (
        <ProgressBar current={promptIndex + 1} total={prompts.length} />
      )}

      {screen === 'intro' && <Introduction onStart={handleStart} />}

      {screen === 'compare' && (
        <ResponseComparison
          key={prompts[promptIndex].id}
          prompt={prompts[promptIndex]}
          onShowWhatChanged={handleShowWhatChanged}
        />
      )}

      {screen === 'whatChanged' && (
        <WhatChanged
          prompt={prompts[promptIndex]}
          onNext={handleNext}
          isLastPrompt={isLastPrompt}
        />
      )}

      {screen === 'reflection' && <Reflection />}
    </div>
  );
}
 
export default App;
