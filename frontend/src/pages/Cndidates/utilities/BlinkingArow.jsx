import React from 'react';
import '../../../Styles/USER/Home.css';

const BlinkingArrow = ({ onClick }) => {
  return (
    <div className="blinking-arrow-container" onClick={onClick}>
      <span className="blinking-arrow">⬅️</span>
      <p>No jobs found. Click here to reset filters and show all jobs.</p>
    </div>
  );
};

export default BlinkingArrow;