import { CONDITION_NAMES } from '../conditionNames';

//this component helps to show the user what the difference between the sychophantic and balanced responses. The notes are looked up by CONDITION ("A" or "B") so they always describe the right response.

function WhatChanged({ order, tags }) {
  

  if (!tags) {
    return (
        <p className="status-message">
          No annotations found for this prompt yet.
        </p>
    );
  }


  return (
    <div className='what-changed'>
        <h2>What Changed?</h2>

        <p>
          These are some patterns that were identified in each response.These notes come from the researcher's coding of each response
        </p>

        <div className="what-changed-grid">
          {order.map((condition, index) => (
            <div
              key={condition}
              className= {`changed-column condition-${condition.toLowerCase}`}
              >

                <h3>
                  Response {index + 1} : {CONDITION_NAMES[condition]}
                </h3>

                <ul className={`condition-${condition.toLowerCase()}-list`}>
                    {tags[condition].map((tag) => (
                      <li key={tag}>{tag} </li>
                    ))}
                </ul>
            </div>

          ))}

        </div>
    </div>
  );
}

export default WhatChanged;
