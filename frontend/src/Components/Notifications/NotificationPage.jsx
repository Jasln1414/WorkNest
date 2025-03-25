import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { CheckSquare, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './NotificationSystem.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  
  const userBasicDetails = useSelector((state) => state.user_basic_details);
  const authentication_user = useSelector((state) => state.authentication_user);
  const userType = authentication_user.usertype;
  const userId = userBasicDetails.user_type_id;
  const baseURL = 'http://127.0.0.1:8000';  // Updated path

  useEffect(() => {
    fetchNotifications();
    setupWebSocket();
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId, userType]);

  const setupWebSocket = () => {
    if (userId && userType) {
      const newSocket = new WebSocket(`ws:${baseURL}/api/chat/ws/notification/${userId}/${userType.toLowerCase()}/`);
      
      newSocket.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          fetchNotifications();
        }
      };
      
      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      setSocket(newSocket);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${baseURL}/api/chat/notifications/`, {  // Updated path
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(`${baseURL}/api/chat/mark-notification-read/`, 
        { notification_id: notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.post(`${baseURL}/api/chat/mark-all-notifications-read/`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const groupNotificationsByDate = () => {
    const grouped = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp).toLocaleDateString();
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(notification);
    });
    
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate();
  const hasUnreadNotifications = notifications.some(n => !n.is_read);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-left">
          <Link to={`/${userType?.toLowerCase()}/find-job`} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <h1>Notifications</h1>
        </div>
        <div className="header-actions">
          {hasUnreadNotifications && (
            <button 
              className="mark-all-read-btn"
              onClick={markAllAsRead}
            >
              <CheckSquare size={18} />
              <span>Mark all as read</span>
            </button>
          )}
          <button 
            className="refresh-btn"
            onClick={refreshNotifications}
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div className="notifications-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={refreshNotifications}>Try Again</button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications yet</h3>
            <p>When you receive notifications, they will appear here.</p>
          </div>
        ) : (
          Object.keys(groupedNotifications).sort((a, b) => new Date(b) - new Date(a)).map(date => (
            <div key={date} className="notification-group">
              <div className="date-header">
                <span className="date-label">{date}</span>
                <div className="date-divider"></div>
              </div>
              
              <div className="notifications-list">
                {groupedNotifications[date].map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="notification-sender">
                      {notification.sender_pic ? (
                        <img 
                          src={`${baseURL}/${notification.sender_pic}`} 
                          alt={notification.sender_name} 
                          className="sender-pic"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/path/to/default-profile.jpg';
                          }}
                        />
                      ) : (
                        <div className="sender-initials">
                          {notification.sender_name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">
                        <span className="sender-name">{notification.sender_name}</span>
                        {" "}
                        {notification.message}
                      </p>
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {!notification.is_read && (
                      <span className="unread-indicator"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;