import React, { useRef, useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { IoSend } from 'react-icons/io5';
import '../../../Styles/Job/AppliedJob.css';

function ChatModal({
  candidate_name,
  profile_pic,
  userName,
  setChat,
  candidate_id,
  employer_id,
}) {
  const modalRef = useRef();
  const [chatMessages, setChatMessages] = useState([]);
  const clientRef = useRef(null);
  const [message, setMessage] = useState('');
  const chatMessagesRef = useRef(null);
  const user_id = localStorage.getItem('user_id') || candidate_id;

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setChat();
      if (clientRef.current) {
        clientRef.current.close();
      }
    }
  };

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectToWebSocket = () => {
      const newClient = new W3CWebSocket(
        `ws://127.0.0.1:8000/ws/chat/${candidate_id}/${employer_id}/${user_id}/`
      );
      clientRef.current = newClient;

      newClient.onopen = () => {
        console.log("WebSocket connection established");
        reconnectAttempts = 0;
      };

      newClient.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setChatMessages((prevMessages) => {
          if (!prevMessages.some(msg => msg.message === data.message && msg.sendername === data.sendername)) {
            return [...prevMessages, data];
          }
          return prevMessages;
        });
      };

      newClient.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newClient.onclose = () => {
        console.log("WebSocket connection closed");
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts++;
            console.log(`Reconnecting... Attempt ${reconnectAttempts}`);
            connectToWebSocket();
          }, 3000);
        }
      };
    };

    connectToWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
        clientRef.current = null;
      }
    };
  }, [candidate_id, employer_id, user_id]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (!clientRef.current || clientRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    const sendername = candidate_name;
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);

    try {
      clientRef.current.send(messageString);
      setMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [chatMessages]);

  return (
    <div ref={modalRef} onClick={closeModal} className="chat-modal-overlay">
      <div className="chat-modal-container">
        <div className="chat-modal-header">
          <div className="chat-modal-profile-pic">
            <img src={profile_pic} alt="user" />
          </div>
          <p className="chat-modal-username">{userName}</p>
        </div>
        <div className="chat-messages" ref={chatMessagesRef}>
          {chatMessages.map((msg, index) => (
            <div key={index}>
              {msg.sendername === candidate_name ? (
                <div className="chat-message-right">
                  <div className="chat-message-bubble">
                    <strong>{msg.sendername}</strong>: {msg.message}
                  </div>
                </div>
              ) : (
                <div className="chat-message-left">
                  <div className="chat-message-bubble">
                    <strong>{msg.sendername}</strong>: {msg.message}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <textarea
            placeholder="Type your message..."
            name="message"
            id="message"
            rows={1}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="chat-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button className="chat-send-button" onClick={sendMessage}>
            <IoSend size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;