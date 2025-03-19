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
  const baseURL = import.meta.env.VITE_API_BASEURL;
  const modalRef = useRef();
  const [chatMessages, setChatMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState('');
  const chatMessagesRef = useRef(null);
  const user_id = candidate_id;

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setChat();
      client.close();
    }
  };

  useEffect(() => {
    const connectToWebSocket = (candidate_id, employer_id) => {
      if (!candidate_id || !employer_id) return;

      const newClient = new W3CWebSocket(
        `${baseURL}/ws/chat/${candidate_id}/${employer_id}/${user_id}`
      );
      setClient(newClient);
      newClient.onopen = () => {};

      newClient.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setChatMessages((prevMessages) => [...prevMessages, data]);
      };

      return () => {
        newClient.close();
      };
    };

    connectToWebSocket(candidate_id, employer_id);
  }, [candidate_id, employer_id]);

  const sendMessage = () => {
    if (!client || client.readyState !== client.OPEN) {
      return;
    }
    const sendername = candidate_name;
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);
    client.send(messageString);
    setMessage('');
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