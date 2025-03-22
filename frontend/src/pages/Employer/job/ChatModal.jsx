import React, { useRef, useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { IoSend } from "react-icons/io5";
import '../../../Styles/Job/AppliedJob.css';

function ChatModal({
  setChat,
  profile_pic,
  userName,
  emp_name,
  candidate_id,
  employer_id,
}) {
  const modalRef = useRef();
  const baseURL = 'http://127.0.0.1:8000';
  const [chatMessages, setChatMessages] = useState([]);
  const clientRef = useRef(null); // Use a ref to store the WebSocket client
  const [message, setMessage] = useState("");
  const chatMessagesRef = useRef(null);
  const user_id = employer_id;

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setChat();
      if (clientRef.current && clientRef.current.readyState === clientRef.current.OPEN) {
        clientRef.current.close(); // Close the WebSocket connection when the modal is closed
      }
    }
  };

  useEffect(() => {
    const connectToWebSocket = (candidate_id, employer_id) => {
      if (!candidate_id || !employer_id) return;

      // Close the existing WebSocket connection if it exists
      if (clientRef.current && clientRef.current.readyState === clientRef.current.OPEN) {
        clientRef.current.close();
      }

      const newClient = new W3CWebSocket(
        `${baseURL}/ws/chat/${candidate_id}/${employer_id}/${user_id}/`
      );
      clientRef.current = newClient; // Store the new WebSocket client in the ref

      newClient.onopen = () => {
        console.log("WebSocket connection established.");
      };

      newClient.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setChatMessages((prevMessages) => {
          // Check if the message already exists in the state to avoid duplicates
          if (!prevMessages.some(msg => msg.message === data.message && msg.sendername === data.sendername)) {
            return [...prevMessages, data];
          }
          return prevMessages;
        });
      };

      newClient.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      return () => {
        newClient.close(); // Clean up the WebSocket connection when the component unmounts
      };
    };

    connectToWebSocket(candidate_id, employer_id);

    // Cleanup function to close the WebSocket connection when the component unmounts or dependencies change
    return () => {
      if (clientRef.current && clientRef.current.readyState === clientRef.current.OPEN) {
        clientRef.current.close();
      }
    };
  }, [candidate_id, employer_id, user_id]); // Dependencies for the useEffect hook

  const sendMessage = () => {
    if (!clientRef.current || clientRef.current.readyState !== clientRef.current.OPEN) {
      return;
    }
    const sendername = emp_name;
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);
    clientRef.current.send(messageString);
    setMessage("");
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
    <div
      ref={modalRef}
      onClick={closeModal}
      className="chat-modal-overlay"
    >
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
              {msg.sendername === emp_name ? (
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