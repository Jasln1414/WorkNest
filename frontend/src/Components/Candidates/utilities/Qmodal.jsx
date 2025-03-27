// Qmodal.jsx
import React from 'react';
import './Qmodal.css';

const Qmodal = ({ setModal, questions, setAnswers, answers, handleApply }) => {
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, answer_text]) => ({
      question: parseInt(questionId),
      answer_text
    }));
    handleApply(formattedAnswers);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Application Questions</h2>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={index} className="question-item">
              <label>{question.text}</label>
              {question.question_type === 'TEXT' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                />
              )}
              {question.question_type === 'MCQ' && (
                <select
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {Object.entries(question.options || {}).map(([key, value]) => (
                    <option key={key} value={key}>{`${key}: ${value}`}</option>
                  ))}
                </select>
              )}
              {question.question_type === 'CODE' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Write your code here..."
                  className="code-input"
                />
              )}
            </div>
          ))
        ) : (
          <p>No questions available</p>
        )}
        <div className="modal-buttons">
          <button onClick={() => setModal(false)}>Cancel</button>
          <button 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default Qmodal;