import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './button';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './Comments';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);  // Initialize with an empty array
    const dispatch = useDispatch();
    const url = "http://localhost:8000";

    // Update the comment state whenever the selectedPost changes
    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments || []); 
        }
    }, [selectedPost]);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    };

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`${url}/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to add comment.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-white max-w-5xl p-0 flex flex-col">
                <div className="flex flex-1">
                    <div className="w-1/2">
                        <img
                            className="rounded-sm my-2 w-full aspect-square object-cover rounded-l-lg"
                            src={selectedPost?.image}
                            alt="post_img"
                        />
                    </div>

                    <div className="w-1/2 flex flex-col justify-between">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs">
                                        {selectedPost?.author?.username}
                                    </Link>
                                </div>
                            </div>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent className="bg-white items-center text-center">
                                    <div className="text-orange-500 cursor-pointer w-full">Unfollow</div>
                                    <div className="text-gray-500 cursor-pointer w-full">Add to Favorite</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />

                        <div className="flex-1 overflow-y-auto max-h-96 p-4">
                            {/* Conditional rendering to avoid map on undefined */}
                            {comment?.length > 0 ? (
                                comment.map((comment) => (
                                    <Comments key={comment?._id} comment={comment} />
                                ))
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Add your comment"
                                    className="w-full outline-none border border-gray-300 p-2 rounded text-sm"
                                    onChange={changeEventHandler}
                                    value={text}
                                />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentDialog;
