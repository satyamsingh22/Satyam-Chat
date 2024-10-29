import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './dialog';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Textarea } from './textarea';
import { Button } from './button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/Store';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
    const imgRef = useRef();
    const [file, setFile] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const url = 'https://satyam-chat.onrender.com'; // Your backend URL
    const {user} = useSelector(store=>store.auth)
    const dispatch = useDispatch()
    const {posts} = useSelector(store=>store.post)


    const filechangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    };

    const createPostHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('caption', caption);
        if (imagePreview) {
            formData.append('image', file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${url}/api/v1/post/addpost`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setPosts([,res.data.post,...posts]))
                toast.success(res.data.message);
                setOpen(false); // Close the modal after successful post creation
                setCaption(''); // Reset the caption
                setImagePreview(''); // Clear the image preview
                setFile(''); // Clear the file
            }
        } catch (error) {cd 
            console.log(error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent className="bg-white" onInteractOutside={() => setOpen(false)}>
                <DialogHeader className="text-center font-semibold">Create New Post</DialogHeader>

                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="img" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-xs text-gray-600'>Bio here....</span>
                    </div>
                </div>

                <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="focus-visible:ring-transparent border-none"
                    placeholder="Write a caption...."
                />

                {imagePreview && (
                    <div className="w-full h-64 flex items-center justify-center">
                        <img
                            src={imagePreview}
                            alt="preview_img"
                            className="w-64 h-64 object-contain rounded-md border"
                        />
                    </div>
                )}

                <input
                    ref={imgRef}
                    type="file"
                    className='hidden'
                    onChange={filechangeHandler}
                />

                <Button onClick={() => imgRef.current.click()} className="w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf]">
                    Select from computer
                </Button>

                {imagePreview && (
                    loading ? (
                        <Button className="mt-4">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        </Button>
                    ) : (
                        <Button
                            onClick={createPostHandler}
                            type='submit'
                            className="w-full bg-black hover:bg-blue-600 text-white mt-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out"
                        >
                            Post
                        </Button>
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePost;
