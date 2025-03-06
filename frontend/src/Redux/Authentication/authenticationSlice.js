// Redux/Authentication/authenticationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  email: null,
  companyName: null,  // Add company name here
  isAuthenticated: false,
  isAdmin: false,
  usertype: null,
};

const authenticationSlice = createSlice({
  name: "authentication_user",
  initialState,
  reducers: {
    set_Authentication: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.companyName = action.payload.companyName;  // Store company name
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
      state.usertype = action.payload.usertype;
    },
    clear_Authentication: (state) => {
      state.name = null;
      state.email = null;
      state.companyName = null;  // Clear company name
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.usertype = null;
    },
  },
});

export const { set_Authentication, clear_Authentication } = authenticationSlice.actions;
export default authenticationSlice.reducer;
