import React, { useState } from 'react';
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for toast messages
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/Store';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';



function LeftSidebar() {
    const dispatch = useDispatch()
    const user = useSelector(store=>store.auth)
    const navigate = useNavigate();
    const [open ,setOpen]= useState(false)
    const { likeNotification } = useSelector((store) => store.realTimeNotification);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                setAuthUser(null)
                dispatch(setAuthUser(null))
                dispatch(setAuthUser(null))
                dispatch(setPosts([]))
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

   

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        }else if(textType === "Create"){
            setOpen(true)
        }else if(textType === "Profile"){
            navigate(`/profile/${user?._id}`)

        }
        else if(textType === "Profile"){
            navigate(`/profile/${user?._id}`)

        }
        else if(textType === "Home"){
            navigate(`/`)

        }
        else if(textType === "Messages"){
            navigate(`/chat`)

        }
    };


    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
       
        { icon: <LogOut />, text: "Logout" },
    ];   

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='my-8 pl-3 font-bold text-2xl text-yellow-700' >Satyam Chat</h1>
                <hr />
                <div>
                    {sidebarItems.map((item, index) => (
                        <div
                            onClick={() => sidebarHandler(item.text)}
                            className='flex items-center gap-3 relative hover:bg-gray-200 cursor-pointer rounded-lg p-2 my-3'
                            key={index}
                        >
                            {item.icon}
                            <span>{item.text}</span>
                            {
                                item.text==='Notifications' && likeNotification.length>0 && (
                                   <Popover>
                                   <PopoverTrigger asChild>
                          
                            <Button size='icon' className='rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 hover:bg-red-600'>{likeNotification.length}</Button>
                         
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div>
                                        {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                        </div>
                                    </PopoverContent>
                                    </Popover>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen}/>
        </div>
    );
}

export default LeftSidebar;
