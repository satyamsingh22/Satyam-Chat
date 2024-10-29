import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post);

  // Ensure that posts exist before rendering
  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div>
      {
        posts
          .filter(post => post && post._id)  // Filter out any invalid or null posts
          .map((post) => <Post key={post._id} post={post} />)
      }
    </div>
  );
};

export default Posts;
