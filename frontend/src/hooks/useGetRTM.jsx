import { setPosts } from "@/redux/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { setMessage } from "@/redux/chatSlice";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const {socket}= useSelector(store=>store.socketio)
    const messages = useSelector((store) => store.chat.messages);

    
    
    useEffect(() => {
        socket?.on('newMessage',(newMessage)=>{
            dispatch(setMessage([...messages,newMessage]))
        })
        return()=>{
            socket?.off('newMessage')
        }

       
    }, [messages,setMessage]);
};

export default useGetRTM
