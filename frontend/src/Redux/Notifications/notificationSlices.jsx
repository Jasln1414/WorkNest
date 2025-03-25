import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  showDropdown: false
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(notif => !notif.is_read).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount -= 1;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.is_read = true;
      });
      state.unreadCount = 0;
    },
    setNotificationLoading: (state, action) => {
      state.loading = action.payload;
    },
    setNotificationError: (state, action) => {
      state.error = action.payload;
    },
    toggleNotificationDropdown: (state) => {
      state.showDropdown = !state.showDropdown;
    },
    closeNotificationDropdown: (state) => {
      state.showDropdown = false;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    }
  }
});

export const { 
  setNotifications, 
  addNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  setNotificationLoading, 
  setNotificationError, 
  toggleNotificationDropdown, 
  closeNotificationDropdown,
  setUnreadCount
} = notificationSlice.actions;

export default notificationSlice.reducer;