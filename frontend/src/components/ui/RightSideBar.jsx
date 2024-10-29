import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUser from './SuggestedUser';

const RightSideBar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className='w-fit my-10 pr-32'>
      <div>

        <span className='font-extrabold  items-center justify-center text-center mb-10 text-yellow-900 pb-8 text-2xl' >Profile</span>
        <hr className='mt-2' />
      
        <div className="flex items-center gap-2 mt-3">
          
            
          
        <Link to={`/profile/${user?._id}`}>
       
        <Avatar>
            <AvatarImage src={user?.profilePicture} alt="profile_picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
         
          <div >
          <h1 className='font-semibold text-sm '><Link to={`/profile/${user?._id}`}> {user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here....'}</span>
          </div>
        </div>
        </div>
        <SuggestedUser/>
    </div>

  )
}

export default RightSideBar