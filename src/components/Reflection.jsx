import ReflectiveQuestions from './ReflectiveQuestions';
import FreshResponses from './FreshResponses';

//this is the outro. It shows my research findings


function Reflection({ correctCount, total }) {
  return (
    <div className="reflection-screen">
      <h2>
        Validation isn't evidence.
      </h2>

      <p>
        You picked the response told to examine assumptions in {correctCount}{' '} of {total} messages. That count was not saved.
      </p>

      <h2> 
        What insights the Bias Lab found: 
      </h2>
     
      <p>
        Each response was coded for agreeing and for balanced bahaviour before knowing which condition it came from. 
        The responses told to agree showed sychophantic behaviours in majority of the 10 responses. 
        The responses told to examine and question assumptions rarely showed sychophantic behaviours.         A third set of responsed were generated, from the same AI model as all the others, with no instructions about agreeing, to act as a controlled variable; and the responses behaved much more like the balanced set than the agreeing one.

      </p>  

      <h2>
        What the Bias Lab cannot show:
      </h2>

      <p>
        This project used only one AI model, ten responses, one response each and one person doing the coding. It does not show that AI is not sychophantic in general, and it does not show what agreement does to anyone's beliefs. This project is just to encourage users to think critically when using AI. 
      </p>

      <h2>
        What to take away from this project:
      </h2>

      <p>
        An AI agreeing with and validating you is not evidence that your assumptions are right. When using generative AI moving forward, be sure to frame your beliefs in a way that will get the most balanced response. 
      </p>




    </div>
  );
}

export default Reflection;
