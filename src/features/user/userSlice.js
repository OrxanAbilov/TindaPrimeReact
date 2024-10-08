import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data:null,
    error:false,
    isLoading:false
  },
  reducers: {
    setData : (state,action)=>{
        state.data = action.payload
    },
    setError : (state,action)=>{
        state.error = action.payload
    },
    setIsLoading:(state,action)=>{
      state.isLoading=action.payload
    }
 
  },
});

export const {setData,setError,setIsLoading } = userSlice.actions;

export default userSlice.reducer;
