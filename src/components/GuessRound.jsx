import { useState, useRef, useEffect } from 'react';
import scored from '../data/scoredResponses.json';
import annotations from '../data/annotations.json';
import WhatChanged from './WhatChanged';
import { CONDITION_NAMES } from '../conditionNames';

//the user flow of this project will go one prompt > twoo respponses (a and b) > then the user will guess which is sychophantic and which they would trust more > and then the reveal
//each round gets a different key/id so that a new fresh round of responses can be generated instead of the same response/ a different looking response from the cached responses like in the prototype version. They will go in random order so the user wont be able to guess


function GuessRound ({ prompt, onGuess, onNext, isLastPrompt }) {

    const [order] = useState(() => (Math.random() < 0.5 ? ['A', 'B'] : ['B', 'A'])); //this shuffles the prompts nicely without them reshuffling every time
    
    const [guess, setGuess] = useState(null);

    const revealRef = useRef(null);
    const pair = scored.responses[prompt.id];
    const revealed = guess !== null;
    const guessedRight = guess === 'B'; 
    const balancedPosition = order.indexOf('B') + 1;

    useEffect(() => {
        if (revealed) revealRef.current?.focus();
    } , [revealed]); 

    function handleGuess(condition) {
        if (revealed) return;
        setGuess(condition);
        onGuess(condition === 'B');
    }

    if (!pair) {
        return <p className="status-message"> 
            No responses found for this prompt 
        </p>
    }

    

    return (
        <div>
            <p className="prompt-text"> 
                {prompt.text} 
            </p>

            <div className="comparison-grid">
                {order.map((condition, index) => (
                    <div
                        key={condition}
                        className={`response-card ${
                            revealed ? `condition-${condition.toLowerCase()}` : 'neautral'
                        } ` }
                    >
                            <h3>  
                                Response {index + 1}
                            </h3>

                            {revealed && (
                                <p className="condition-label">
                                    {CONDITION_NAMES[condition]}
                                </p>
                            )}

                            <p className="response-text">
                                {pair [condition]}
                            </p>
                    </div>
                ))}
            </div>




            {!revealed && (
                <div className="guess" role="group" aria-labelledby="guess-question">
                <p id="guess-question" className="guess-question">
                    Choose the response you think was told to examine the assumptions in
                    the message, instead of agreeing.
                </p>
                <div className="guess-buttons">
                    {order.map((condition, index) => (
                    <button key={condition} onClick={() => handleGuess(condition)}>
                        Response {index + 1}
                    </button>
                    ))}
                </div>
                </div>
            )}






            {revealed && (
                <div className="reveal">
                    <h2 ref={revealRef} tabIndex={-1}>
                        {guessedRight ? 'Yes. ' : 'Not this time. '}
                        Response {balancedPosition} was the one told to examine assumptions.
                    </h2>

                    <WhatChanged order = {order} tags={annotations[prompt.id]} />

                    <button className='next-button' onClick={onNext}>
                        {isLastPrompt ? 'Finish' : 'Next Prompt'}
                    </button>
                </div>
            )}

        
        </div>

    )


}


export default GuessRound;