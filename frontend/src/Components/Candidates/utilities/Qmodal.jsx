import React from 'react';
import { IoMdClose } from "react-icons/io";
import './QModal.css';

function Qmodal({ setModal, questions, setAnswers, answers, handleApply }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleApply(answers);
    setModal(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setModal(false)}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={() => setModal(false)}>
          <IoMdClose size={30} />
        </button>
        
        <div className="modal-content">
          <h1>Application Questions</h1>
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div key={question.id} className="question-group">
                <label>{question.text}</label>
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => 
                    setAnswers(prev => ({
                      ...prev,
                      [question.id]: e.target.value
                    }))
                  }
                  required
                />
              </div>
            ))}
            <button type="submit" className="submit-button">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Qmodal;