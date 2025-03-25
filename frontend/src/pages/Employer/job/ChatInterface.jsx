import React from 'react';
import Message from '../../../Components/Employer/utilities/Message';
import { IoSend } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import '../../../Styles/Message/Message.css';

function ChatInterface({ empName, selectedChat, chatMessages, setMessage, sendMessage, message, setChatDrawer, chatDrawer }) {
    const baseURL = 'http://127.0.0.1:8000';

    return (
        <div className="chat-interface">
            <header className="chat-header">
                <div 
                    onClick={() => setChatDrawer(!chatDrawer)} 
                    className="mobile-back-button"
                >
                    <FaArrowLeft size={27} />
                </div>
                <div className="header-content">
                    <div className="user-info">
                        <div className="avatar-container">
                            <img 
                                className="user-avatar" 
                                src={baseURL + selectedChat.candidate_pic} 
                                alt="User avatar"
                            />
                        </div>
                        <div className="user-name">
                            <div>{selectedChat.candidate_name}</div>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="chat-main">
                <div className="messages-container">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className="message-wrapper">
                            {msg.sendername === empName ? (
                                <div className="message-sent">
                                    <Message text={msg.message} send />
                                </div>
                            ) : (
                                <div className="message-received">
                                    <Message text={msg.message} received />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            
            <div className="message-input-container">
                <div className="input-wrapper">
                    <textarea
                        placeholder="Type your message..."
                        name="message"
                        id="message"
                        rows={1}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        className="message-input"
                    />
                    <button 
                        onClick={sendMessage} 
                        type="submit" 
                        className="send-button"
                    >
                        <IoSend size={25} />
                        <span className="sr-only">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatInterface;