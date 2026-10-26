import KeyTerms from './KeyTerms';


function Introduction({ onStart }) {
  return (
    <div className="intro-screen">
      <h1>AI can sound convincing without helping you think critically.</h1>
      <p>
        You will see 10 short AI generated responses to a prompt, each containing a belief or an assumption. 
        For each response, the same AI model gave two responses: one was told to agree with and validate the person's prompt, and the other was told to examine the assumptions behind the prompt.
      </p>

      <p>
        Your job is to try and guess which response is which. Then the truth about each response will be revealed, as researcher notes.
      </p>
      <p>
        The point isn't that one response is correct and the other isnt, it is to show that an AI agreeing with you is not the same as an AI being right.
      </p>

      <KeyTerms />

      <button onClick={onStart}>Start</button>
      
    </div>
  );
}

export default Introduction; 
