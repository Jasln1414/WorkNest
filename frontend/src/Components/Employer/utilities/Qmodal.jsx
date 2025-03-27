import React from 'react';
import { IoMdClose } from "react-icons/io";
import './question.css';

const Qmodal = ({ setModal, questions, setQuestions }) => {
  const addQuestion = () => {
    setQuestions([...questions, { text: '', question_type: 'TEXT', options: null }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'text') {
      newQuestions[index].text = value;
    } else if (field === 'question_type') {
      newQuestions[index].question_type = value;
      if (value !== 'MCQ') {
        newQuestions[index].options = null;
      } else {
        newQuestions[index].options = { A: '', B: '', C: '', D: '' };
      }
    } else if (field.startsWith('option_')) {
      const optionKey = field.split('_')[1];
      newQuestions[index].options = {
        ...newQuestions[index].options,
        [optionKey]: value
      };
    }
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
                      <span class="icon-wrapper">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  className="question-input"
                  placeholder="Enter your question here"
                  required
                />
                
                <select
                  value={question.question_type}
                  onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
                  className="question-type-select"
                >
                  <option value="TEXT">Text Answer</option>
                  <option value="MCQ">Multiple Choice</option>
                  <option value="CODE">Code Answer</option>
                </select>
                
                {question.question_type === 'MCQ' && (
                  <div className="mcq-options">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <input
                        key={option}
                        type="text"
                        value={question.options?.[option] || ''}
                        onChange={(e) => handleQuestionChange(index, `option_${option}`, e.target.value)}
                        className="option-input"
                        placeholder={`Option ${option}`}
                        required
                      />
                    ))}
                  </div>
                )}
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