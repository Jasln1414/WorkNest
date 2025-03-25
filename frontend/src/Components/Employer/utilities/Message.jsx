import React from 'react'; 
//import '../../../Styles/EmpProfile.css';

function Message({ text, send, received }) {
  return (
    <div className="message-container">
      <div className={`message-wrapper ${send ? 'sent' : ''} ${received ? 'received' : ''}`}>
        <div className={`message-bubble ${send ? 'sent' : ''} ${received ? 'received' : ''}`}>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;