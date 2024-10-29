import store from '@/redux/Store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const SuggestedUser = () => {
    const { suggestedUsers } = useSelector(store => store.auth);

    return (
        <div className="my-10 p-4 bg-white shadow-md rounded-md">
            <div className="flex items-center justify-between text-sm my-5">
                <h1 className="font-semibold text-gray-700 text-lg">
                    Suggested for you
                </h1>
                <Link 
                    to="/suggested-users" // Assuming this is the route for "See All"
                    className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-600 transition duration-150 ease-in-out shadow-sm ml-7"
                >
                    See All
                </Link>
            </div>
            {/* Add a conditional check */}
            {
                suggestedUsers && suggestedUsers.length > 0 ? (
                    suggestedUsers.map((user) => (
                        <div key={user._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center gap-4">
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage className="rounded-full" src={user?.profilePicture} alt="profile_picture" />
                                        <AvatarFallback className="rounded-full bg-gray-200 text-gray-600">CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className="font-semibold text-sm text-gray-800 hover:text-yellow-600">
                                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                    </h1>
                                    <span className="text-gray-500 text-xs">{user?.bio || 'Bio here....'}</span>
                                </div>
                            </div>
                            <span className="text-yellow-700 hover:text-yellow-600 text-xs font-bold cursor-pointer transition duration-150 ease-in-out">Follow</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No suggested users available.</p>
                )
            }
        </div>
    );
};

export default SuggestedUser;
