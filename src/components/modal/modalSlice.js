import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    visible:false,
    header:null,
    content:null
  },
  reducers: {
    showModal : (state)=>{
        state.visible = true
    },
    hideModal : (state)=>{
        state.visible = false
 
        state.header = null
        state.content = null

    

    },
    setHeader : (state,action)=>{
        state.header = action.payload
    },
    setContent:(state,action)=>{
      state.content=action.payload
    }
 
  },
});

export const {showModal,setHeader,setContent,hideModal } = modalSlice.actions;

export default modalSlice.reducer;
