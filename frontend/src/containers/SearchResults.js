// Search Results.js

import '../styles/SearchResults.css';
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SearchResults()
{
  const navigate      = useNavigate();
  const currUser      = JSON.parse(localStorage.getItem('user'));
  const currUserId    = currUser?.userid;
  const { query }     = useParams();
  const [res, setRes] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/search-user/by-username/?username=${encodeURIComponent(query)}`)
    .then(response => response.ok ? response.json() : [])
    .then(data => setRes(data))
    .catch(error => { console.error('Error fetching user:', error); setRes([]); });
  }, [query]);

  const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
    if (!currUserId) {
      alert('Please log in to follow users');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/follow', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          currentUserId: currUserId,
          targetUserId: targetUserId,
          action: isCurrentlyFollowing ? 'unfollow' : 'follow'
        })
      });

      const result = await response.json();

      if (response.ok) {
        setRes(prevRes => 
          prevRes.map(user => {
            if (user.userid === targetUserId) {
              if (isCurrentlyFollowing) {
                return {
                  ...user,
                  followers: user.followers.filter(id => id !== currUserId)
                };
              } else {
                return {
                  ...user,
                  followers: [...(user.followers || []), currUserId]
                };
              }
            }
            return user;
          })
        );

        console.log(result.message);
      } else {
        console.error('Error:', result.error);
        alert(result.error || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      alert('Network error. Please try again.');
    } finally {
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const genUsersResults = res.map( (user) => {
      const isFollowing = user.followers && user.followers.includes(currUserId);
      const isSelf = user.userid === currUserId;

      return (
        <div key={user._id} className="user-result-container">
          <div className='userpic-user-res-cont' onClick={() => handleUserClick(user.userid)}>
            { user.userpic === "" ? ( <i className="bi bi-person-circle user-def"></i> ) : ( user.userpic) }
            <p className='user-result-text'>{user.username}</p>
          </div>
          { isSelf ? (<></>) 
              : isFollowing ? ( <button className='user-res-unfollow-btn' onClick={() => handleFollowToggle(user.userid, true)}>unfollow</button> ) 
                  : ( <button className='user-res-follow-btn' onClick={() => handleFollowToggle(user.userid, false)}>follow</button> ) }
        </div>
      );
  });

  return (
    <>
      { res.length > 0 ? ( genUsersResults ) : ( <p className='no-user-search-text'>No user(s) found. Please search again.</p>) }
    </>
  );
}

export default SearchResults;