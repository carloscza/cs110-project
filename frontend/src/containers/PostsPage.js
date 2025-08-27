import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css'; 
import '../styles/PostsPage.css'; 
import ReviewCard from '../components/ReviewCard';

function PostsPage() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Failed to fetch posts:", error));
  }, []);
  
  return (
    <div className="home-page-container">
      <div className="list-container" style={{ textAlign: 'center' }}>
        <p className="home-banner-main-text">Your Posts</p>
        <p className="home-banner-sub-text">Share all your favorites with the community</p>
      </div>

      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map(post => <ReviewCard key={post._id} item={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}
export default PostsPage;
