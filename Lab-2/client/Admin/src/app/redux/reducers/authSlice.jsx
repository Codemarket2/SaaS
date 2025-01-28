import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true"); // Store in localStorage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated"); // Clear storage on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
