import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setMessage } from "@/redux/chatSlice";

const useGetAllMessage = (selectedUser) => {
    const dispatch = useDispatch();
    const url = "https://satyam-chat.onrender.com";
    
    useEffect(() => {
        const fetchAllMessage = async () => {
            if (!selectedUser?._id) return; // Exit if no selectedUser
            
            try {
                const res = await axios.get(`${url}/api/v1/message/all/${selectedUser._id}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setMessage(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchAllMessage();
    }, [selectedUser, dispatch]); // Run effect whenever selectedUser changes
};

export default useGetAllMessage;
