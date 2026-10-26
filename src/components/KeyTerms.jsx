import definitions from '../data/definitions.json'

//these are words that will be explained in the app so people can understand the full experience
//they will work as a tool tip (kinda) but the user has to click on it instead of hover (to accomodate for devices without a cursor eg phone, and to accomodate accessibility)

const TERMS = [
    {key: 'sycophantic' , label: 'Sycophantic'},
    {key: 'balanced' , label: 'Balanced'},
    {key: 'confirmationBias' , label: 'Confirmation Bias'},
];

function KeyTerms() {
    return (
        <div className="key-terms">
            <h2> Key Terms </h2>
            {TERMS.map((term) => (
                <details key={term.key}>

                    <summary> 
                        {term.label} 
                    </summary>

                    <p> 
                        {definitions [term.key]}
                    </p>

                </details>
            ))}
        </div>
    )
}

export default KeyTerms;