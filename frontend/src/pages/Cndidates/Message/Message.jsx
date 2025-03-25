import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Messages from '../../../Components/Candidates/utilities/Messages';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Chats from '../utilities/Chats';
import '../../../Styles/Message/Message.css';

function Message() {
  const [message, setMessage] = useState('');
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const [chatRooms, setChatRooms] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [selectedChat, setSelectedChat] = useState([]);
  const [candidateName, setCandidateName] = useState(null);
  const [chatDrawer, setChatDrawer] = useState(false);

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const response = await axios.get(`${baseURL}/chat/chats/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setChatRooms(response.data);
          setCandidateName(response.data[0].candidate_name);
          setSelectedChat(response.data[0]);
          setChatMessages([]);
          connectToWebSocket(response.data[0].candidate, response.data[0].employer, response.data[0].candidate);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessageData();
  }, []);

  const connectToWebSocket = (candidate_id, employer_id, user_id) => {
    if (!candidate_id || !employer_id) return;

    const newClient = new W3CWebSocket(`${baseURL}/ws/chat/${candidate_id}/${employer_id}/${user_id}`);
    setClient(newClient);
    newClient.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setChatMessages((prevMessages) => [...prevMessages, data]);
    };

    return () => {
      newClient.close();
    };
  };

  const handleChat = (room) => {
    setChatMessages([]);
    connectToWebSocket(room.candidate, room.employer, room.candidate);
    setSelectedChat(room);
    setChatDrawer(true);
  };

  const sendMessage = () => {
    if (!client || client.readyState !== client.OPEN) {
      console.error('WebSocket is not open');
      return;
    }
    const sendername = candidateName;
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);
    client.send(messageString);
    setMessage('');
  };

  return (
    <div className="uniwu-message-container">
      <div className="uniwu-message-grid">
        <div className="uniwu-sidebar">
          <div className="uniwu-sidebar-content">
            <nav className="uniwu-chat-list">
              {chatRooms.map((room, index) => (
                <div
                  key={index}
                  className={`uniwu-chat-room ${selectedChat.id === room.id ? 'uniwu-selected' : ''}`}
                  onClick={() => handleChat(room)}
                >
                  <div className="uniwu-avatar">
                    <img src={baseURL + room.employer_pic} alt="Employer Avatar" />
                  </div>
                  <div className="uniwu-employer-name">{room.employer_name}</div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="uniwu-chat-window">
          <Chats
            candidateName={candidateName}
            selectedChat={selectedChat}
            chatMessages={chatMessages}
            setMessage={setMessage}
            message={message}
            sendMessage={sendMessage}
          />
        </div>

        <div className="uniwu-mobile-chat-drawer">
          <Drawer
            open={chatDrawer}
            onClose={() => setChatDrawer(false)}
            direction="right"
            size={400}
          >
            <div className="uniwu-drawer-content">
              <Chats
                setChatDrawer={setChatDrawer}
                chatDrawer={chatDrawer}
                candidateName={candidateName}
                selectedChat={selectedChat}
                chatMessages={chatMessages}
                setMessage={setMessage}
                message={message}
                sendMessage={sendMessage}
              />
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default Message;