import '../styles/ReviewPage.css';
import React, { useState, useEffect } from 'react';
import ReviewComment from '../components/ReviewComment';

import { useParams } from 'react-router-dom';

function ReviewPage({ isLoggedIn }) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currUserId = currentUser?.userid;
    const { reviewId, albumId } = useParams();
    const [review, setReview] = useState({});
    const [album, setAlbum]   = useState({});
    const [user, setUser] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    useEffect(() => {
        fetch(`http://localhost:3001/api/review/reviewid/${reviewId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Hip-hop albums fetched from API:', data);
          setReview(data);
        });
    }, []);

    useEffect(() => {
        if (review.albumid) { 
            fetch(`http://localhost:3001/api/albums/albumid/${albumId}`)
            .then(response => response.json())
            .then(data => {
              console.log('Album fetched from API:', data);
              setAlbum(data); 
            })
            .catch(error => {
              console.error('Error fetching album:', error);
            });
        }
    }, [review.albumid]); 

       useEffect(() => {
        if (reviewId) {
            fetch(`http://localhost:3001/api/review/${reviewId}/user`)
            .then(response => response.json())
            .then(userData => {
              console.log('User fetched from API:', userData);
              setUser(userData);
            })
            .catch(error => {
              console.error('Error fetching user:', error);
            });
        }
    }, [reviewId]);

    useEffect(() => {
      if (reviewId) {
        fetch(`http://localhost:3001/api/comments/review/${reviewId}`)
        .then(response => response.json())
        .then(commentsData => {
          console.log('Comments with users:', commentsData);
          setComments(commentsData)
        })
        .catch(error => {
                  console.error('Error fetching comments:', error);
        });
      }
    }, [reviewId]);

    const handleCommentChange = (event) => {
      setNewComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
      event.preventDefault();

      if (!newComment.trim()) {
        alert('Please enter a comment.');
        return;
      }

      const commentData = {
        reviewid: parseInt(reviewId),
        userid: currUserId,
        comment: newComment.trim(),
      };

      try {
        const response = await fetch('http://localhost:3001/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData),
        });

        if (response.ok) {
          const addedComment = await response.json();
          setComments((prevComments) => [...prevComments, addedComment]);
          setNewComment('');
        } else {
          console.error('Failed to add comment:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

    const generateComments = comments.map((comment) => (
      <ReviewComment key={comment.commentid} userPic={comment.user.userpic} username={comment.user.username} comment={comment.comment} />
    ));
    
    return (
      <div className="review-page-container">
          <div className="review-container">
            { album.cover ? ( <img src={album.cover} alt="Album Cover"className="review-album-cover"  /> ) 
                            : ( <p>Loading...</p>) }
              <div className="album-review-details-container">
                  <p className="review-page-album-title">{album.title}</p>

                  <div className="review-page-rating-container">
                      <i className="bi bi-star-fill review-page-star-icon"></i>
                      <p className="review-page-rating-text">{review.rating}</p>
                  </div>

                  <div className="review-page-author">
                      <p className="review-page-author-text">review by</p>
                      <p className="review-page-author-text">{user.username}</p>
                  </div>

                  <p className="reviewpage-review-text">{review.review}</p>
              </div>
          </div>

          <hr className="review-page-hr"></hr>

          <p className="review-page-comments-header-text">review comments</p>

          <div className="review-page-comments-container">
            {generateComments}
          </div>

          <hr className="review-page-hr"></hr>

          {isLoggedIn ? (
            <form className="form-comment-container" onSubmit={handleCommentSubmit}>
              <textarea value={newComment} onChange={handleCommentChange} rows="3" placeholder="Write a comment..." className="review-comment-input" />
              <button type="submit" className="review-comment-submit-btn">ADD COMMENT</button>
          </form>
          ) : ( <p>Login to comment.</p> )}
      </div>
    );
}

export default ReviewPage;