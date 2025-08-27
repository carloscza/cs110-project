
import '../styles/ProfilePage.css'; 

import Review from '../components/ProfileReview';
import React from 'react';


/*function ProfilePage({profilePic, username, reviewsCnt, followersCnt, followingCnt, about})
{

    return (
        <div className="profile-container">
            <div className="profile-header-container">
                <div className="user">
                    <img src={profilePic} alt="profilepic" className="profile-pic" />
                    <p className="profile-bold-text">{username}</p>
                </div>
                <div className="profile-stats">
                    <div className="statss">
                        <p className="profile-bold-text">{reviewsCnt}</p>
                        <p className="stat-text">reviews</p>
                    </div>

                    <div className="statss">
                        <p className="profile-bold-text">{followersCnt}</p>
                        <p className="stat-text">followers</p>
                    </div>

                    <div className="statss">
                        <p className="profile-bold-text">{followingCnt}</p>
                        <p className="stat-text">following</p>
                    </div>
                </div>
            </div>

            <div className="user-profile-about">
                <p className="about">{about}</p>
            </div>

            <hr></hr>

            <div className="profile-reviews-container">

                <Review />

            </div>
        </div>
    );
}*/

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

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
            <p className="profile-bold-text">0</p>
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
        <Review />
      </div>
    </div>
  );
}
export default ProfilePage;