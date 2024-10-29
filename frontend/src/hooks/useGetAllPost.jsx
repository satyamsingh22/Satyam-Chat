import { setPosts } from "@/redux/postSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

const useGetAllPost = () => {
    const dispatch = useDispatch();
    const url = "https://satyam-chat.onrender.com";
    
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${url}/api/v1/post/all`, { withCredentials: true });
                if (res.data.success) {
                   
                   dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchAllPost();
    }, []);
};

export default useGetAllPost
