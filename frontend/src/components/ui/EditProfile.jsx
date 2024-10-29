import store from '@/redux/Store';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef(null);
    const { user } = useSelector((store) => store.auth);

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: null, // Initialize to null
        bio: user?.bio || '',
        gender: user?.gender || '',
    });
    const url = "http://localhost:8000";

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Frontend adjustments
    const fileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePicture: file }); // Store the actual file
        }
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    };

    const editProfile = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if (input.profilePicture) {
            formData.append("profilePhoto", input.profilePicture); // Use the file directly
        }

        try {
            setLoading(true);
            const res = await axios.post(`${url}/api/v1/user/profile/edit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (res.data?.success) { // Added optional chaining for safety
                const updatedUserData = {
                    ...user,
                    bio: res.data.user.bio,
                    profilePicture: res.data.user.profilePicture,
                    gender: res.data.user.gender,
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user._id}`);
                toast.success(res.data.message);
            } else {
                toast.error(res.data?.message || 'Something went wrong!'); // Handle missing message
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'An error occurred!'); // Handle potential missing message
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-xl'>Edit Profile</h1>
                <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src={input.profilePicture ? URL.createObjectURL(input.profilePicture) : user?.profilePicture} alt="profile_picture" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here....'}</span>
                        </div>
                    </div>

                    <input ref={imageRef} onChange={fileChange} type="file" className='hidden' />
                    <Button onClick={() => imageRef.current.click()} className="bg-yellow-700 hover:bg-yellow-500 text-white">Change Photo</Button>
                </div>

                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea
                        value={input.bio}
                        onChange={(e) => setInput({ ...input, bio: e.target.value })}
                        name="bio"
                        className="focus-visible:ring-transparent"
                    />
                </div>

                <div>
                    <h1 className='mb-2 font-bold'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex justify-end'>
                    {
                        loading ? (
                            <Button className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={editProfile} className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    );
};

export default EditProfile;
