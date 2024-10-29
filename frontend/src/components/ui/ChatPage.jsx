import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { MessageCircleCode } from "lucide-react";
import { Input } from './input'; 
import { Button } from './button';
import Message from "./Message";
import axios from "axios";
import { setMessage } from "@/redux/chatSlice";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const [textMessage, setTextMessage] = useState('');
  const url = "http://localhost:8000";
  const { onlineUsers = [], messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(`${url}/api/v1/message/send/${receiverId}`, { textMessage }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setMessage([...(messages || []), res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">
          {user?.username ? user.username : "User not logged in"}
        </h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers?.length > 0 ? (
            suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div onClick={() => dispatch(setSelectedUser(suggestedUser))} key={suggestedUser._id} className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-3">
                  <Avatar className='w-14 h-14'>
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium">{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : "text-red-600"}`}>
                      {isOnline ? 'online' : 'offline'}
                    </span> 
                  </div>
                </div>
              );
            })
          ) : (
            <p>No suggested users available</p>
          )}
        </div>
      </section>

      {selectedUser ? (
        <section className="flex-1 border-1 border-1-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-2 py-2 border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt='profile'/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Message selectedUser={selectedUser}/>
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type='text' className='flex-1 mr-2 focus-visible:ring-transparent' placeholder="Messages..."/>
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-2"/>
          <h1 className="font-medium text-xl">Your Messages</h1>
          <span>Send a message to start the chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
