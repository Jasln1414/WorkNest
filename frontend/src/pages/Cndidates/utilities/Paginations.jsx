import React from 'react'
import '../../../Styles/Findjob.css'

function Pagination({ currentPage, totalPages, onPageChange }) {

    const handlePrevious = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    };
  
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  return (
    <div className="pagination">
    <button
      onClick={handlePrevious}
      disabled={currentPage === 1}
      className="pagination-button"
    >
      Previous
    </button>
    {pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => onPageChange(number)}
        className={`pagination-button ${currentPage === number ? 'active' : ''}`}
      >
        {number}
      </button>
    ))}
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className="pagination-button"
    >
      Next
    </button>
  </div>
  )
}

export default Pagination