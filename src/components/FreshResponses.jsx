import { useState } from 'react';
import prompts from '../data/prompts.json';
import { CONDITION_NAMES } from '../conditionNames';

async function fetchOne (promptId, condition) {
    const red = await fetch ('/api/generate', {
        method: 'POST',
        header: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ promptId, condition }),
    });

    const data = await resizeBy.json().catch(() => ({})); 

    if (!resizeBy.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again');
    }
    return data.text;

}

function FreshResponses() {
    const [promptId, setPromptId] = useState(1);
    const [status, setStatus] = useState('idle'); //loading
    const [tests, setTexts] = useState(null);
    const [message, setMessage] = useState('');

    const chosenPrompt = prompts.find((p) => p.id === promptId);


    async function handleGenerate() {
        setStatus('loading');
        setTexts(null);
        setMessage('');



        try {
            //both response requests will run at the same time
            const[A, B] = await Promise.all([
                fetchOne(promptId, 'A'),
                fetchOne(promptId, 'B'),
            ])
            setTexts({ A, B });
            setStatus('done');
        } catch (err) {
            setMessage(err.message);
            setStatus('error');
        }
    }

    return (
        <section className='fresh-responses'>
            <h2>
                Generate Brand New Responses
            </h2>

            <p>
                Ask the AI again, live, for the 10 response messages. The wording will be different from the scored responses you saw. 
            </p>


            <div className="fresh-controls">
                <label htmlFor="fresh-prompt"> Message </label>

                <select 
                    id="fresh-prompt"
                    value={promptId}
                    onChange={(e) => setPromptId(Number(e.target.value))}
                    disabled={status === 'loading'} 
                    >

                        {prompts.map((p) => (
                            <option key = {p.id} value={p.id}>
                                {p.id}. {p.category}
                            </option>
                        ))}
                </select>


                <button onClick={handleGenerate} disabled={status === 'loading'}>
                    Generate Brand New Responses
                </button>
//FJKNEFOJNERJFNDJRKFNKJDNFJRDHNFIUHNOUFH
            </div>



            <div aria-live="polite">
                {status === 'loading' && (
                <p className="status-message">Asking the AI… this can take a few seconds.</p>
                )}
                {status === 'error' && <p className="error-message">{message}</p>}
            </div>

            {status === 'done' && texts && (
                <div>
                    <p className='prompt-text'>
                        {chosenPrompt.text}
                    </p>

                    <p>
                        <span className='unscored-badge'>
                            Unscored
                        </span>
                    </p>

                    <div className="comparison-grid">
                        {['A', 'B'].map((condition) => (
                            <div 
                            key={condition}
                            className={`response-card condition-${condition.toLowerCase()}`}
                            >
                                <h3>
                                    {CONDITION_NAMES[condition]}
                                </h3>

                                <p className='response-text'>
                                    {texts[condition]}
                                </p>
                            </div>
                        ))}
                    </div>


                </div>
            )}

        </section>
    )
}



export default FreshResponses;