import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({

  
  name: "login",
  initialState: {
    isLoggedIn: localStorage.getItem('token')?true:false,
    userData: JSON.parse(localStorage.getItem('data')),
  },
  reducers: {
    singOutSuccess: (state) => {
      state.isLoggedIn = false;
      state.userData=null
    },
    setUserData: (state, action) => {
      state.isLoggedIn = true;
      state.userData = action.payload.data;
    },
  },
});

export const { singOutSuccess, setUserData } = loginSlice.actions;

export default loginSlice.reducer;
