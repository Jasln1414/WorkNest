import React, { useState, useEffect } from 'react';
import SideBar from '../../SideBar';
import axios from 'axios';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ChatInterface from '../../job/ChatInterface';

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatDrawer, setChatDrawer] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [message, setMessage] = useState("");
  
  const token = localStorage.getItem('access');
  const [chatRooms, setChatRooms] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [selectedChat, setSelectedChat] = useState([]);
  const [empName, setEmpName] = useState(null);
  const baseURL = 'http://127.0.0.1:8000';

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 640);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/chat/chats/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }
        );

        if (response.status === 200 && response.data.length > 0) {
          setChatRooms(response.data);
          setEmpName(response.data[0].employer_name);
          setSelectedChat(response.data[0]);
          setChatMessages([]);
          connectToWebSocket(response.data[0].candidate, response.data[0].employer, response.data[0].employer);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };
    fetchMessageData();
  }, []);

  const connectToWebSocket = (candidate_id, employer_id, user_id) => {
    if (!candidate_id || !employer_id) return;

    // Close existing connection if there is one
    if (client) {
      client.close();
    }

    // Create new WebSocket connection
    const newClient = new W3CWebSocket(
      `${baseURL}/ws/chat/${candidate_id}/${employer_id}/${user_id}`
    );
    
    setClient(newClient);
    
    newClient.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    
    newClient.onmessage = (message) => {
      const data = JSON.parse(message.data);
      setChatMessages((prevMessages) => [...prevMessages, data]);
    };
    
    newClient.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      newClient.close();
    };
  };

  const handleChat = (room) => {
    setChatMessages([]);
    connectToWebSocket(room.candidate, room.employer, room.employer);
    setSelectedChat(room);
    if (isSmallScreen) {
      setChatDrawer(true);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    if (!client || client.readyState !== client.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }
    
    const sendername = empName;
    const messageData = { message, sendername };
    
    try {
      client.send(JSON.stringify(messageData));
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="chat-messenger-container">
      {/* Sidebar only for mobile */}
      {isSmallScreen && (
        <>
          <button onClick={toggleDrawer} title="Menu" className="chat-toggle-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"
              className="stroke-indigo-300 fill-none group-hover:fill-indigo-400 group-active:stroke-indigo-200 group-active:fill-indigo-300 group-active:duration-0 duration-300">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5"></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg>
          </button>
          <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction='left'
            className='sidebar-drawer'
          >
            <div className='bg-gray-50'><SideBar /></div>
          </Drawer>
        </>
      )}

      {/* Main chat interface */}
      <div className="w-full">
        <div className="w-full h-[35rem]">
          <div className="grid min-h-full w-full lg:grid-cols-[280px_1fr]">
            {/* Chat rooms panel */}
            <div className="chat-rooms-panel bg-white shadow-sm rounded-lg mx-4 mt-4 p-4">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <nav className="flex flex-col gap-2 overflow-auto py-2">
                  {chatRooms.map((room, index) => (
                    <div 
                      onClick={() => handleChat(room)} 
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                        selectedChat.id === room.id ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white'
                      }`} 
                      key={index}
                    >
                      <div className="h-12 w-12 flex-shrink-0">
                        <img 
                          className="w-full h-full rounded-full object-cover" 
                          src={baseURL + room.candidate_pic} 
                          alt={`${room.candidate_name} avatar`} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{room.candidate_name}</div>
                        <div className="text-sm text-gray-500">Last message...</div> {/* Add last message or status */}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Chat messages container */}
            <div className="chat-messages-container">
              {isSmallScreen ? (
                <Drawer
                  open={chatDrawer}
                  onClose={() => setChatDrawer(false)}
                  direction='right'
                  size={440}
                  className='chat-drawer'
                >
                  <div className='chat-messages-container'>
                    <ChatInterface 
                      empName={empName} 
                      setChatDrawer={setChatDrawer} 
                      chatDrawer={chatDrawer} 
                      message={message} 
                      setMessage={setMessage} 
                      sendMessage={sendMessage} 
                      chatMessages={chatMessages} 
                      selectedChat={selectedChat} 
                    />
                  </div>
                </Drawer>
              ) : (
                <ChatInterface 
                  empName={empName} 
                  setChatDrawer={setChatDrawer} 
                  chatDrawer={chatDrawer} 
                  message={message} 
                  setMessage={setMessage} 
                  sendMessage={sendMessage} 
                  chatMessages={chatMessages} 
                  selectedChat={selectedChat} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;