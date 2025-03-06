import React from 'react'

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
   <div className='flex justify-center mt-5'>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className='mx-2 px-3 py-1 border border-gray-300 rounded-md'
      >
        Previous
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`mx-2 px-3 py-1 border border-gray-300 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className='mx-2 px-3 py-1 border border-gray-300 rounded-md'
      >
        Next
      </button>
    </div>
  )
}

export default Pagination