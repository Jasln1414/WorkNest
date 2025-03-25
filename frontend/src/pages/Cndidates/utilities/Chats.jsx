import React, { useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import Messages from '../../../Components/Candidates/utilities/Messages';
import { FaArrowLeft } from 'react-icons/fa6';
import '../../../Styles/Message/Message.css';

function Chats({
  setChatDrawer,
  chatDrawer,
  selectedChat,
  chatMessages,
  setMessage,
  message,
  sendMessage,
  candidateName,
}) {
  const baseURL = 'http://127.0.0.1:8000';
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Handle message input keypress (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="uniwu-chats-container">
      <div className="uniwu-chats-wrapper">
        <header className="uniwu-chats-header">
          {setChatDrawer && (
            <div
              onClick={() => setChatDrawer(!chatDrawer)}
              className="uniwu-back-button"
            >
              <FaArrowLeft size={27} />
            </div>
          )}
          <div className="uniwu-header-content">
            <div className="uniwu-user-info">
              {selectedChat?.employer_pic && (
                <div className="uniwu-chat-avatar">
                  <img
                    src={baseURL + selectedChat.employer_pic}
                    alt="Employer Avatar"
                  />
                </div>
              )}
              <div className="uniwu-username">{selectedChat?.employer_name || 'Chat'}</div>
            </div>
          </div>
        </header>

        <main className="uniwu-chats-main">
          <div className="uniwu-messages-container">
            {chatMessages.length === 0 ? (
              <div className="uniwu-empty-chat">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div
                  key={`${msg.sendername}-${msg.message}-${index}`}
                  className="uniwu-message-wrapper"
                >
                  {msg.sendername === candidateName ? (
                    <div className="uniwu-message-sent">
                      <Messages text={msg.message} send />
                    </div>
                  ) : (
                    <div className="uniwu-message-received">
                      <Messages text={msg.message} received />
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <div className="uniwu-chat-input-container">
          <div className="uniwu-input-wrapper">
            <textarea
              placeholder="Type your message..."
              name="message"
              id="message"
              rows={1}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              value={message}
              className="uniwu-chat-input"
            />
            <button 
              onClick={sendMessage} 
              type="submit" 
              className="uniwu-send-button"
              disabled={!message.trim()}
            >
              <IoSend size={25} />
              <span className="uniwu-sr-only">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;