
import '../styles/ProfilePage.css'; 

import Review from '../components/ProfileReview';
import React, { useState, useEffect } from 'react';

function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.userid;
  const [user, setUser] = useState(storedUser); // Use state instead of static localStorage

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        // Fetch fresh user data from the server
        const userResponse = await fetch(`http://localhost:3001/api/user/${userId}`);
        if (userResponse.ok) {
          const freshUserData = await userResponse.json();
          setUser(freshUserData);
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(freshUserData));
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`http://localhost:3001/api/reviews/userid/${userId}`);
        const reviewsData = reviewsResponse.ok ? await reviewsResponse.json() : [];
        setReviews(reviewsData);

      } catch (error) {
        console.error('Error fetching profile data:', error);
        setReviews([]);
      } finally {
      }
    };

    fetchUserData();
  }, [userId]);

  // Listen for focus event to refresh data when user comes back to the tab
  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        fetch(`http://localhost:3001/api/user/${userId}`)
          .then(response => response.ok ? response.json() : null)
          .then(data => {
            if (data) {
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            }
          })
          .catch(error => console.error('Error refreshing user data:', error));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userId]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const genUserReviews = reviews.map( (review) => (
    <Review key={review.reviewid} reviewId={review.reviewid} />
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