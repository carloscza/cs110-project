
import '../styles/ProfilePage.css'; 

import Review from '../components/ProfileReview';
import React, { useState, useEffect } from 'react';

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userid;

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
        fetch(`http://localhost:3001/api/reviews/userid/${userId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return [];
        })
        .then(data => {
          setReviews(data);
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        });
    }, [userId]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const genUserReviews = reviews.map( (review) => (
    <Review reviewId={review.reviewid} />
  ));

  return (
    <div className="profile-container">
      <div className="profile-header-container">
        <div className="user">
          <img
            src={user.userpic || 'defaultpic.png'} 
            alt="profilepic"
            className="profile-pic"
          />
          <p className="profile-bold-text">{user.username}</p>
        </div>
        <div className="profile-stats">
          <div className="statss">
            <p className="profile-bold-text">{reviews.length}</p>
            <p className="stat-text">reviews</p>
          </div>
          <div className="statss">
            <p className="profile-bold-text">{user.followers?.length || 0}</p>
            <p className="stat-text">followers</p>
          </div>
          <div className="statss">
            <p className="profile-bold-text">{user.following?.length || 0}</p>
            <p className="stat-text">following</p>
          </div>
        </div>
      </div>

      <div className="user-profile-about">
        <p className="about">Welcome to your Trackboxd profile, {user.username}!</p>
      </div>

      <hr />

      <div className="profile-reviews-container">
        {genUserReviews}
      </div>
    </div>
  );
}
export default ProfilePage;