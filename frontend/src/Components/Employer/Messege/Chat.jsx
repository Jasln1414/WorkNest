import React, { useState, useEffect } from 'react';
import SideBar from '../../../components/employer/SideBar';
import axios from 'axios';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ChatInterface from '../../../components/employer/utilities/ChatInterface';

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
  const baseURL = 'http://127.0.0.1:8000/';




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

        if (response.status === 200) {
          setChatRooms(response.data);
          setEmpName(response.data[0].employer_name);
          setSelectedChat(response.data[0]);
          setChatMessages([]);
          connectToWebSocket(response.data[0].candidate, response.data[0].employer, response.data[0].employer);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessageData();
  }, []);

  const connectToWebSocket = (candidate_id, employer_id, user_id) => {
    if (!candidate_id || !employer_id) return;

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

    return () => {
      newClient.close();
    };
  };

  const handleChat = (room) => {
    setChatMessages([]);
    connectToWebSocket(room.candidate, room.employer);
    setSelectedChat(room);
    if (isSmallScreen) {
      setChatDrawer(true);
    }
  };

  const sendMessage = () => {
    if (!client || client.readyState !== client.OPEN) {
      return;
    }
    const sendername = empName;
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);
    client.send(messageString);
    setMessage("");
  };

  return (
    <div className='flex pt-12'>
      <div>
        {isSmallScreen ? (
          <>
            <button onClick={toggleDrawer} title="Add New" className="group cursor-pointer outline-none hover:rotate-90 duration-300">
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
              className='bla bla bla'
            >
              <div className='bg-gray-50'><SideBar /></div>
            </Drawer>
          </>
        ) : (
          <SideBar />
        )}
      </div>
      <div className='w-full'>
        <div className='w-full h-[35rem]'>
          <div className="grid min-h-full w-full lg:grid-cols-[280px_1fr]">
            <div className="border-r bg-blue-100 h-[35rem]">
              <div className="flex h-full max-h-screen flex-col gap-2 ">
                <nav className="flex flex-col gap-1 overflow-auto py-2">
                  {chatRooms.map((room, index) => (
                    <div onClick={() => handleChat(room)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium bg-blue-50 rounded-md cursor-pointer" key={index}>
                      <div>
                        <img className="w-10 h-10 rounded-full" src={baseURL + room.candidate_pic} alt="Rounded avatar" />
                      </div>
                      <div className="flex-1 truncate font-bold text-gray-500">{room.candidate_name}</div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
            <div className="md:block">
              {isSmallScreen ? (
                <Drawer
                  open={chatDrawer}
                  onClose={() => setChatDrawer(false)}
                  direction='right'
                  size={440}
                  className='bla bla bla'>
                  <div className='bg-gray-100 '>
                    <ChatInterface empName={empName} setChatDrawer={setChatDrawer} chatDrawer={chatDrawer} message={message} setMessage={setMessage} sendMessage={sendMessage} chatMessages={chatMessages} selectedChat={selectedChat} />
                  </div>
                </Drawer>
              ) : (
                <ChatInterface empName={empName} setChatDrawer={setChatDrawer} chatDrawer={chatDrawer} message={message} setMessage={setMessage} sendMessage={sendMessage} chatMessages={chatMessages} selectedChat={selectedChat} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;