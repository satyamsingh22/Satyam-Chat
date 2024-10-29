import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Message = ({ selectedUser }) => {
  useGetRTM()
  useGetAllMessage(selectedUser);

  const messages = useSelector((store) => store.chat.messages);
  const user = useSelector((store) => store.auth.user); // Access user directly

  // Check if we have the necessary IDs in the console
  console.log("Logged-in user ID:", user?._id);
  console.log("Selected user ID:", selectedUser?._id);
  console.log("Messages:", messages);

  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col justify-center items-center'>
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className='bg-gray-400 text-white h-8 my-2'>View Profile</Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-3 mt-4'>
        {messages && messages.map((msg) => (
          <div 
            key={msg._id} 
            className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-2 rounded-lg max-w-xs ${
                msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message;
