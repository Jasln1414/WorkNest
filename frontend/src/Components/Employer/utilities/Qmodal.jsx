import React, { useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import './Qmodal.css';

function Qmodal({ setModal, setQuestions, questions, handleformSubmit }) {
    const modalRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setModal(false);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, '']);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await handleformSubmit();
            setModal(false);
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={modalRef} onClick={closeModal} className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close-button" onClick={() => setModal(false)}>
                    <IoMdClose size={30} />
                </button>
                <div className="modal-content">
                    <h1 className="modal-title">Screening Questions</h1>
                    <p className="modal-subtitle">Add questions to screen applicants</p>
                    
                    <form onSubmit={handleSubmit} className="question-form">
                        {questions.map((question, index) => (
                            <div className="question-input-group" key={index}>
                                <div className="question-header">
                                    <label htmlFor={`question-${index}`} className="question-label">
                                        Question {index + 1}
                                    </label>
                                    {questions.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeQuestion(index)}
                                            className="remove-question-button"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    id={`question-${index}`}
                                    name={`question-${index}`}
                                    value={question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    className="question-input"
                                    required
                                    placeholder="Enter your question here"
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
                                type="submit" 
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Posting...' : 'Post Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Qmodal;