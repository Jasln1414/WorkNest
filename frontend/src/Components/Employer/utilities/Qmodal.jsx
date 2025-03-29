import React from 'react';
import { IoMdClose } from "react-icons/io";
import './question.css';

const Qmodal = ({ setModal, questions, setQuestions }) => {
  const addQuestion = () => {
    setQuestions([...questions, { text: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
      <button className="modal-close-button" onClick={() => setModal(false)}>
        <IoMdClose size={24} />
      </button>
      
      <div className="modal-content">
        <button className="modal-close-button" onClick={() => setModal(false)}>
          <IoMdClose size={24} />
        </button>
        <h2 className="modal-title">Screening Questions</h2>
        <p className="modal-subtitle">Add questions to screen applicants</p>
        
        <div className="question-form">
          {questions.map((question, index) => (
            <div className="question-input-group" key={index}>
              <div className="question-header">
                <label className="question-label">Question {index + 1}</label>
                {questions.length > 1 && (
                  <button className="question-remove-button"
                    type="button" 
                    onClick={() => removeQuestion(index)}
                  >
                    <span className="icon-wrapper">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  </button>
                )}
              </div>
              
              <input
                type="text"
                value={question.text}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                className="question-input"
                placeholder="Enter your question here"
                required
              />
            </div>
          ))}
          
          <div className="button-group">
            <button 
              type="button" 
              onClick={addQuestion} 
              className="add-button"
            >
              + Add Another Question
            </button>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => setModal(false)} 
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => setModal(false)}
              className="submit-button"
            >
              Save Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qmodal;