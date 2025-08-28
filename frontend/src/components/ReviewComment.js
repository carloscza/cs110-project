// ReviewComment.js

import '../styles/ReviewComment.css';

function ReviewComment({ userPic, username, comment }) {
  return (
    <div className="review-comment-container">
      <div className="review-comment-author-container">
        {userPic.trim() === "" || !userPic ? ( <i className="bi bi-person-circle" /> ) 
            : ( <img src={userPic} alt={username} className="review-comment-user-pic" /> )}
        <p className="review-comment-username-text">{username}</p>
      </div>
      <p className="review-comment-text">{comment}</p>
    </div>
  );
}

export default ReviewComment;