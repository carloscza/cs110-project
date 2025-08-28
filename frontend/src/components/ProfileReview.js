// ProfileReview.js

import '../styles/ProfileReview.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function ProfileReview({reviewId = 3})
{
    const [review, setReview] = useState({});
    const [album, setAlbum]   = useState({});
    const [comments, setComments] = useState([]);
    
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
            fetch(`http://localhost:3001/api/albums/albumid/${review.albumid}`)
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
        }, []);

    const navigate = useNavigate();

    const handleReviewClick = () => {
        navigate(`/reviewpage/${reviewId}/${review.albumid}`);
    };
    return (
        <div className="profile-review-container" onClick={handleReviewClick}>
            <img src={album.cover} className="profile-album-cover"/>

            <div className="review-details-container">
                <p className="profile-album-title">{album.title}</p>

                <div className="profile-review-rating">
                    <i className="bi bi-star-fill profile-star-icon"></i>
                    <p className="profile-review-text">{review.rating}</p>
                </div>

                <div className="review-snippet">
                    <p className="profile-review-snipper-text">{review.review?.slice(0, 65)}{review.review?.length > 20 && ' ...more'}</p>
                </div>

                <div className="profile-comments">
                    <i className="bi bi-chat"></i>
                    <p className="profile-comments-text">{comments.length}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileReview;