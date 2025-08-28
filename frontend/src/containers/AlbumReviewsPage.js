import '../styles/AlbumReviewsPage.css';

import Review from '../components/ProfileReview';
import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
function AlbumReviewsPage()
{
  const { albumId } = useParams();
  const [reviews, setReviews] = useState([]);

 useEffect(() => {
        fetch(`http://localhost:3001/api/reviews/albumid/${albumId}`)
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
    }, [albumId]);

    const generateReviews = reviews.map( (review) => (
      <Review reviewId={review.reviewid} />
    ));

  return (
    <>
    <p className="reviews-heading">Album Reviews</p>
    <div className="reviews-container">
      {generateReviews}
    </div>
    </>
  );
}

export default AlbumReviewsPage;