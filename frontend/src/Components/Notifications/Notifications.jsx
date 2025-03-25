import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bell, CheckSquare } from 'lucide-react';
import './NotificationSystem.css';

// Import Redux actions
import {
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setUnreadCount,
  setNotificationLoading,
  setNotificationError,
  toggleNotificationDropdown,
  closeNotificationDropdown
} from '../../Redux/Notifications/notificationSlices';

const NotificationsComponent = () => {
  const dispatch = useDispatch();
  
  // Safely get state from Redux with defaults
  const notificationState = useSelector((state) => state.notification || {});
  const {
    notifications = [],
    unreadCount = 0,
    loading = false,
    error = null,
    showDropdown = false
  } = notificationState;
  
  // Safely get user data from Redux
  const userBasicDetails = useSelector((state) => state.user_basic_details || {});
  const authentication_user = useSelector((state) => state.authentication_user || {});
  const userType = authentication_user?.usertype || '';
  const userId = userBasicDetails?.user_type_id || '';
  const baseURL = 'http://127.0.0.1:8000';
  
  const dropdownRef = useRef(null);

  // Removed the problematic useEffect with useSelector inside
  // Instead, we'll use the existing useSelector calls at the component level

  useEffect(() => {
    if (userId && userType) {
      fetchNotifications();
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(closeNotificationDropdown());
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, userId, userType]);

  useEffect(() => {
    if (!userId || !userType) return;

    const newSocket = new WebSocket(`ws:${baseURL}/api/chat/ws/notification/${userId}/${userType.toLowerCase()}/`);
    
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          dispatch(addNotification({
            id: Date.now(),
            message: data.message,
            sender_name: data.sender_name,
            timestamp: data.timestamp,
            is_read: false,
            sender: data.sender_id,
            sender_pic: data.sender_pic || null
          }));
        } else if (data.type === 'unread_count') {
          dispatch(setUnreadCount(data.count));
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch(setNotificationError('Connection error. Please refresh the page.'));
    };
    
    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    return () => {
      newSocket.close();
    };
  }, [userId, userType, dispatch]);

  const fetchNotifications = async () => {
    if (!userId) return;
    
    dispatch(setNotificationLoading(true));
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${baseURL}/api/chat/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      dispatch(setNotifications(response.data));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      dispatch(setNotificationError(error.message || 'Failed to load notifications'));
    } finally {
      dispatch(setNotificationLoading(false));
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await axios.post(`${baseURL}/api/chat/mark-notification-read/`, 
        { notification_id: notificationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await axios.post(`${baseURL}/api/chat/mark-all-notifications-read/`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      dispatch(markAllNotificationsAsRead());
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <div 
        className="notifications-bell" 
        onClick={() => dispatch(toggleNotificationDropdown())}
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </div>
      
      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications?.some(n => !n.is_read) && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                aria-label="Mark all as read"
              >
                <CheckSquare size={16} />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {loading ? (
              <div className="loading">Loading notifications...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : !notifications?.length ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <div className="notification-sender">
                    {notification.sender_pic ? (
                      <img 
                        src={`${baseURL}${notification.sender_pic}`} 
                        alt={notification.sender_name} 
                        className="sender-pic"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-profile.jpg';
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
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  {!notification.is_read && (
                    <span className="unread-indicator"></span>
                  )}
                </div>
              ))
            )}
          </div>
          
          {userType && (
            <div className="notifications-footer">
              <Link 
                to={`/${userType.toLowerCase()}/notifications`} 
                className="view-all-link"
                onClick={() => dispatch(closeNotificationDropdown())}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsComponent;