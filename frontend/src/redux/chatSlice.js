import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:[],
        messages:[]
    },
    reducers:{
        //actioms
        setOnlineUser:(state,action)=>{
            state.onlineUsers= action.payload;
        },
        setMessage:(state,action)=>{
            state.messages= action.payload;
        }
        
    }
})
export const {setOnlineUser,setMessage}=chatSlice.actions
export default chatSlice.reducer 