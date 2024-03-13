import { createSlice } from "@reduxjs/toolkit";

export const incomeSlice = createSlice({
  name: "income",
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

export const {setData,setError,setIsLoading } = incomeSlice.actions;

export default incomeSlice.reducer;
