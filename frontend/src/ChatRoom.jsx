import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Input, Button, Avatar, List, Spin, message } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
//import './ChatRoom.css';

const ChatRoom = ({ user }) => {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    // Fetch chat data and user info
    const fetchChatData = async () => {
      try {
        const [chatResponse, userResponse] = await Promise.all([
          axios.get(`${baseURL}/api/chat/${otherUserId}/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          axios.get(`${baseURL}/api/users/${otherUserId}/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        
        setOtherUser(userResponse.data);
        setMessages(chatResponse.data.messages || []);
        setLoading(false);
      } catch (error) {
        message.error('Failed to load chat data');
        setLoading(false);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchChatData();

    // WebSocket connection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(
      `${wsProtocol}//${window.location.host}/ws/chat/${otherUserId}/`
    );
    
    socket.onopen = () => {
      console.log('Chat WebSocket connected');
      setChatSocket(socket);
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, receivedMessage]);
      
      // Mark message as read when received
      if (receivedMessage.sender !== user.id) {
        markMessageAsRead(receivedMessage.id);
      }
    };

    socket.onclose = () => {
      console.log('Chat WebSocket disconnected');
      // Attempt to reconnect
      setTimeout(() => {
        const newSocket = new WebSocket(
          `${wsProtocol}//${window.location.host}/ws/chat/${otherUserId}/`
        );
        setChatSocket(newSocket);
      }, 3000);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [otherUserId, user.id, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await axios.post(
        `${baseURL}/api/mark-message-read/`,
        { message_id: messageId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user.id,
      receiver: otherUserId,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    try {
      // Save message to database first
      const response = await axios.post(
        `${baseURL}/api/send-message/`,
        messageData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Add to local state
      setMessages(prev => [...prev, response.data]);
      
      // Send via WebSocket if available
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify(response.data));
      }

      setNewMessage('');
    } catch (error) {
      message.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      <Card
        title={
          <div className="chat-header">
            <Avatar 
              src={otherUser?.profile_pic ? 
                `${baseURL}${otherUser.profile_pic}` : 
                <UserOutlined />} 
            />
            <span className="chat-username">
              {otherUser?.name || 'Unknown User'}
            </span>
          </div>
        }
        className="chat-card"
      >
        <div className="messages-container">
          <List
            dataSource={messages}
            renderItem={item => (
              <List.Item
                className={`message-item ${item.sender === user.id ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  {item.content}
                </div>
                <div className="message-time">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          />
        </div>
      </Card>
    </div>
  );
};

export default ChatRoom;