import { setPosts, setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import { Bookmark, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiMessageCircle } from 'react-icons/fi';
import { IoIosSend } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import CommentDialog from './CommentDialog';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Badge } from './badge';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const url = "https://satyam-chat.onrender.com";
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  
  const [liked, setLike] = useState(post?.likes?.includes(user?._id) || false);
  const [postlike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);

  const dispatch = useDispatch();

  const changeEventHandleer = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeandDislikeHandler = async () => {
    if (!user) {
      toast.error("Please log in to like posts.");
      return;
    }

    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`${url}/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      
      if (res.data.success) {
        const updatedLike = liked ? postlike - 1 : postlike + 1;
        setPostLike(updatedLike);
        setLike(!liked);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
          } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${url}/api/v1/post/delete/${post._id}`, { withCredentials: true });
      
      if (res.data.success) {
        const updatedPost = posts.filter(postItem => postItem._id !== post._id);
        dispatch(setPosts(updatedPost));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post.");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(`${url}/api/v1/post/${post._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
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

  if (!post || !post.author) {
    return null;  // Return null if the post or author is invalid
  }

  const bookmarkHandler =async()=>{
    try{
      const res = await axios.get(`${url}/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
      if(res.data.success){
      toast.success(res.data.message)
    }
    }catch(error){
      console.log(error)

    }
  }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="profile_picture" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-3'>
          <h1 className='cursor-pointer' onClick={() => navigate(`/profile/${user?._id}`)}
>{post.author?.username}</h1>
        {user?._id === post.author._id && <Badge className='bg-black text-white'>Author</Badge> }   
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className="bg-white flex flex-col items-center text-sm text-center">
            {
              post?.author?._id !== user?._id &&             <Button variant="ghost" className="cursor-pointer w-fit text-orange-500 hover:text-orange-300 font-bold bg-white">Unfollow</Button>

            }
            <Button variant="ghost" className="cursor-pointer w-fit text-gray-500 font-bold">Add to favorite</Button>
            {
              user && user._id === post.author._id && (
                <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-fit text-gray-500 font-bold">
                  Delete
                </Button>
              )
            }
          </DialogContent>
        </Dialog>
      </div>

      <img className='rounded-sm my-2 w-full aspect-square object-cover' 
           src={post.image} 
           alt="post_img" />
      
      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-3'>
          {
            liked ? 
              <FaHeart onClick={likeandDislikeHandler} size={'20px'} className='cursor-pointer text-red-400' /> 
              : 
              <FaRegHeart size={'20px'} onClick={likeandDislikeHandler}  className='cursor-pointer'/>
          }
          <FiMessageCircle onClick={()  => {
            dispatch(setSelectedPost(post));
setOpen(true);}
          }  size={'20px'} className='cursor-pointer hover:text-gray-600' />
          <IoIosSend size={'20px'} className='cursor-pointer hover:text-gray-600' />
        </div>

        <Bookmark onClick={bookmarkHandler} size={'20px'} className='cursor-pointer hover:text-gray-600' />
      </div>

      <span className='font-medium block mb-2'>{postlike} Likes</span>
      <p>
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>
      {
        comment.length===0 ? "" :  <span onClick={()  => {
          dispatch(setSelectedPost(post));
setOpen(true);}} className='cursor-pointer text-sm text-gray-400'>
      View all {comment.length} Comments
    </span>
      }
     
      <CommentDialog open={open} setOpen={setOpen} />

      <div className='flex items-center justify-center'>
        <input
          type='text'
          placeholder='Add a comment...'
          value={text}
          onChange={changeEventHandleer}
          className='outline-none text-sm w-full'
        />
        {
          text && <span onClick={commentHandler} className='text-white bg-black p-1 text-sm cursor-pointer'>Post</span>
        }
      </div>
    </div>
  );
};

export default Post;
