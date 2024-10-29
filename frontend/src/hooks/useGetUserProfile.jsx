import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const url = "https://satyam-chat.onrender.com";
    // const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
            const res = await axios.get(`${url}/api/v1/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) { 
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId]);
};
export default useGetUserProfile;