import React from 'react';
import { useFetchPosts } from '../hooks/useFetchPosts';

const PostList = ({ fetchImpl }) => {
  const { data, loading, error } = useFetchPosts(fetchImpl);
  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">Error loading posts</div>;
  return (
    <ul>
      {data.map(p => (
        <li key={p._id}>{p.title}</li>
      ))}
    </ul>
  );
};

export default PostList;
