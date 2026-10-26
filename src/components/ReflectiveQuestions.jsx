import questions from '../data/reflectiveQuestions.json';

function ReflectiveQuestions() {
  return (
    <div className="reflective-questions">
      <h2>Questions to think about</h2>
      <ol>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
    </div>
  );
}
 
export default ReflectiveQuestions;